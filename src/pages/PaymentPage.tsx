import { useState } from "react";
import { ResidentLayout } from "@/components/layouts/ResidentLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useNavigate } from "react-router-dom";
import { IndianRupee, CreditCard, Loader2, ShieldCheck } from "lucide-react";

export default function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);
  const [method, setMethod] = useState<"upi" | "card">("upi");

  const handlePay = async () => {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 2500));
    navigate(`/resident/receipt/${id}`);
  };

  return (
    <ResidentLayout>
      <PageHeader title="Make Payment" description={`Invoice: ${id}`} />

      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-card rounded-lg border p-6 animate-fade-in">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">Amount Due</p>
            <p className="text-3xl font-semibold financial-amount mt-1">₹4,500</p>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMethod("upi")}
              className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${
                method === "upi" ? "border-primary bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              UPI
            </button>
            <button
              onClick={() => setMethod("card")}
              className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${
                method === "card" ? "border-primary bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              <CreditCard className="inline h-3.5 w-3.5 mr-1" /> Card
            </button>
          </div>

          {method === "upi" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>UPI ID</Label>
                <Input placeholder="yourname@upi" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Card Number</Label>
                <Input placeholder="4242 4242 4242 4242" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Expiry</Label>
                  <Input placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label>CVV</Label>
                  <Input placeholder="123" type="password" />
                </div>
              </div>
            </div>
          )}

          <Button className="w-full mt-6" onClick={handlePay} disabled={paying}>
            {paying ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
            ) : (
              <><IndianRupee className="mr-2 h-4 w-4" /> Pay ₹4,500</>
            )}
          </Button>

          <div className="flex items-center justify-center gap-1 mt-4 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Secure payment powered by SocietyHub</span>
          </div>
        </div>
      </div>
    </ResidentLayout>
  );
}
