import type RegisterData from "@/models/RegisterData";
import apiClient from "@/config/apiClient";
import type LoginData from "@/models/LoginData";
import type LoginResponseData from "@/models/LoginResponseData";
import type User from "@/models/User";

// POST /auth/signup
export const registerUser = async (signupData: RegisterData) => {
  const response = await apiClient.post(`/auth/signup`, signupData);
  return response.data;
};

// POST /auth/login
export const loginUser = async (loginData: LoginData) => {
  const response = await apiClient.post<LoginResponseData>("/auth/login", loginData);
  return response.data;
};

// POST /auth/logout
export const logoutUser = async () => {
  const response = await apiClient.post(`/auth/logout`);
  return response.data;
};

// GET /auth/current-user
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<any>(`/auth/current-user`);
  // Backend returns SecurityUserDetails which wraps the user object
  return response.data?.user ?? response.data;
};

// POST /auth/refresh
export const refreshToken = async () => {
  const response = await apiClient.post<LoginResponseData>(`/auth/refresh`);
  return response.data;
};

// PUT /user/{userId}
export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  const response = await apiClient.put<User>(`/user/${userId}`, userData);
  return response.data;
};

