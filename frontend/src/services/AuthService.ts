import type RegisterData from "@/models/RegisterData";
import apiClient from "@/config/apiClient";
import type LoginData from "@/models/LoginData";
import type LoginResponseData from "@/models/LoginResponseData";

// backend: POST /auth/register
export const registerUser = async (signupData: RegisterData) => {
  const response = await apiClient.post(`/auth/signup`, signupData);
  return response.data;
};

// backend: POST /auth/login
export const loginUser = async (loginData: LoginData) => {
  const response = await apiClient.post<LoginResponseData>(
    "/auth/login",
    loginData
  );
  return response.data;
};

// backend: POST /auth/logout
export const logoutUser = async () => {
  const response = await apiClient.post(`/auth/logout`);
  return response.data;
};

// backend: GET /users/email/{emailId}
export const getCurrentUser = async (emailId: string | undefined) => {
  const response = await apiClient.get<User>(`/users/email/${emailId}`);
  return response.data;
};

// backend: POST /auth/refresh
export const refreshToken = async () => {
  const response = await apiClient.post<LoginResponseData>(`/auth/refresh`);
  return response.data;
};
