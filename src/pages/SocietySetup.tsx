import { useEffect, useState, useRef } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getFlats, createFlat, deleteFlat, updateFlat } from "@/api/flats";
import { getSociety, updateSociety, createSociety } from "@/api/societies";

interface Flat {
  id: number | string;
  flatNumber: string;
  ownerName: string;
  email: string;
  area: number | string;
  societyId?: number;
}

const initialFlats: Flat[] = [];

export default function SocietySetup() {
  const [societyName, setSocietyName] = useState("Green Valley Residency");
  const [address, setAddress] = useState("123 Green Valley Road, Pune 411001");
  const [editing, setEditing] = useState(false);
  const [loadedSocietyId, setLoadedSocietyId] = useState<number | null>(null);
  const [flats, setFlats] = useState<Flat[]>(initialFlats);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();
  const { user, updateUser } = useAuth();

  // current society id used for API calls — prefer logged in user's societyId, fallback to 1
  const [currentSocietyId, setCurrentSocietyId] = useState<number>(() => Number((user as any)?.societyId || 1));

  useEffect(() => {
    let mounted = true;
    async function load() {
      // fetch society details to populate name/address/id
      try {
        const soc = await getSociety(Number(currentSocietyId));
        if (mounted && soc) {
          setSocietyName(soc.name || "");
          setAddress(soc.address || "");
          setLoadedSocietyId(Number(soc.id));
          // ensure currentSocietyId aligns with DB
          setCurrentSocietyId(Number(soc.id));
        }
      } catch (e) {
        // ignore if not found
      }

      try {
        const data = await getFlats(Number(currentSocietyId));
        if (!mounted) return;
        setFlats(
          data.map((f: any) => ({ id: f.id, flatNumber: f.flatNumber || f.flat_number || f.flatNumber, ownerName: f.ownerName || f.owner_name || f.owner, email: f.email, area: f.area, societyId: f.societyId || f.society_id }))
        );
      } catch (err) {
        // ignore for now
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [currentSocietyId]);

  const addFlat = () => {
    setFlats([...flats, { id: `new-${Date.now()}`, flatNumber: "", ownerName: "", email: "", area: "", societyId: currentSocietyId }]);
  };

  const removeFlat = async (id: number | string) => {
    // if id is numeric, delete from server
    if (typeof id === "number") {
      try {
        await deleteFlat(Number(id));
      } catch (err) {
        toast({ title: "Delete failed", description: "Could not delete flat" });
      }
    }
    setFlats(flats.filter((f) => f.id !== id));
  };

  // local state updater for a flat field (avoids colliding with api function name)
  const updateFlatLocal = (id: number | string, field: keyof Flat, value: any) => {
    setFlats(flats.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  // Lookup/search state for flat number -> show matched details (read-only)
  const [flatLookup, setFlatLookup] = useState("");
  const [matchedFlat, setMatchedFlat] = useState<Flat | null>(null);
  const [matchedFields, setMatchedFields] = useState<{ flatNumber: string; ownerName: string; email: string; area: string | number; id?: number | string }>({ flatNumber: "", ownerName: "", email: "", area: "" });

  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!flatLookup) {
      setMatchedFlat(null);
      setMatchedFields({ flatNumber: "", ownerName: "", email: "", area: "" });
      return;
    }
    const found = flats.find((f) => String(f.flatNumber).toLowerCase() === String(flatLookup).toLowerCase());
    if (found) {
      setMatchedFlat(found);
      setMatchedFields({ flatNumber: found.flatNumber || "", ownerName: found.ownerName || "", email: found.email || "", area: found.area || "", id: found.id });
    } else {
      setMatchedFlat(null);
      setMatchedFields({ flatNumber: flatLookup, ownerName: "", email: "", area: "" });
    }
  }, [flatLookup, flats]);

  const handleSave = async () => {
    // persist society details first
    try {
      await saveSociety();
    } catch (err) {
      // show error and still attempt flats
      toast({ title: "Save failed", description: "Could not update society" });
    }

    // persist new flats to server
    const toCreate = flats.filter((f) => typeof f.id === "string" && String(f.id).startsWith("new-"));
    try {
      // create new flats
      for (const f of toCreate) {
        const created = await createFlat({ flatNumber: String(f.flatNumber), ownerName: String(f.ownerName), email: String(f.email), area: Number(f.area || 0), societyId: Number(currentSocietyId) });
        // replace temporary id with real id
        setFlats((prev) => prev.map((p) => (p.id === f.id ? { ...p, id: created.id } : p)));
      }

      // update existing flats
      const toUpdate = flats.filter((f) => typeof f.id === 'number');
      for (const f of toUpdate) {
        await updateFlat(Number(f.id), { flatNumber: String(f.flatNumber), ownerName: String(f.ownerName), email: String(f.email), area: Number(f.area || 0), societyId: Number(currentSocietyId) });
      }
      setSaved(true);
      toast({ title: "Saved", description: "Society changes saved" });
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      toast({ title: "Save failed", description: "Could not save changes" });
    }
  };

  // save or create society; used by both card Save and bottom Save Changes
  const saveSociety = async () => {
    try {
      // Try update first
      const updated = await updateSociety(Number(currentSocietyId), { name: societyName, address });
      setLoadedSocietyId(Number(updated.id));
      setCurrentSocietyId(Number(updated.id));
      try { updateUser?.({ societyName }); } catch(e) {}
      return updated;
    } catch (err: any) {
      // if not found, create
      if (err?.response?.status === 404) {
        const created = await createSociety({ name: societyName, address });
        setLoadedSocietyId(Number(created.id));
        setCurrentSocietyId(Number(created.id));
        try { updateUser?.({ societyName }); } catch(e) {}
        return created;
      }
      throw err;
    }
  };

  return (
    <AdminLayout>
      <PageHeader title="Society Setup" description="Configure your society details and flat registry" />

      <div className="mx-auto max-w-4xl space-y-10 lg:mr-[28rem]">
        {/* Society Details Card */}
        <div className="bg-white dark:bg-card rounded-2xl border border-gray-200 dark:border-border shadow-lg p-8 transition-all animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-lg tracking-tight">Society Details</h3>
              <p className="text-xs text-muted-foreground mt-1">Society ID: <span className="font-mono">{loadedSocietyId ?? "-"}</span></p>
            </div>
            <div>
              {!editing ? (
                <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              ) : (
                <Button onClick={handleSave} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:from-green-600 hover:to-emerald-700">
                  {saved ? <CheckCircle className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                  {saved ? "Saved!" : "Save Changes"}
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Society Name</Label>
              <Input value={societyName} onChange={(e) => setSocietyName(e.target.value)} disabled={!editing} className="rounded-lg focus:ring-2 focus:ring-green-400" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Address</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} disabled={!editing} className="rounded-lg focus:ring-2 focus:ring-green-400" />
            </div>
          </div>
        </div>

        {/* Quick Flat Lookup Panel */}
        <div className="fixed right-8 top-28 w-96 bg-gradient-to-br from-green-50 to-white dark:from-card dark:to-muted rounded-2xl border border-green-200 dark:border-border p-6 shadow-2xl z-40 animate-fade-in hidden lg:block">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-base font-semibold text-green-700 dark:text-green-400">Quick Flat Lookup</h4>
            <Button size="sm" variant="ghost" onClick={() => { setFlatLookup(""); setMatchedFlat(null); setMatchedFields({ flatNumber: "", ownerName: "", email: "", area: "" }); }}>
              Clear
            </Button>
          </div>
          <Label className="text-xs font-semibold">Flat No</Label>
          <Input value={flatLookup} onChange={(e) => setFlatLookup(e.target.value)} placeholder="A-101" className="mb-2 rounded-lg" />
          <div className="flex gap-2 mb-3">
            <Button size="sm" className="bg-green-100 text-green-700 hover:bg-green-200" onClick={() => {
              if (matchedFlat) {
                const el = rowRefs.current[String(matchedFlat.id)];
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                else toast({ title: 'Not in list', description: 'Matched flat not loaded' });
              } else {
                toast({ title: 'No match', description: 'No flat found' });
              }
            }}>Locate</Button>
          </div>
          <div className="text-sm space-y-1">
            <div className="font-medium text-green-800 dark:text-green-300">Matched</div>
            <div><span className="font-semibold">ID:</span> {matchedFields.id ?? '-'}</div>
            <div><span className="font-semibold">Name:</span> {matchedFields.ownerName || '-'}</div>
            <div><span className="font-semibold">Email:</span> {matchedFields.email || '-'}</div>
            <div><span className="font-semibold">Area:</span> {matchedFields.area ?? '-'}</div>
          </div>
        </div>

        {/* Flat Registry Card */}
        <div className="bg-white dark:bg-card rounded-2xl border border-gray-200 dark:border-border shadow-lg p-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg tracking-tight">Flat Registry</h3>
            <Button variant="outline" size="sm" onClick={addFlat} className="hover:bg-green-50">
              <Plus className="mr-2 h-4 w-4" /> Add Flat
            </Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-[100px_1fr_1fr_100px_48px] gap-4 text-xs font-semibold text-muted-foreground px-1">
              <span>Flat No.</span>
              <span>Owner Name</span>
              <span>Email</span>
              <span>Area (sqft)</span>
              <span></span>
            </div>
            {flats.map((flat, idx) => (
              <div
                key={flat.id}
                ref={(el) => (rowRefs.current[String(flat.id)] = el)}
                className={
                  `grid grid-cols-[100px_1fr_1fr_100px_48px] gap-4 items-center rounded-xl bg-gradient-to-r from-green-50/60 to-white dark:from-card dark:to-muted shadow-sm transition-all duration-200 ${idx % 2 === 0 ? 'bg-opacity-80' : 'bg-opacity-100'} hover:scale-[1.01] hover:shadow-md animate-fade-in`
                }
              >
                <Input value={flat.flatNumber} onChange={(e) => updateFlatLocal(flat.id, "flatNumber", e.target.value)} placeholder="A-101" className="text-sm rounded-lg" />
                <Input value={flat.ownerName} onChange={(e) => updateFlatLocal(flat.id, "ownerName", e.target.value)} placeholder="Owner name" className="text-sm rounded-lg" />
                <Input value={flat.email} onChange={(e) => updateFlatLocal(flat.id, "email", e.target.value)} placeholder="email@example.com" className="text-sm rounded-lg" />
                <Input value={flat.area} onChange={(e) => updateFlatLocal(flat.id, "area", e.target.value)} placeholder="1200" className="text-sm rounded-lg" />
                <Button variant="ghost" size="icon" onClick={() => removeFlat(flat.id)} className="text-muted-foreground hover:text-destructive rounded-full hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button Floating at Bottom Right, avoid overlap with lookup panel */}
        <div className="fixed bottom-8 right-8 z-50 lg:right-[28rem]">
          <Button
            onClick={handleSave}
            className="px-8 py-3 rounded-xl text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
          >
            {saved ? <CheckCircle className="mr-2 h-5 w-5" /> : <Save className="mr-2 h-5 w-5" />}
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
