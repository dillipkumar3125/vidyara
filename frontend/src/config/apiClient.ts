import useAuth from "@/auth/store";
import { refreshToken } from "@/services/AuthService";
import axios from "axios";
import toast from "react-hot-toast";

const apiClient = axios.create({
  // backend
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

apiClient.interceptors.request.use((config: any) => {
  const accessToken = useAuth.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let pending: any[] = [];

function queueRequest(cb: any) {
  pending.push(cb);
}

function resolveQueue(newToken: string) {
  pending.forEach((cb) => cb(newToken));
  pending = [];
}

apiClient.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    const is401 = error.response?.status === 401;
    const original = error.config;
    const isAuthLoginOrRefresh = original.url?.includes("/auth/login") || original.url?.includes("/auth/refresh");

    if (!is401 || original._retry || isAuthLoginOrRefresh) {
      if (error.response && error.response.data)
        toast.error(error.response.data?.message || "An error occurred");
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queueRequest((newToken: string) => {
          if (!newToken) return reject();
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(apiClient(original));
        });
      });
    }

    isRefreshing = true;

    try {
      const loginResponse = await refreshToken();
      const newToken = loginResponse.accessToken;
      if (!newToken) throw new Error("no access token received");
      useAuth
        .getState()
        .changeLocalLoginData(loginResponse.accessToken, true);
      resolveQueue(newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(original);
    } catch (error) {
      resolveQueue("null");
      useAuth.getState().logout();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
