import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useForm, useFieldArray } from "react-hook-form";
import { getSociety } from "@/api/societies";
import { useAuth } from "@/contexts/AuthContext";
import { createAutoInvoiceConfig, getAutoInvoiceConfigs } from "@/api/autoinvoices";

export default function AutoInvoice() {
  const { user } = useAuth();
  const [society, setSociety] = useState<any>(null);
  const [configs, setConfigs] = useState<any[]>([]);

  const form = useForm({
    defaultValues: {
      issueDate: "",
      recurrenceType: "monthly",
      totalAmount: "",
      items: [{ name: "", price: "", qty: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });

  useEffect(() => {
    async function fetch() {
      if (!user?.societyId) return;
      const s = await getSociety(Number(user.societyId));
      setSociety(s);
      const c = await getAutoInvoiceConfigs(Number(user.societyId));
      setConfigs(c || []);
    }
    fetch();
  }, [user?.societyId]);

  async function onSubmit(values: any) {
    const payload = {
      ...values,
      societyId: Number(user.societyId),
      items: values.items.map((it: any) => ({ ...it, price: Number(it.price), qty: Number(it.qty) })),
    };
    await createAutoInvoiceConfig(payload);
    // refresh list
    const c = await getAutoInvoiceConfigs(Number(user.societyId));
    setConfigs(c || []);
    form.reset();
  }

  return (
    <AdminLayout>
      <PageHeader title="Auto Invoice" description="Configure recurring invoices for your society" />

      <div className="bg-card rounded-lg border p-6">
        <h3 className="font-semibold mb-4">Create Auto Invoice</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
            <FormField name="issueDate" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Date</FormLabel>
                <FormControl>
                  <Input {...field} type="date" required />
                </FormControl>
              </FormItem>
            )} />

            <FormField name="recurrenceType" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Recurrence</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recurrence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
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

            <div className="flex gap-2">
              <Button type="submit">Save Auto Invoice</Button>
            </div>
          </form>
        </Form>

        <div className="mt-6">
          <h4 className="font-medium mb-2">Existing Auto Invoices</h4>
          <ul className="space-y-2">
            {configs.map((c) => (
              <li key={c.id} className="p-3 border rounded">{c.recurrenceType} — starts {new Date(c.issueDate).toLocaleDateString()} — ₹{c.totalAmount}</li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
