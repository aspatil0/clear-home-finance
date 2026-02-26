import axios from "axios";

const LOCAL_API = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5000";

const API = axios.create({
    baseURL: LOCAL_API,
});

export interface ChargeItem {
    id: string;
    label: string;
    amount: string;
}

export interface MaintenanceConfigPayload {
    charges: ChargeItem[];
    dueDay: number;
}

export async function getMaintenanceConfig(societyId: string) {
    const res = await API.get(`/maintenance/${societyId}`);
    return res.data;
}

export async function updateMaintenanceConfig(societyId: string, payload: MaintenanceConfigPayload) {
    const res = await API.post(`/maintenance/${societyId}`, payload);
    return res.data;
}

export default API;
