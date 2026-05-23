import { Button } from "./ui/button";
import { NavLink, useNavigate } from "react-router";
import useAuth from "@/auth/store";

function Navbar() {
  const checkLogin = useAuth((state: any) => state.checkLogin);
  const logout = useAuth((state: any) => state.logout);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 py-4 px-6 md:px-12 flex flex-row justify-between items-center bg-background/50 backdrop-blur-md border-b border-border/40 transition-all">
      {/* Brand */}
      <NavLink to={"/"} className="font-bold text-xl tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity">
        <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 text-primary-foreground shadow-lg shadow-primary/20">
          V
        </span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
          Vidyara
        </span>
      </NavLink>

      {/* Navigation Links */}
      <div className="flex gap-4 items-center">
        {checkLogin() ? (
          <>
            <NavLink 
              to={"/dashboard/profile"}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Profile
            </NavLink>

            <Button
              onClick={() => {
                logout();
                navigate("/");
              }}
              size={"sm"}
              className="cursor-pointer rounded-full px-5"
              variant={"outline"}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <NavLink 
              to={"/"} 
              className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </NavLink>
            <NavLink to={"/login"}>
              <Button
                size={"sm"}
                className="cursor-pointer rounded-full px-5 border-border/50 hover:bg-muted/50"
                variant={"ghost"}
              >
                Sign In
              </Button>
            </NavLink>
            <NavLink to={"/signup"}>
              <Button
                size={"sm"}
                className="cursor-pointer rounded-full px-5 shadow-sm shadow-primary/20"
              >
                Start Learning
              </Button>
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
