import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  BookMarked,
  BookOpen,
  Calculator,
  FlaskConical,
  GraduationCap,
  Loader2,
  Package,
  RefreshCw,
  ShieldCheck,
  Truck,
  User,
  UserCheck,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createActor } from "../../backend";

// ── types ─────────────────────────────────────────────────────────────────────

interface RoleCount {
  role: string;
  label: string;
  icon: React.ReactNode;
  count: number;
}

interface SessionData {
  totalOnline: number;
  roleCounts: RoleCount[];
  usingMockData: boolean;
  lastUpdated: Date;
}

// ── role metadata ─────────────────────────────────────────────────────────────

const ROLE_META: Record<string, { label: string; icon: React.ReactNode }> = {
  admin: { label: "Admin", icon: <ShieldCheck size={22} /> },
  "super-admin": { label: "Super Admin", icon: <ShieldCheck size={22} /> },
  teacher: { label: "Teacher", icon: <BookOpen size={22} /> },
  student: { label: "Student", icon: <GraduationCap size={22} /> },
  parent: { label: "Parent", icon: <User size={22} /> },
  accountant: { label: "Accountant", icon: <Calculator size={22} /> },
  librarian: { label: "Librarian", icon: <BookMarked size={22} /> },
  "lab-incharge": { label: "Lab Incharge", icon: <FlaskConical size={22} /> },
  "transport-manager": { label: "Transport Mgr", icon: <Truck size={22} /> },
  vendor: { label: "Vendor", icon: <Package size={22} /> },
};

const ALL_ROLES = Object.keys(ROLE_META);

// ── mock fallback ─────────────────────────────────────────────────────────────

const MOCK_COUNTS: Record<string, number> = {
  admin: 2,
  "super-admin": 1,
  teacher: 8,
  student: 45,
  parent: 12,
  accountant: 1,
  librarian: 1,
  "lab-incharge": 1,
  "transport-manager": 1,
  vendor: 0,
};

function buildRoleCounts(countMap: Record<string, number>): RoleCount[] {
  return ALL_ROLES.map((r) => ({
    role: r,
    label: ROLE_META[r].label,
    icon: ROLE_META[r].icon,
    count: countMap[r] ?? 0,
  }));
}

