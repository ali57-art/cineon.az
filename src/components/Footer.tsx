import cineonReel from "@/assets/cineon-reel.png";

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-border/60 bg-card/40">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <img src={cineonReel} alt="" width={36} height={36} className="h-9 w-9 object-contain" />
            <div>
              <div className="font-display text-2xl tracking-wide text-foreground leading-none">
                Cineon
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-widest">
                Sənin Kinon
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Haqqımızda</a>
            <a href="#" className="hover:text-primary transition-colors">Əlaqə</a>
            <a href="#" className="hover:text-primary transition-colors">Gizlilik Siyasəti</a>
            <a href="#" className="hover:text-primary transition-colors">İstifadə Şərtləri</a>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40 text-center text-xs text-muted-foreground font-mono">
          © {new Date().getFullYear()} CINEON. Bütün hüquqlar qorunur.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
