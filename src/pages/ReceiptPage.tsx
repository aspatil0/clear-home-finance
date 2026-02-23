import { ResidentLayout } from "@/components/layouts/ResidentLayout";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, Download, Home } from "lucide-react";

export default function ReceiptPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <ResidentLayout>
      <div className="max-w-md mx-auto py-12 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-success/10 mb-6">
          <CheckCircle className="h-12 w-12 text-success" />
        </div>

        <h1 className="text-2xl font-semibold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-8">Your maintenance payment has been received.</p>

        <div className="bg-card rounded-lg border p-6 mb-6 text-left">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Invoice</span>
              <span className="font-medium">{id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="font-semibold financial-amount">₹4,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span>UPI</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-mono text-xs">TXN-2026-0223-4521</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span>Feb 23, 2026</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => {}}>
            <Download className="mr-2 h-4 w-4" /> Download Receipt
          </Button>
          <Button onClick={() => navigate("/resident")}>
            <Home className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </div>
      </div>
    </ResidentLayout>
  );
}
