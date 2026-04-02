import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

export type UserRole =
  | "admin"
  | "super-admin"
  | "teacher"
  | "student"
  | "parent"
  | "accountant"
  | "librarian"
  | "lab-incharge"
  | "transport-manager"
  | "vendor";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  admissionNo?: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: {
    email: string;
    password: string;
    role: UserRole;
  }) => Promise<boolean>;
  logout: () => void;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
  sessionExpired: boolean;
  clearSessionExpired: () => void;
}

// Session duration: 8 hours
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

// User profile data (no passwords stored here)
const DEMO_USERS: Record<
  string,
  { role: UserRole; name: string; id: string; admissionNo?: string }
> = {
  "admin@school.com": { role: "admin", name: "Rajesh Kumar", id: "u1" },
  "super@school.com": { role: "super-admin", name: "Priya Sharma", id: "u2" },
  "teacher@school.com": { role: "teacher", name: "Sunita Devi", id: "u3" },
  "accountant@school.com": { role: "accountant", name: "Mohan Lal", id: "u4" },
  "librarian@school.com": { role: "librarian", name: "Geeta Singh", id: "u5" },
  "lab@school.com": { role: "lab-incharge", name: "Amit Verma", id: "u6" },
  "transport@school.com": {
    role: "transport-manager",
    name: "Ramesh Yadav",
    id: "u7",
  },
  "vendor@school.com": { role: "vendor", name: "Suresh Gupta", id: "u8" },
  "parent@school.com": { role: "parent", name: "Vikram Sharma", id: "p1" },
  "2024-1045": {
    role: "student",
    name: "Aarav Sharma",
    id: "s1",
    admissionNo: "2024-1045",
  },
  "2024-1046": {
    role: "student",
    name: "Priya Singh",
    id: "s2",
    admissionNo: "2024-1046",
  },
};

// In-memory overrides for changed passwords (loaded from localStorage on init)
let changedPasswords: Record<string, string> = {};
try {
  const saved = localStorage.getItem("erp_changed_passwords");
  if (saved) changedPasswords = JSON.parse(saved);
} catch {
  changedPasswords = {};
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("erp_user");
    const expiresAt = localStorage.getItem("erp_expires_at");

    if (stored && expiresAt) {
      const expiry = Number(expiresAt);
      if (Date.now() > expiry) {
        localStorage.removeItem("erp_user");
        localStorage.removeItem("erp_expires_at");
        setSessionExpired(true);
        return;
      }
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("erp_user");
        localStorage.removeItem("erp_expires_at");
      }
    }
  }, []);

  const login = async (credentials: {
    email: string;
    password: string;
    role: UserRole;
  }): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 500));

    const { DEMO_PASSWORDS } = await import("@/data/demoCredentials");
    const demoPasswords: Record<string, string> = {
      ...DEMO_PASSWORDS,
      ...changedPasswords,
    };

    const key = credentials.email.trim();
    const profile = DEMO_USERS[key];
    const expectedPassword = demoPasswords[key];

    if (
      profile &&
      expectedPassword !== undefined &&
      profile.role === credentials.role &&
      expectedPassword === credentials.password
    ) {
      const userObj: User = {
        id: profile.id,
        email: key,
        name: profile.name,
        role: profile.role,
        admissionNo: profile.admissionNo,
      };
      setUser(userObj);
      setSessionExpired(false);
      localStorage.setItem("erp_user", JSON.stringify(userObj));
      localStorage.setItem(
        "erp_expires_at",
        String(Date.now() + SESSION_DURATION_MS),
      );
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setSessionExpired(false);
    localStorage.removeItem("erp_user");
    localStorage.removeItem("erp_expires_at");
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "Not authenticated" };

    const { DEMO_PASSWORDS } = await import("@/data/demoCredentials");
    const effectivePasswords: Record<string, string> = {
      ...DEMO_PASSWORDS,
      ...changedPasswords,
    };
    const key = user.email;
    const storedPassword = effectivePasswords[key];

    if (storedPassword === undefined || storedPassword !== currentPassword) {
      return { success: false, error: "Current password is incorrect" };
    }

    changedPasswords[key] = newPassword;
    try {
      localStorage.setItem(
        "erp_changed_passwords",
        JSON.stringify(changedPasswords),
      );
    } catch {
      // ignore storage errors
    }

    return { success: true };
  };

  const clearSessionExpired = () => setSessionExpired(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        changePassword,
        isAuthenticated: !!user,
        sessionExpired,
        clearSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
