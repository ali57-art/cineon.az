import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";

const NotificationBell = () => {
  const { unread } = useNotifications();
  return (
    <Button asChild variant="ghost" size="icon" className="relative">
      <Link to="/notifications" aria-label="Bildirişlər">
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Link>
    </Button>
  );
};

export default NotificationBell;
