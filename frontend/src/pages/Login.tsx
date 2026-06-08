import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2Icon, Shield, Zap } from "lucide-react";
import React, { useState, type FormEvent } from "react";
import type LoginData from "@/models/LoginData";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import useAuth from "@/auth/store";
import OAuth2Buttons from "@/components/OAuth2Buttons";

function Login() {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const navigate = useNavigate();
  const login = useAuth((state) => state.login);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  // backend: POST /auth/login
  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (loginData.email.trim() === "") {
      toast.error("Input required !");
      return;
    }
    if (loginData.password.trim() === "") {
      toast.error("Input required !");
      return;
    }

    try {
      setLoading(true);
      await login(loginData);
      toast.success("Login success");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Error !!");
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf6e3] dark:bg-slate-950 px-4 pt-20 pb-6 font-sans">
      <div className="flex w-full max-w-[920px] rounded-[20px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)] bg-white dark:bg-slate-900">

        <div
          className="hidden md:flex flex-col justify-between relative overflow-hidden p-10 bg-gradient-to-br from-[#f4f6f8] via-[#e8ecf0] to-[#dde3e9] dark:from-slate-800 dark:via-slate-900 dark:to-slate-950"
          style={{ flex: "0 0 42%" }}
        >
          <div className="relative z-20">
            <h2 className="text-[32px] font-extrabold text-[#1a2332] dark:text-white leading-tight mb-4">
              Welcome back, scholar.
            </h2>
            <p className="text-sm leading-relaxed text-[#4a5568] dark:text-slate-300">
              Continue your research journey. Access your courses, projects, and
              AI-powered learning tools.
            </p>
          </div>

          <div className="relative z-10 flex-1 flex items-center justify-center my-5 -mx-10 overflow-hidden">
            <img
              src="/neural-network-bg.png"
              alt="Neural network visualization"
              className="w-[110%] h-auto object-cover opacity-60 saturate-[0.8] dark:opacity-40"
            />
          </div>

          <div className="relative z-20 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                <Shield size={20} color="#2e86c1" className="dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a2332] dark:text-white m-0">Secure Access</p>
                <p className="text-xs text-[#6b7280] dark:text-slate-400 mt-0.5">End-to-end encrypted sessions.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-[#e8f8f5] dark:bg-[#1abc9c]/20 flex items-center justify-center shrink-0">
                <Zap size={20} color="#1abc9c" className="dark:text-[#1abc9c]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a2332] dark:text-white m-0">Instant Sync</p>
                <p className="text-xs text-[#6b7280] dark:text-slate-400 mt-0.5">Pick up right where you left off.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center p-10 bg-white dark:bg-slate-900">
          <h2 className="text-[26px] font-bold text-[#1a2332] dark:text-white mb-1">Sign In</h2>
          <p className="text-sm text-[#6b7280] dark:text-slate-400 mb-6">
            Sign in to continue your learning journey.
          </p>

          {error && (
            <div className="mb-4">
              <Alert variant="destructive">
                <CheckCircle2Icon />
                <AlertTitle>
                  {error?.response ? error?.response?.data?.message : error?.message}
                </AlertTitle>
              </Alert>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-[18px]">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-[13px] font-semibold text-[#1a2332] dark:text-white">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="username@email.com"
                name="email"
                value={loginData.email}
                onChange={handleInputChange}
                className="h-11 rounded-[10px] border-[1.5px] border-[#d1d5db] dark:border-slate-700 px-3.5 text-sm text-black dark:text-white bg-white dark:bg-slate-800 transition-[border-color,box-shadow] duration-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-[13px] font-semibold text-[#1a2332] dark:text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                name="password"
                value={loginData.password}
                onChange={handleInputChange}
                className="h-11 rounded-[10px] border-[1.5px] border-[#d1d5db] dark:border-slate-700 px-3.5 text-sm text-black dark:text-white bg-white dark:bg-slate-800 transition-[border-color,box-shadow] duration-200"
              />
            </div>

            <div className="flex justify-end -mt-2">
              <a href="#" className="text-[13px] text-[#1a5276] dark:text-blue-400 hover:dark:text-blue-300 no-underline font-medium transition-colors">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer h-[46px] rounded-[10px] bg-[#1a5276] hover:bg-[#154360] dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-[15px] font-semibold border-none transition-colors duration-200"
            >
              {loading ? (
                <>
                  <Spinner />
                  Please wait...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-[#e5e7eb] dark:bg-slate-700" />
              <span className="text-xs text-[#9ca3af] font-medium">OR</span>
              <div className="flex-1 h-px bg-[#e5e7eb] dark:bg-slate-700" />
            </div>

            <OAuth2Buttons />
          </form>

          <p className="text-center text-sm text-[#6b7280] dark:text-slate-400 mt-5">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#1a5276] dark:text-blue-400 hover:dark:text-blue-300 font-semibold no-underline transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <div className="flex gap-8 mt-7">
        <a href="#" className="text-[13px] text-[#6b7280] dark:text-slate-400 hover:dark:text-white no-underline transition-colors">Privacy Policy</a>
        <a href="#" className="text-[13px] text-[#6b7280] dark:text-slate-400 hover:dark:text-white no-underline transition-colors">Terms of Service</a>
        <a href="#" className="text-[13px] text-[#6b7280] dark:text-slate-400 hover:dark:text-white no-underline transition-colors">Research Ethics</a>
      </div>
    </div>
  );
}

export default Login;
