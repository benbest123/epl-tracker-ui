import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001",
});

export const getMatches = async (round?: number) => {
  const res = await api.get("/api/matches", {
    params: round ? { round } : {},
  });
  return res.data;
};

export const getTeams = async () => {
  const res = await api.get("/api/teams");
  return res.data;
};

export default api;
