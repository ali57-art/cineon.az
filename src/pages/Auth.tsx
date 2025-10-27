import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/i18n/translations";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { authSchema } from "@/lib/validation";
import { z } from "zod";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      // Validate inputs
      const validatedData = authSchema.parse({
        email: email.trim(),
        password,
        fullName: !isLogin ? fullName.trim() : undefined,
      });

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: validatedData.email,
          password: validatedData.password,
        });
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Email və ya şifrə yanlışdır");
          }
          throw error;
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email: validatedData.email,
          password: validatedData.password,
          options: {
            data: {
              full_name: validatedData.fullName || "",
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) {
          if (error.message.includes("already registered")) {
            throw new Error("Bu email artıq qeydiyyatdan keçib");
          }
          throw error;
        }
      }

      toast({
        title: isLogin ? "Xoş gəldiniz!" : "Hesab yaradıldı!",
        description: isLogin ? "Uğurla daxil oldunuz" : "Email-inizi yoxlayın",
      });

      if (isLogin) {
        navigate("/");
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: "Doğrulama xətası",
          description: "Zəhmət olmasa bütün sahələri düzgün doldurun",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Xəta",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src="/src/assets/questoindex-logo.png" 
              alt="QuestoIndex" 
              className="h-16 w-16"
            />
          </div>
          <CardTitle className="text-2xl">
            {isLogin ? t("signIn", language) : t("signUp", language)}
          </CardTitle>
          <CardDescription>
            {t("welcome", language)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <Input
                  type="text"
                  placeholder={t("fullName", language)}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className={errors.fullName ? "border-destructive" : ""}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
                )}
              </div>
            )}
            
            <div>
              <Input
                type="email"
                placeholder={t("email", language)}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>
            
            <div>
              <Input
                type="password"
                placeholder={t("password", language)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("loading", language)}
                </>
              ) : isLogin ? (
                t("signIn", language)
              ) : (
                t("signUp", language)
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
            disabled={loading}
          >
            {isLogin ? t("dontHaveAccount", language) : t("alreadyHaveAccount", language)}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;