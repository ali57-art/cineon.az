import { Film } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
            <Film className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">QuestoIndex</h1>
            <p className="text-sm text-muted-foreground">Discover Movies with OMDb Power</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
