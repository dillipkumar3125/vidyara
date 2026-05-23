import type LoginData from "@/models/LoginData";
import type LoginResponseData from "@/models/LoginResponseData";
import { loginUser, logoutUser } from "@/services/AuthService";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const LOCAL_KEY = "app_state";

type AuthState = {
  accessToken: string | null;
  authStatus: boolean;
  authLoading: boolean;
  login: (loginData: LoginData) => Promise<LoginResponseData>;
  logout: () => void;
  checkLogin: () => boolean | undefined;
  changeLocalLoginData: (
    accessToken: string,
    authStatus: boolean
  ) => void;
};

const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      authStatus: false,
      authLoading: false,

      changeLocalLoginData: (accessToken, authStatus) => {
        set({ accessToken, authStatus });
      },

      login: async (loginData) => {
        set({ authLoading: true });
        try {
          const loginResponseData = await loginUser(loginData);
          set({
            accessToken: loginResponseData.accessToken,
            authStatus: true,
          });
          return loginResponseData;
        } catch (error) {
          throw error;
        } finally {
          set({ authLoading: false });
        }
      },

      logout: async () => {
        try {
          set({ authLoading: true });
          await logoutUser();
        } catch (error) {
        } finally {
          set({ authLoading: false });
        }
        set({
          accessToken: null,
          authLoading: false,
          authStatus: false,
        });
      },

      checkLogin: () => {
        if (get().accessToken && get().authStatus) return true;
        else return false;
      },
    }),
    { name: LOCAL_KEY }
  )
);

export default useAuth;
