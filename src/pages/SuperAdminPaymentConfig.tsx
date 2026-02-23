import { useState } from "react";
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Settings, Loader2, CheckCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";

interface EmailConfig {
  smtpHost: string;
  port: string;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  useTls: boolean;
  useDefault: boolean;
}

const defaultEmailConfig: EmailConfig = {
  smtpHost: "",
  port: "587",
  username: "",
  password: "",
  fromEmail: "",
  fromName: "",
  useTls: true,
  useDefault: true,
};

const societies = [
  { id: "1", name: "Green Valley Residency", configured: true },
  { id: "2", name: "Sunrise Apartments", configured: false },
  { id: "3", name: "Lake View Heights", configured: false },
  { id: "4", name: "Palm Grove Society", configured: true },
  { id: "5", name: "Silver Oaks Residency", configured: false },
];

export default function SuperAdminPaymentConfig() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedSociety, setSelectedSociety] = useState("");
  const [emailConfig, setEmailConfig] = useState<EmailConfig>(defaultEmailConfig);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const { toast } = useToast();

  const openConfig = (name: string) => {
    setSelectedSociety(name);
    setEmailConfig(defaultEmailConfig);
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast({ title: "Configuration saved", description: `Payment config for ${selectedSociety} saved.` });
    setOpen(false);
  };

  const handleTestSend = async () => {
    setTesting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setTesting(false);
    toast({ title: "Test email sent", description: "Check the configured inbox for the test message." });
  };

  const updateEmail = (field: keyof EmailConfig, value: string | boolean) => {
    setEmailConfig((prev) => ({ ...prev, [field]: value }));
  };

  const filtered = societies.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SuperAdminLayout>
      <PageHeader title="Payment Configuration" description="Configure notification channels for each society" />

      <div className="bg-card rounded-lg border animate-fade-in">
        <div className="flex items-center gap-3 p-4 border-b">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search societies..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Society Name</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Status</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium">{s.name}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.configured
                          ? "bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))]"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {s.configured ? "Configured" : "Not Configured"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Button variant="outline" size="sm" onClick={() => openConfig(s.name)}>
                      <Settings className="mr-2 h-3.5 w-3.5" /> Configure
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Configure – {selectedSociety}</DialogTitle>
            <DialogDescription>Set up notification channels for this society.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="email" className="flex-1">Email</TabsTrigger>
              <TabsTrigger value="sms" className="flex-1">SMS</TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex-1">WhatsApp</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4 pt-4">
              <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <div>
                  <p className="text-sm font-medium">Use Default Configuration</p>
                  <p className="text-xs text-muted-foreground">Use platform-level SMTP settings</p>
                </div>
                <Switch checked={emailConfig.useDefault} onCheckedChange={(v) => updateEmail("useDefault", v)} />
              </div>

              {!emailConfig.useDefault && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>SMTP Host</Label>
                      <Input placeholder="smtp.example.com" value={emailConfig.smtpHost} onChange={(e) => updateEmail("smtpHost", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Port</Label>
                      <Input placeholder="587" value={emailConfig.port} onChange={(e) => updateEmail("port", e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input placeholder="user@example.com" value={emailConfig.username} onChange={(e) => updateEmail("username", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input type="password" placeholder="••••••••" value={emailConfig.password} onChange={(e) => updateEmail("password", e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>From Email</Label>
                      <Input placeholder="noreply@example.com" value={emailConfig.fromEmail} onChange={(e) => updateEmail("fromEmail", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>From Name</Label>
                      <Input placeholder="SocietyHub" value={emailConfig.fromName} onChange={(e) => updateEmail("fromName", e.target.value)} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">Use TLS</p>
                      <p className="text-xs text-muted-foreground">Encrypt connection with TLS</p>
                    </div>
                    <Switch checked={emailConfig.useTls} onCheckedChange={(v) => updateEmail("useTls", v)} />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sms" className="pt-4">
              <div className="bg-muted/30 rounded-lg p-8 text-center">
                <p className="text-sm text-muted-foreground">SMS configuration coming in Phase 2.</p>
              </div>
            </TabsContent>

            <TabsContent value="whatsapp" className="pt-4">
              <div className="bg-muted/30 rounded-lg p-8 text-center">
                <p className="text-sm text-muted-foreground">WhatsApp configuration coming in Phase 2.</p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleTestSend} disabled={testing || emailConfig.useDefault}>
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {testing ? "Sending..." : "Test Send"}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SuperAdminLayout>
  );
}
