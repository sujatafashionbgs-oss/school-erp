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
  Hash,
  Lock,
  Mail,
  Users,
} from "lucide-react";
import { useState } from "react";

interface StudentLoginProps {
  navigate: (path: string) => void;
}

export function StudentLogin({ navigate }: StudentLoginProps) {
  const { login, sessionExpired, clearSessionExpired } = useAuth();
  const [admissionNo, setAdmissionNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"student" | "parent">("student");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    admissionNo?: string;
    password?: string;
    credentials?: string;
  }>({});

  // Forgot password state (parent only)
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
    if (!admissionNo.trim())
      newErrors.admissionNo =
        role === "parent"
          ? "Email is required."
          : "Admission number is required.";
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
    const email = admissionNo;
    const ok = await login({ email, password, role: role as UserRole });
    setLoading(false);
    if (ok) {
      navigate(`/${role}/dashboard`);
    } else {
      setErrors({
        credentials:
          "Invalid credentials. Please check your admission number and password.",
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
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-sidebar rounded-xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap
              size={28}
              className="text-sidebar-primary-foreground"
            />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Student Portal</h2>
          <p className="text-muted-foreground mt-2">
            Login with your admission number
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
          className="space-y-5 bg-card border border-border rounded-2xl p-6 shadow-xs"
          noValidate
        >
          <div className="space-y-1.5">
            <Label>Login As</Label>
            <Select
              value={role}
              onValueChange={(v) => {
                setRole(v as "student" | "parent");
                setErrors({});
              }}
            >
              <SelectTrigger data-ocid="student_login.role.select">
                <Users size={16} className="mr-2 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>{role === "parent" ? "Email" : "Admission Number"}</Label>
            <div className="relative">
              <Hash
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={admissionNo}
                onChange={(e) => {
                  setAdmissionNo(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    admissionNo: undefined,
                    credentials: undefined,
                  }));
                }}
                placeholder={
                  role === "parent" ? "parent@school.com" : "e.g. 2024-1045"
                }
                className={`pl-9 ${
                  errors.admissionNo
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
                data-ocid="student_login.admission.input"
              />
            </div>
            {errors.admissionNo && (
              <p className="text-sm text-red-600">{errors.admissionNo}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>
                Password{" "}
                {role === "student" && (
                  <span className="text-xs text-muted-foreground">
                    (Date of Birth: YYYY-MM-DD)
                  </span>
                )}
              </Label>
              {role === "parent" && (
                <button
                  type="button"
                  onClick={openForgot}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
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
                placeholder="Enter password"
                className={`pl-9 pr-10 ${
                  errors.password
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
                data-ocid="student_login.password.input"
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
            {role === "student" && (
              <p className="text-xs text-muted-foreground">
                Forgot your password? Contact your class teacher or school
                admin.
              </p>
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
            data-ocid="student_login.submit.button"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm text-primary hover:underline"
            data-ocid="student_login.staff_login.link"
          >
            ← Staff login
          </button>
        </div>
      </div>

      {/* Forgot Password Dialog (Parent only) */}
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
                Enter your registered email address to reset your password.
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="fp-email-s">Email Address</Label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="fp-email-s"
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
                <Label htmlFor="fp-new-s">New Password</Label>
                <div className="relative">
                  <Input
                    id="fp-new-s"
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
                <Label htmlFor="fp-confirm-s">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="fp-confirm-s"
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
