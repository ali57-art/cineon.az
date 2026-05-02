import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface TrailerModalProps {
  videoKey: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const TrailerModal = ({ videoKey, open, onOpenChange }: TrailerModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-0">
      <DialogTitle className="sr-only">Trailer</DialogTitle>
      {videoKey ? (
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
            title="Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      ) : (
        <div className="aspect-video flex items-center justify-center text-muted-foreground">Trailer mövcud deyil</div>
      )}
    </DialogContent>
  </Dialog>
);

export default TrailerModal;
