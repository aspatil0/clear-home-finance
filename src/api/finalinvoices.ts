import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export async function createFinalInvoice(payload) {
  const res = await API.post("/finalinvoices", payload);
  return res.data;
}

export async function getFinalInvoices(params) {
  const res = await API.get("/finalinvoices", { params });
  return res.data;
}

export default API;
