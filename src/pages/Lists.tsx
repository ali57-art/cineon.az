import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { useLists } from "@/hooks/useLists";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, ListIcon, Globe, Lock } from "lucide-react";

const Lists = () => {
  const { lists, create } = useLists();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [pub, setPub] = useState(false);

  const submit = async () => {
    if (!name.trim()) return;
    await create.mutateAsync({ name, description: desc, is_public: pub });
    setName(""); setDesc(""); setPub(false); setOpen(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl md:text-4xl">Mənim Siyahılarım</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="w-4 h-4" /> Yeni siyahı</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Yeni siyahı yarat</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Ad" value={name} onChange={e => setName(e.target.value)} />
                <Textarea placeholder="Təsvir (ixtiyari)" value={desc} onChange={e => setDesc(e.target.value)} />
                <div className="flex items-center justify-between">
                  <span className="text-sm">Hamıya açıq</span>
                  <Switch checked={pub} onCheckedChange={setPub} />
                </div>
                <Button onClick={submit} disabled={create.isPending} className="w-full">Yarat</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {lists.isLoading ? (
          <p className="text-muted-foreground">Yüklənir…</p>
        ) : !lists.data?.length ? (
          <Card className="p-12 text-center">
            <ListIcon className="w-12 h-12 mx-auto opacity-40 mb-3" />
            <p className="text-muted-foreground">Hələ siyahın yoxdur. Yeni yarad!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lists.data.map(l => (
              <Link key={l.id} to={`/lists/${l.id}`}>
                <Card className="p-5 hover:border-primary/50 transition-colors h-full">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{l.name}</h3>
                    {l.is_public ? <Globe className="w-4 h-4 text-muted-foreground" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  {l.description && <p className="text-sm text-muted-foreground line-clamp-2">{l.description}</p>}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Lists;
