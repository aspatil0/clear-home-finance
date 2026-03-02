import { AdminLayout } from "@/components/layouts/AdminLayout";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Form, FormItem, FormLabel, FormControl, FormField } from "@/components/ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { getFlats } from "@/api/flats";
import { generateInvoices } from "@/api/invoices";
import { createFinalInvoice } from "@/api/finalinvoices";
import { getSociety } from "@/api/societies";
import { getResidentsBySociety } from "@/api/users";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  IndianRupee,
  AlertTriangle,
  Users,
  Receipt,
  Plus,
} from "lucide-react";

// Replace with API data in production
const recentInvoices = [
  { id: "INV-2026-001", flat: "A-101", owner: "Amit Patel", amount: "₹4,500", status: "paid" as const, date: "Feb 01, 2026" },
  { id: "INV-2026-002", flat: "A-102", owner: "Sunita Rao", amount: "₹4,500", status: "unpaid" as const, date: "Feb 01, 2026" },
  { id: "INV-2026-003", flat: "A-201", owner: "Vikram Singh", amount: "₹5,200", status: "overdue" as const, date: "Jan 01, 2026" },
  { id: "INV-2026-004", flat: "A-202", owner: "Neha Gupta", amount: "₹4,500", status: "paid" as const, date: "Feb 01, 2026" },
  { id: "INV-2026-005", flat: "B-101", owner: "Ramesh Iyer", amount: "₹4,800", status: "unpaid" as const, date: "Feb 01, 2026" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [flats, setFlats] = useState<any[]>([]);
  const { user } = useAuth();
  const [society, setSociety] = useState<any>(null);
  const [residents, setResidents] = useState<any[]>([]);
  const form = useForm({
    defaultValues: {
      applicationId: "Societyhub0123",
      tenantId: "",
      residentId: "",
      issueDate: "",
      dueDate: "",
      totalAmount: "",
      gracePeriodDays: "",
      description: "",
      createdBy: user?.email || "AdminUser",
      items: [{ name: "", price: "", qty: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });

  useEffect(() => {
    async function fetchSocietyAndResidents() {
      if (!user?.societyId) return;
      const soc = await getSociety(Number(user.societyId));
      setSociety(soc);
      form.setValue("tenantId", soc.tenantId);
      // Optionally set applicationId if you want to use uniqueSocietyId or something else
      // form.setValue("applicationId", soc.uniqueSocietyId);
      try {
        const res = await getResidentsBySociety(Number(user.societyId));
        setResidents(res);
      } catch (err) {
        setResidents([]); // If 404 or error, just show empty
      }
    }
    if (open) fetchSocietyAndResidents();
  }, [open, user?.societyId]);

  async function onSubmit(values: any) {
    // Prepare invoice object for FinalInvoice table
    const invoice = {
      ...values,
      totalAmount: Number(values.totalAmount),
      gracePeriodDays: Number(values.gracePeriodDays),
      items: values.items.map((item: any) => ({ ...item, price: Number(item.price), qty: Number(item.qty) })),
      tenantName: society?.name || "",
      status: "unpaid",
      societyId: user?.societyId ? Number(user.societyId) : null,
    };
    await createFinalInvoice(invoice);
    setOpen(false);
    form.reset();
    // Optionally: refresh invoice list here
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Dashboard"
        description="Overview of your society's maintenance status"
        action={
          <div className="flex gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline"><Plus className="mr-2 h-4 w-4" />Create Invoice</Button>
              </DialogTrigger>
              <DialogContent>
                <h3 className="font-semibold text-lg mb-4">Create Invoice</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <FormField name="applicationId" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application ID</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly />
                        </FormControl>
                      </FormItem>
                    )} />
                    <FormField name="tenantId" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tenant (Society)</FormLabel>
                        <Input {...field} value={society?.name || ""} readOnly />
                        {/* Optionally show tenantId as well */}
                        <div className="text-xs text-muted-foreground mt-1">Tenant ID: {society?.tenantId}</div>
                      </FormItem>
                    )} />
                    <FormField name="residentId" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resident</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger><SelectValue placeholder="Select resident" /></SelectTrigger>
                          <SelectContent>
                            {residents.map(r => (
                              <SelectItem key={r.id} value={r.id}>
                                {(r.name || r.email || r.flatNumber || 'Resident')} (ID: {r.id})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField name="issueDate" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                      </FormItem>
                    )} />
                    <FormField name="dueDate" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                      </FormItem>
                    )} />
                    <FormField name="totalAmount" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Amount</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="Total amount" />
                        </FormControl>
                      </FormItem>
                    )} />
                    <FormField name="gracePeriodDays" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grace Period Days</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="Grace period days" />
                        </FormControl>
                      </FormItem>
                    )} />
                    <FormField name="description" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Description" />
                        </FormControl>
                      </FormItem>
                    )} />
                    <FormField name="createdBy" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Created By</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly />
                        </FormControl>
                      </FormItem>
                    )} />
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Items</span>
                        <Button type="button" size="sm" onClick={() => append({ name: "", price: "", qty: "" })}>Add Item</Button>
                      </div>
                      {fields.map((item, idx) => (
                        <div key={item.id} className="flex gap-2 mb-2">
                          <FormField name={`items.${idx}.name`} control={form.control} render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input {...field} placeholder="Item name" />
                              </FormControl>
                            </FormItem>
                          )} />
                          <FormField name={`items.${idx}.price`} control={form.control} render={({ field }) => (
                            <FormItem className="w-28">
                              <FormControl>
                                <Input {...field} type="number" placeholder="Price" />
                              </FormControl>
                            </FormItem>
                          )} />
                          <FormField name={`items.${idx}.qty`} control={form.control} render={({ field }) => (
                            <FormItem className="w-20">
                              <FormControl>
                                <Input {...field} type="number" placeholder="Qty" />
                              </FormControl>
                            </FormItem>
                          )} />
                          <Button type="button" size="icon" variant="ghost" onClick={() => remove(idx)}>-</Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end gap-2">
                      <DialogClose asChild>
                        <Button type="button" variant="ghost">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Create</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button onClick={() => navigate("/admin/generate-bills")}>
              <Receipt className="mr-2 h-4 w-4" />
              Generate Bills
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Billed" value="₹2,16,000" icon={<IndianRupee className="h-5 w-5" />} trend="This month" />
        <StatCard label="Collected" value="₹1,44,000" icon={<IndianRupee className="h-5 w-5" />} variant="success" trend="66.7% collected" />
        <StatCard label="Unpaid Bills" value="12" icon={<FileText className="h-5 w-5" />} variant="warning" trend="Requires follow-up" />
        <StatCard label="Overdue" value="3" icon={<AlertTriangle className="h-5 w-5" />} variant="destructive" trend="Past due date" />
      </div>

      <div className="bg-card rounded-lg border">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-medium">Recent Invoices</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/invoices")}>\
            View All\
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Invoice</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Flat</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Owner</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((inv) => (
                <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => navigate(`/admin/invoices/${inv.id}`)}>
                  <td className="px-5 py-3.5 text-sm font-medium text-primary">{inv.id}</td>
                  <td className="px-5 py-3.5 text-sm">{inv.flat}</td>
                  <td className="px-5 py-3.5 text-sm">{inv.owner}</td>
                  <td className="px-5 py-3.5 text-sm text-right financial-amount">{inv.amount}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={inv.status} /></td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{inv.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
