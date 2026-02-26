import axios from "axios";

const API = axios.create({
  // When Vite is running on 8080 the backend should be on a different port.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export interface FlatPayload {
  flatNumber: string;
  ownerName: string;
  email: string;
  area: number;
  societyId: number;
}

export async function getFlats(societyId: number) {
  const res = await API.get(`/flats/society/${societyId}`);
  return res.data;
}

export async function createFlat(payload: FlatPayload) {
  const res = await API.post(`/flats`, payload);
  return res.data;
}

export async function deleteFlat(id: number) {
  const res = await API.delete(`/flats/${id}`);
  return res.data;
}

export async function updateFlat(id: number, payload: Partial<FlatPayload>) {
  const res = await API.put(`/flats/${id}`, payload);
  return res.data;
}

export default API;
