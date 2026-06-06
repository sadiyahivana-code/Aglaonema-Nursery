import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Token expired - handled per component
    }
    return Promise.reject(err);
  },
);

export default api;

export async function lacakResi(resi: string, kurir: string) {
  const res = await fetch("/api/tracking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resi, kurir }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}