function formatDateTime(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// ── main component ────────────────────────────────────────────────────────────

export function OnlineUsersPage() {
  const { user } = useAuth();
  const { actor, isFetching: isActorLoading } = useActor(createActor);

  const [data, setData] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Register current user session on mount
  useEffect(() => {
    if (!user || !actor || isActorLoading) return;
    actor.updateSession(user.id, user.role).catch(() => {
      // silently ignore
    });
  }, [user, actor, isActorLoading]);

  const fetchData = useCallback(
    async (showSpinner = false) => {
      if (showSpinner) setIsRefreshing(true);
      try {
        if (!actor || isActorLoading) throw new Error("actor not ready");
        const sessions = await actor.loadOnlineSessions(BigInt(300));

        const countMap: Record<string, number> = {};
        for (const s of sessions) {
          if (s.isOnline) {
            countMap[s.role] = (countMap[s.role] ?? 0) + 1;
          }
        }

        const roleCounts = buildRoleCounts(countMap);
        const totalOnline = roleCounts.reduce((sum, rc) => sum + rc.count, 0);

        setData({
          totalOnline,
          roleCounts,
          usingMockData: false,
          lastUpdated: new Date(),
        });
      } catch {
        const roleCounts = buildRoleCounts(MOCK_COUNTS);
        const totalOnline = roleCounts.reduce((sum, rc) => sum + rc.count, 0);
        setData({
          totalOnline,
          roleCounts,
          usingMockData: true,
          lastUpdated: new Date(),
        });
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [actor, isActorLoading],
  );

  const resetCountdown = useCallback(() => {
    setCountdown(30);
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    refreshTimerRef.current = setTimeout(() => {
      fetchData(false).then(() => resetCountdown());
    }, 30_000);
  }, [fetchData]);

  useEffect(() => {
    fetchData(false);
    resetCountdown();
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [fetchData, resetCountdown]);

  const handleRefreshNow = async () => {
    await fetchData(true);
    resetCountdown();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Wifi size={24} className="text-primary" />
            Live Dashboard — Online Users
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time count of active sessions across all roles
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {data?.usingMockData && (
            <Badge
              variant="outline"
              className="text-amber-600 border-amber-400 bg-amber-50 dark:bg-amber-950/30 gap-1"
              data-ocid="online-users.demo-badge"
            >
              <WifiOff size={12} />
              Using demo data
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            Next refresh in{" "}
            <span className="font-semibold text-foreground tabular-nums">
              {countdown}s
            </span>
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefreshNow}
            disabled={isRefreshing}
            data-ocid="online-users.refresh.button"
          >
            {isRefreshing ? (
              <Loader2 size={14} className="animate-spin mr-1.5" />
            ) : (
              <RefreshCw size={14} className="mr-1.5" />
            )}
            Refresh Now
          </Button>
        </div>
      </div>

      {/* Total Online Stat Card */}
      {isLoading ? (
        <Skeleton className="h-36 w-full rounded-xl" />
      ) : (
        <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
          <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="p-4 rounded-2xl bg-primary-foreground/10">
              <Users size={40} className="text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-primary-foreground/70 text-sm font-medium uppercase tracking-wide">
                Total Online Users
              </p>
              <p
                className="text-7xl font-black leading-none mt-1 tabular-nums"
                data-ocid="online-users.total-count"
              >
                {data?.totalOnline ?? 0}
              </p>
              <p className="text-primary-foreground/60 text-xs mt-1">
                Last refreshed:{" "}
                {data?.lastUpdated ? formatDateTime(data.lastUpdated) : "—"}
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-primary-foreground/50">
                Active within
              </p>
              <p className="text-sm font-bold text-primary-foreground/80">
                last 5 minutes
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Role Breakdown Grid */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <UserCheck size={16} className="text-muted-foreground" />
          Role-wise Breakdown
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {ALL_ROLES.map((r) => (
              <Skeleton key={r} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
            data-ocid="online-users.role-grid"
          >
            {data?.roleCounts.map((rc) => (
              <RoleCard key={rc.role} roleCount={rc} />
            ))}
          </div>
        )}
      </div>

      {/* Footer timestamp */}
      <p className="text-xs text-muted-foreground text-right pt-2 border-t border-border">
        Last Updated:{" "}
        <span
          className="font-medium text-foreground"
          data-ocid="online-users.last-updated"
        >
          {data?.lastUpdated ? formatDateTime(data.lastUpdated) : "—"}
        </span>
      </p>
    </div>
  );
}

// ── RoleCard ──────────────────────────────────────────────────────────────────

function RoleCard({ roleCount }: { roleCount: RoleCount }) {
  const isOnline = roleCount.count > 0;

  return (
    <Card
      className={`border transition-all duration-200 hover:shadow-md ${
        isOnline
          ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20"
          : "border-border bg-card opacity-70"
      }`}
      data-ocid={`online-users.role-card.${roleCount.role}`}
    >
      <CardHeader className="pb-1 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <span
            className={
              isOnline
                ? "text-green-600 dark:text-green-400"
                : "text-muted-foreground"
            }
          >
            {roleCount.icon}
          </span>
          <Badge
            className={`text-xs tabular-nums px-2 py-0.5 ${
              isOnline
                ? "bg-green-500 hover:bg-green-500 text-white border-transparent"
                : "bg-muted text-muted-foreground border-transparent"
            }`}
          >
            {isOnline && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-1" />
            )}
            {roleCount.count}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-1">
        <CardTitle className="text-sm font-semibold text-foreground leading-tight">
          {roleCount.label}
        </CardTitle>
        <p
          className={`text-xs mt-0.5 font-medium ${
            isOnline
              ? "text-green-600 dark:text-green-400"
              : "text-muted-foreground"
          }`}
        >
          {isOnline ? "Online" : "Offline"}
        </p>
      </CardContent>
    </Card>
  );
}
