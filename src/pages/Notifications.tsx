import Header from "@/components/Header";
import { useNotifications } from "@/hooks/useNotifications";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const Notifications = () => {
  const { items, unread, markAllRead } = useNotifications();

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl">Bildirişlər {unread > 0 && <span className="text-primary">({unread})</span>}</h1>
          {unread > 0 && (
            <Button size="sm" variant="outline" onClick={markAllRead} className="gap-2">
              <Check className="w-4 h-4" /> Hamısını oxu
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto opacity-40 mb-3" />
            Bildirişin yoxdur
          </div>
        ) : (
          <div className="space-y-2">
            {items.map(n => (
              <Card key={n.id} className={cn("p-4", !n.read && "border-primary/40 bg-primary/5")}>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" style={{ opacity: n.read ? 0.3 : 1 }} />
                  <div className="flex-1">
                    <div className="font-medium">{n.title}</div>
                    {n.body && <div className="text-sm text-muted-foreground mt-1">{n.body}</div>}
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(n.created_at).toLocaleString("az-AZ")}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;
