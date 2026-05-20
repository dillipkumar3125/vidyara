import { Button } from "@/components/ui/button";
import { NavLink } from "react-router";

export default function FuturisticAuthHome() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors overflow-hidden flex flex-col justify-center items-center relative">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 px-6 text-center flex flex-col items-center justify-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          Learn Without Limits
        </h1>

        <p className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground">
          Your all‑in‑one learning platform. Explore courses, join live classrooms, and grow your knowledge — anytime, anywhere.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          <NavLink to="/signup" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto rounded-full text-lg px-8 h-14 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
              Start Learning
            </Button>
          </NavLink>
          
          <NavLink to="/login" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto rounded-full text-lg px-8 h-14 border-border/50 hover:bg-muted/50 transition-all backdrop-blur-sm"
            >
              Sign In
            </Button>
          </NavLink>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="absolute bottom-6 text-center text-sm text-muted-foreground/60 z-10">
        © {new Date().getFullYear()} Vidyara. All rights reserved.
      </footer>
    </div>
  );
}
