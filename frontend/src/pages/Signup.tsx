import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import toast from "react-hot-toast";
import type RegisterData from "@/models/RegisterData";
import { registerUser } from "@/services/AuthService";
import { useNavigate, Link } from "react-router";
import OAuth2Buttons from "@/components/OAuth2Buttons";
import { GraduationCap, UserRoundCog, Lightbulb, BookOpen } from "lucide-react";

function Signup() {
  const [data, setData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
  });

  const [role, setRole] = useState<"student" | "teacher">("student");
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData((value) => ({
      ...value,
      [event.target.name]: event.target.value,
    }));
  };

  // backend: POST /auth/register
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (data.name.trim() === "") {
      toast.error("Name is required !");
      return;
    }
    if (data.email.trim() === "") {
      toast.error("Email is required !");
      return;
    }
    if (data.password.trim() === "") {
      toast.error("Password is required !");
      return;
    }

    try {
      await registerUser(data);
      toast.success("User register successfully...");
      setData({ name: "", email: "", password: "" });
      navigate("/login");
    } catch (error) {
      toast.error("Error in registering the user...");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf6e3] px-4 pt-20 pb-6 font-sans">
      <div className="flex w-full max-w-[920px] rounded-[20px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)] bg-white">

        <div
          className="hidden md:flex flex-col justify-between relative overflow-hidden p-10"
          style={{ flex: "0 0 42%", background: "linear-gradient(160deg, #f4f6f8 0%, #e8ecf0 50%, #dde3e9 100%)" }}
        >
          <div className="relative z-20">
            <h2 className="text-[32px] font-extrabold text-[#1a2332] leading-tight mb-4">
              Start your academic journey.
            </h2>
            <p className="text-sm leading-relaxed text-[#4a5568]">
              Join thousands of scholars using AI to streamline research, enhance
              learning, and unlock deeper insights.
            </p>
          </div>

          <div className="relative z-10 flex-1 flex items-center justify-center my-5 -mx-10 overflow-hidden">
            <img
              src="/neural-network-bg.png"
              alt="Neural network visualization"
              className="w-[110%] h-auto object-cover opacity-60 saturate-[0.8]"
            />
          </div>

          <div className="relative z-20 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-[#fce8d2] flex items-center justify-center shrink-0">
                <Lightbulb size={20} color="#e8913a" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a2332] m-0">AI Research Assistant</p>
                <p className="text-xs text-[#6b7280] mt-0.5">Synthesize complex papers instantly.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-[#e8e0f7] flex items-center justify-center shrink-0">
                <BookOpen size={20} color="#7c5cbf" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a2332] m-0">Smart Library</p>
                <p className="text-xs text-[#6b7280] mt-0.5">Organize your reading list with ease.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center p-10 bg-white">
          <h2 className="text-[26px] font-bold text-[#1a2332] mb-1">Create Account</h2>
          <p className="text-sm text-[#6b7280] mb-6">
            Sign up to get started with your workspace.
          </p>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-[18px]">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-[13px] font-semibold text-[#1a2332]">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Alex Johnson"
                name="name"
                value={data.name}
                onChange={handleInputChange}
                className="h-11 rounded-[10px] border-[1.5px] border-[#d1d5db] px-3.5 text-sm text-black bg-white transition-[border-color,box-shadow] duration-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-[13px] font-semibold text-[#1a2332]">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="alex@university.edu"
                name="email"
                value={data.email}
                onChange={handleInputChange}
                className="h-11 rounded-[10px] border-[1.5px] border-[#d1d5db] px-3.5 text-sm text-black bg-white transition-[border-color,box-shadow] duration-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-[13px] font-semibold text-[#1a2332]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                name="password"
                value={data.password}
                onChange={handleInputChange}
                className="h-11 rounded-[10px] border-[1.5px] border-[#d1d5db] px-3.5 text-sm text-black bg-white transition-[border-color,box-shadow] duration-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-[13px] font-semibold text-[#1a2332] m-0">I am a...</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`flex-1 flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 bg-white cursor-pointer transition-all duration-200 ${
                    role === "student"
                      ? "border-[#5dade2] bg-[#ebf5fb] shadow-[0_0_0_3px_rgba(93,173,226,0.15)]"
                      : "border-[#e5e7eb]"
                  }`}
                >
                  <GraduationCap size={24} color={role === "student" ? "#1a5276" : "#6b7280"} />
                  <span className={`text-sm font-semibold ${role === "student" ? "text-[#1a5276]" : "text-[#6b7280]"}`}>
                    Student
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`flex-1 flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 bg-white cursor-pointer transition-all duration-200 ${
                    role === "teacher"
                      ? "border-[#5dade2] bg-[#ebf5fb] shadow-[0_0_0_3px_rgba(93,173,226,0.15)]"
                      : "border-[#e5e7eb]"
                  }`}
                >
                  <UserRoundCog size={24} color={role === "teacher" ? "#1a5276" : "#6b7280"} />
                  <span className={`text-sm font-semibold ${role === "teacher" ? "text-[#1a5276]" : "text-[#6b7280]"}`}>
                    Teacher
                  </span>
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer h-[46px] rounded-[10px] bg-[#1a5276] text-white text-[15px] font-semibold border-none transition-colors duration-200"
            >
              Create Account
            </Button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-[#e5e7eb]" />
              <span className="text-xs text-[#9ca3af] font-medium">OR</span>
              <div className="flex-1 h-px bg-[#e5e7eb]" />
            </div>

            <OAuth2Buttons />
          </form>

          <p className="text-center text-sm text-[#6b7280] mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-[#1a5276] font-semibold no-underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <div className="flex gap-8 mt-7">
        <a href="#" className="text-[13px] text-[#6b7280] no-underline">Privacy Policy</a>
        <a href="#" className="text-[13px] text-[#6b7280] no-underline">Terms of Service</a>
        <a href="#" className="text-[13px] text-[#6b7280] no-underline">Research Ethics</a>
      </div>
    </div>
  );
}

export default Signup;
