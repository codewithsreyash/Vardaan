import api from "./api";

// Expected Flask responses:
// POST /auth/register -> { token, user: { id, name, email, points } }
// POST /auth/login    -> { token, user: { id, name, email, points } }
// GET  /auth/me       -> { user: { id, name, email, points } }

export const registerApi = (body) => api.post("/auth/register", body);
export const loginApi    = (body) => api.post("/auth/login", body);
export const meApi       = ()      => api.get("/auth/me");
