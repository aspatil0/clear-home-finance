import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export async function getInvoices(societyId: number) {
  const res = await API.get(`/invoices?societyId=${societyId}`);
  return res.data;
}

export async function generateInvoices(societyId: number, invoices: any[]) {
  return API.post(`/invoices/generate`, { societyId, invoices });
}

export async function getInvoice(id: string) {
  const res = await API.get(`/invoices/${id}`);
  return res.data;
}

export async function markInvoicePaid(invoiceNumber: string) {
  const res = await API.put(`/invoices/${invoiceNumber}/pay`);
  return res.data;
}
