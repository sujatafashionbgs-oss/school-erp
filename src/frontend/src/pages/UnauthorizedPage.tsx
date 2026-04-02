import { useAuth } from "@/context/AuthContext";

const ROLE_DASHBOARD: Record<string, string> = {
  admin: "/admin/dashboard",
  "super-admin": "/admin/dashboard",
  teacher: "/teacher/dashboard",
  student: "/student/dashboard",
  parent: "/parent/dashboard",
  accountant: "/accountant/dashboard",
  librarian: "/librarian/dashboard",
  "lab-incharge": "/lab-incharge/dashboard",
  "transport-manager": "/transport/dashboard",
  vendor: "/vendor/dashboard",
};

export function UnauthorizedPage({
  navigate,
}: { navigate: (to: string) => void }) {
  const { user } = useAuth();
  const dashboardPath = user ? ROLE_DASHBOARD[user.role] || "/login" : "/login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-6">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="Warning"
            >
              <title>Warning</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Access Denied
        </h1>
        <p className="text-muted-foreground mb-8">
          You don't have permission to view this page. This area is restricted
          to authorized roles only.
        </p>
        <button
          type="button"
          onClick={() => navigate(dashboardPath)}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Go to My Dashboard
        </button>
      </div>
    </div>
  );
}
