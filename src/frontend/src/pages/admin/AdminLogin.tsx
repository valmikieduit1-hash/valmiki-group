import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { Eye, EyeOff, GraduationCap, Lock, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { actor } = useActor(createActor);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password");
      return;
    }
    if (!actor) {
      toast.error("Backend not ready. Please try again.");
      return;
    }
    setLoading(true);
    try {
      const result = await actor.adminLogin(username.trim(), password.trim());
      if (result.__kind__ === "ok") {
        localStorage.setItem("valmikiAdminToken", result.ok);
        toast.success("Login successful");
        navigate("/admin");
      } else {
        toast.error("Invalid credentials");
      }
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0B1F3A] via-[#0f2a4d] to-[#1a3a5c] px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <GraduationCap className="h-9 w-9 text-[#FFC247]" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">
            Valmiki Group
          </h1>
          <p className="mt-1 text-sm text-white/60">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-2xl p-8 shadow-3d">
          <h2 className="mb-6 text-center font-display text-xl font-semibold text-foreground">
            Sign In to Admin
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="login-username"
                className="mb-1.5 block text-sm font-medium text-muted-foreground"
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full rounded-lg border border-input bg-background/50 py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-colors focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                  data-ocid="admin.login.username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-1.5 block text-sm font-medium text-muted-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-lg border border-input bg-background/50 py-2.5 pl-10 pr-10 text-sm text-foreground outline-none transition-colors focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                  data-ocid="admin.login.password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#FF8A00] py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#FF8A00]/90 disabled:opacity-60"
              data-ocid="admin.login.submit_button"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Valmiki Group. All rights reserved.
        </p>
      </div>
    </div>
  );
}
