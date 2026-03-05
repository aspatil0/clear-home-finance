import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export async function createAutoInvoiceConfig(payload: any) {
  const res = await API.post("/autoinvoices", payload);
  return res.data;
}

export async function getAutoInvoiceConfigs(societyId: number) {
  const res = await API.get(`/autoinvoices?societyId=${societyId}`);
  return res.data;
}

export default API;
