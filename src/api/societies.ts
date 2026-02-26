import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export interface SocietyPayload {
  name: string;
  address?: string;
}

export async function getSociety(id: number) {
  const res = await API.get(`/societies/${id}`);
  return res.data;
}

export async function updateSociety(id: number, payload: Partial<SocietyPayload>) {
  const res = await API.put(`/societies/${id}`, payload);
  return res.data;
}

export async function createSociety(payload: SocietyPayload) {
  const res = await API.post(`/societies`, payload);
  return res.data;
}

export default API;
