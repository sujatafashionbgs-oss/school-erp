import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { mockStudents } from "@/data/mockStudents";
import { useLoadingData } from "@/hooks/useLoadingData";
import { Baby, CreditCard, UserCheck } from "lucide-react";

interface ParentDashboardProps {
  navigate: (path: string) => void;
}

export function ParentDashboard({ navigate: _navigate }: ParentDashboardProps) {
  const { loading } = useLoadingData(null);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {["sk0", "sk1", "sk2"].map((k) => (
            <Skeleton key={k} className="h-24 rounded-2xl" />
          ))}
        </div>
        {["sk0", "sk1"].map((k) => (
          <Skeleton key={k} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  const children = mockStudents.slice(0, 2);
  const totalDue = children.reduce((a, s) => a + s.feeDue, 0);

  return (
    <div className="space-y-6" data-ocid="parent_dashboard.page">
      <h1 className="text-2xl font-bold text-foreground">Parent Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <Baby size={22} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">
            {children.length}
          </p>
          <p className="text-sm text-muted-foreground">Children</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <CreditCard
            size={22}
            className={`mb-2 ${totalDue > 0 ? "text-destructive" : "text-green-600"}`}
          />
          <p
            className={`text-2xl font-bold ${totalDue > 0 ? "text-destructive" : "text-green-600"}`}
          >
            {totalDue > 0 ? `₹${totalDue}` : "All Paid"}
          </p>
          <p className="text-sm text-muted-foreground">Total Fee Due</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <UserCheck size={22} className="text-green-600 mb-2" />
          <p className="text-2xl font-bold text-foreground">
            {Math.round(
              children.reduce((a, s) => a + s.attendance, 0) / children.length,
            )}
            %
          </p>
          <p className="text-sm text-muted-foreground">Avg Attendance</p>
        </div>
      </div>

      {totalDue > 0 && (
        <div
          className="bg-red-500/10 border border-red-200 rounded-2xl p-4 flex items-center justify-between gap-4"
          data-ocid="parent_dashboard.fee_alert"
        >
          <div className="flex items-center gap-3">
            <div className="bg-red-100 text-red-600 p-2 rounded-xl">
              <CreditCard size={20} />
            </div>
            <div>
              <p className="font-semibold text-foreground">Fee Payment Due</p>
              <p className="text-sm text-muted-foreground">
                ₹{totalDue} pending for your child's fees
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => _navigate("/parent/fees")}
            data-ocid="parent_dashboard.pay_button"
          >
            Pay Now
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {children.map((c, i) => (
          <div
            key={c.admissionNo}
            data-ocid={`parent_dashboard.child.${i + 1}`}
            className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                {c.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  Class {c.className}-{c.section} · {c.admissionNo}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">
                {c.attendance}% att.
              </Badge>
              {c.feeDue > 0 && (
                <Badge variant="destructive" className="text-xs">
                  ₹{c.feeDue} due
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
