import { Button } from "@/components/ui/button";
import { useFollow } from "@/hooks/useFollow";
import { Check, UserPlus } from "lucide-react";

const FollowButton = ({ targetUserId }: { targetUserId: string }) => {
  const { isFollowing, toggle } = useFollow(targetUserId);
  const following = !!isFollowing.data;
  return (
    <Button
      variant={following ? "secondary" : "default"}
      size="sm"
      onClick={() => toggle.mutate()}
      disabled={toggle.isPending}
      className="gap-1.5"
    >
      {following ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
      {following ? "İzlənir" : "İzlə"}
    </Button>
  );
};

export default FollowButton;
