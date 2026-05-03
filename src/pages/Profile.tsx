import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useFollow } from "@/hooks/useFollow";
import FollowButton from "@/components/FollowButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ ratings: 0, watched: 0 });
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      let q = supabase.from("profiles").select("*");
      if (username) q = q.eq("username", username);
      else if (user) q = q.eq("id", user.id);
      else return;
      const { data } = await q.maybeSingle();
      if (!data) return;
      setProfile(data);

      const [{ count: rc }, { count: wc }, { data: act }] = await Promise.all([
        supabase.from("ratings").select("*", { count: "exact", head: true }).eq("user_id", data.id),
        supabase.from("watch_history").select("*", { count: "exact", head: true }).eq("user_id", data.id).eq("completed", true),
        supabase.from("activity").select("*").eq("user_id", data.id).order("created_at", { ascending: false }).limit(20),
      ]);
      setStats({ ratings: rc ?? 0, watched: wc ?? 0 });
      setActivity(act ?? []);
    })();
  }, [username, user]);

  const { counts } = useFollow(profile?.id);
  const isOwn = user?.id === profile?.id;

  if (!profile) {
    return (
      <div className="min-h-screen bg-background"><Header /><main className="container mx-auto p-8 text-muted-foreground">Yüklənir…</main></div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 flex-wrap">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback>{(profile.username ?? "U").slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-2xl">{profile.full_name || profile.username}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>
              {profile.bio && <p className="text-sm mt-2">{profile.bio}</p>}
            </div>
            {!isOwn && <FollowButton userId={profile.id} />}
          </div>

          <div className="grid grid-cols-4 gap-3 mt-6 text-center">
            <Stat label="İzlənən" v={stats.watched} />
            <Stat label="Reytinq" v={stats.ratings} />
            <Stat label="İzləyici" v={counts.data?.followers ?? 0} />
            <Stat label="İzləyir" v={counts.data?.following ?? 0} />
          </div>
        </Card>

        <Tabs defaultValue="activity">
          <TabsList>
            <TabsTrigger value="activity">Aktivlik</TabsTrigger>
            <TabsTrigger value="lists">Siyahılar</TabsTrigger>
          </TabsList>
          <TabsContent value="activity" className="space-y-2 mt-4">
            {activity.length === 0 && <p className="text-muted-foreground">Aktivlik yoxdur</p>}
            {activity.map(a => (
              <Card key={a.id} className="p-3 text-sm">
                <span className="font-medium capitalize">{a.type}</span>
                <span className="text-muted-foreground ml-2 text-xs">{new Date(a.created_at).toLocaleString("az-AZ")}</span>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="lists" className="mt-4">
            <p className="text-muted-foreground text-sm">Tezliklə…</p>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const Stat = ({ label, v }: { label: string; v: number }) => (
  <div>
    <div className="font-display text-2xl">{v}</div>
    <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
  </div>
);

export default Profile;
