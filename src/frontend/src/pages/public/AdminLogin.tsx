import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type UserRole, useAuth } from "@/context/AuthContext";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Shield,
} from "lucide-react";
import { useState } from "react";

interface AdminLoginProps {
  navigate: (path: string) => void;
}

const ROLES: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "super-admin", label: "Super Admin" },
  { value: "teacher", label: "Teacher" },
  { value: "accountant", label: "Accountant" },
  { value: "librarian", label: "Librarian" },
  { value: "lab-incharge", label: "Lab Incharge" },
  { value: "transport-manager", label: "Transport Manager" },
  { value: "vendor", label: "Vendor" },
];

export function AdminLogin({ navigate }: AdminLoginProps) {
  const { login, sessionExpired, clearSessionExpired } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("admin");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    credentials?: string;
  }>({});

  // Forgot password state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [fpEmail, setFpEmail] = useState("");
  const [fpStep, setFpStep] = useState<"email" | "reset" | "done">("email");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirm, setFpConfirm] = useState("");
  const [fpShowNew, setFpShowNew] = useState(false);
  const [fpShowConfirm, setFpShowConfirm] = useState(false);
  const [fpError, setFpError] = useState("");

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!password) newErrors.password = "Password is required.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    const ok = await login({ email, password, role });
    setLoading(false);
    if (ok) {
      const dashMap: Record<string, string> = {
        "super-admin": "/admin/dashboard",
      };
      navigate(dashMap[role] || `/${role}/dashboard`);
    } else {
      setErrors({
        credentials:
          "Invalid email or password. Please contact your administrator.",
      });
    }
  };

  function openForgot() {
    setFpEmail("");
    setFpStep("email");
    setFpNewPassword("");
    setFpConfirm("");
    setFpError("");
    setFpShowNew(false);
    setFpShowConfirm(false);
    setForgotOpen(true);
  }

  function handleFpEmailSubmit() {
    if (!fpEmail.trim()) {
      setFpError("Please enter your email address.");
      return;
    }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(fpEmail)) {
      setFpError("Please enter a valid email address.");
      return;
    }
    setFpError("");
    setFpStep("reset");
  }

  function handleFpReset() {
    if (!fpNewPassword) {
      setFpError("Please enter a new password.");
      return;
    }
    if (fpNewPassword.length < 6) {
      setFpError("Password must be at least 6 characters.");
      return;
    }
    if (fpNewPassword !== fpConfirm) {
      setFpError("Passwords do not match.");
      return;
    }
    setFpError("");
    setFpStep("done");
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar flex-col items-center justify-center p-12 text-sidebar-foreground">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-sidebar-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <GraduationCap
              size={40}
              className="text-sidebar-primary-foreground"
            />
          </div>
          <h1 className="text-4xl font-bold mb-4">SmartSkale ERP</h1>
          <p className="text-sidebar-accent-foreground text-lg mb-8">
            Comprehensive School Management System for modern educational
            institutions.
          </p>
          <div className="grid grid-cols-2 gap-4 text-left">
            {[
              { n: "500+", l: "Students" },
              { n: "50+", l: "Staff Members" },
              { n: "100%", l: "Digital Records" },
              { n: "24/7", l: "Access" },
            ].map((s) => (
              <div key={s.l} className="bg-sidebar-accent rounded-xl p-4">
                <p className="text-2xl font-bold text-sidebar-primary">{s.n}</p>
                <p className="text-sm text-sidebar-accent-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="lg:hidden w-14 h-14 bg-sidebar rounded-xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap
                size={28}
                className="text-sidebar-primary-foreground"
              />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Staff Login</h2>
            <p className="text-muted-foreground mt-2">
              Sign in to access the school portal
            </p>
          </div>

          {/* Session expired banner */}
          {sessionExpired && (
            <div className="mb-5 flex items-start gap-3 bg-amber-50 border border-amber-300 text-amber-800 rounded-xl px-4 py-3 text-sm">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>Session expired, please login again.</span>
              <button
                type="button"
                onClick={clearSessionExpired}
                className="ml-auto text-amber-600 hover:text-amber-800 font-bold leading-none"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            data-ocid="admin_login.modal"
            noValidate
          >
            <div className="space-y-1.5">
              <Label htmlFor="role">Role</Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as UserRole)}
              >
                <SelectTrigger data-ocid="admin_login.role.select">
                  <Shield size={16} className="mr-2 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      email: undefined,
                      credentials: undefined,
                    }));
                  }}
                  placeholder="your@email.com"
                  className={`pl-9 ${
                    errors.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  data-ocid="admin_login.email.input"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={openForgot}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      password: undefined,
                      credentials: undefined,
                    }));
                  }}
                  placeholder="Enter your password"
                  className={`pl-9 pr-10 ${
                    errors.password
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  data-ocid="admin_login.password.input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {errors.credentials && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm">
                {errors.credentials}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              data-ocid="admin_login.submit.button"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Need help? Contact your school administrator.
            </p>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/login/student")}
              className="text-sm text-primary hover:underline"
              data-ocid="admin_login.student_login.link"
            >
              Student / Parent login →
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotOpen}
        onOpenChange={(open) => {
          if (!open) setForgotOpen(false);
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>

          {fpStep === "email" && (
            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground">
                Enter your registered email address. We'll verify it and let you
                set a new password.
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="fp-email">Email Address</Label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="fp-email"
                    type="email"
                    placeholder="your@email.com"
                    value={fpEmail}
                    onChange={(e) => {
                      setFpEmail(e.target.value);
                      setFpError("");
                    }}
                    className="pl-9"
                  />
                </div>
              </div>
              {fpError && <p className="text-sm text-red-600">{fpError}</p>}
              <DialogFooter>
                <Button variant="outline" onClick={() => setForgotOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleFpEmailSubmit}>Continue</Button>
              </DialogFooter>
            </div>
          )}

          {fpStep === "reset" && (
            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground">
                Email verified: <strong>{fpEmail}</strong>. Set your new
                password below.
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="fp-new">New Password</Label>
                <div className="relative">
                  <Input
                    id="fp-new"
                    type={fpShowNew ? "text" : "password"}
                    placeholder="Min 6 characters"
                    value={fpNewPassword}
                    onChange={(e) => {
                      setFpNewPassword(e.target.value);
                      setFpError("");
                    }}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setFpShowNew((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {fpShowNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fp-confirm">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="fp-confirm"
                    type={fpShowConfirm ? "text" : "password"}
                    placeholder="Repeat new password"
                    value={fpConfirm}
                    onChange={(e) => {
                      setFpConfirm(e.target.value);
                      setFpError("");
                    }}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setFpShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {fpShowConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              {fpError && <p className="text-sm text-red-600">{fpError}</p>}
              <DialogFooter>
                <Button variant="outline" onClick={() => setFpStep("email")}>
                  Back
                </Button>
                <Button onClick={handleFpReset}>Reset Password</Button>
              </DialogFooter>
            </div>
          )}

          {fpStep === "done" && (
            <div className="py-4 text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle2 size={48} className="text-green-500" />
              </div>
              <p className="font-semibold text-lg">Password Reset Successful</p>
              <p className="text-sm text-muted-foreground">
                Your password has been updated. You can now log in with your new
                password.
              </p>
              <Button className="w-full" onClick={() => setForgotOpen(false)}>
                Back to Login
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
