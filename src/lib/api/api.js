import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "/backend" : "https://collabration-teams.onrender.com");

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function loginSuperAdmin(payload) {
  const response = await apiClient.post("/auth/login", null, {
    params: {
      email: payload.email,
      password: payload.password,
    },
  });

  return response.data;
}

export { apiClient };
