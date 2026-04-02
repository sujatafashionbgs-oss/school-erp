import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockStudents } from "@/data/mockStudents";
import { Baby, CreditCard, FileText, UserCheck } from "lucide-react";

interface ParentChildrenPageProps {
  navigate: (path: string) => void;
}

export function ParentChildrenPage({ navigate }: ParentChildrenPageProps) {
  const children = mockStudents.slice(0, 2);
  const totalDue = children.reduce((a, s) => a + s.feeDue, 0);

  return (
    <div className="space-y-6" data-ocid="parent_children.page">
      <h1 className="text-2xl font-bold text-foreground">My Children</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Total Children</p>
          <p className="text-2xl font-bold text-foreground">
            {children.length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Total Fee Due</p>
          <p
            className={`text-2xl font-bold ${totalDue > 0 ? "text-destructive" : "text-green-600"}`}
          >
            {totalDue > 0 ? `₹${totalDue}` : "Paid"}
          </p>
        </div>
      </div>

      {/* Children cards */}
      <div className="space-y-4" data-ocid="parent_children.list">
        {children.map((child, i) => (
          <div
            key={child.id}
            className="bg-card border border-border rounded-2xl p-6"
            data-ocid={`parent_children.item.${i + 1}`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                {child.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {child.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Class {child.className}-{child.section} · Roll {child.rollNo}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  {child.admissionNo}
                </p>
              </div>
              <Badge className="ml-auto">{child.status}</Badge>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-secondary/50 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground">Attendance</p>
                <p
                  className={`text-lg font-bold ${child.attendance >= 75 ? "text-green-600" : "text-destructive"}`}
                >
                  {child.attendance}%
                </p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground">Fee Due</p>
                <p
                  className={`text-lg font-bold ${child.feeDue > 0 ? "text-destructive" : "text-green-600"}`}
                >
                  {child.feeDue > 0 ? `₹${child.feeDue}` : "✔ Paid"}
                </p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground">Last Exam</p>
                <p className="text-lg font-bold text-foreground">83%</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/parent/fees")}
                data-ocid={`parent_children.pay_button.${i + 1}`}
              >
                <CreditCard size={14} className="mr-1" /> Pay Fee
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/student/results")}
                data-ocid={`parent_children.results_button.${i + 1}`}
              >
                <FileText size={14} className="mr-1" /> View Results
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/student/attendance")}
                data-ocid={`parent_children.attendance_button.${i + 1}`}
              >
                <UserCheck size={14} className="mr-1" /> Attendance
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
