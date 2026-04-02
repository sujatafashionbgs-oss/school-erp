import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { type Grievance, mockGrievances } from "@/data/mockGrievances";
import { AlertCircle, CheckCircle2, Clock, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  Open: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "Under Review":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Resolved:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Closed: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

const PRIORITY_COLORS: Record<string, string> = {
  High: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Medium:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const STAFF = [
  "Amit Verma",
  "Sunita Devi",
  "Rajesh Kumar",
  "HR Department",
  "Accounts Office",
  "IT Department",
  "Transport Manager",
  "Principal",
];

export function GrievancePage() {
  const [grievances, setGrievances] = useState<Grievance[]>(mockGrievances);
  const [statusFilter, setStatusFilter] = useState<"All" | Grievance["status"]>(
    "All",
  );
  const [priorityFilter, setPriorityFilter] = useState<
    "All" | Grievance["priority"]
  >("All");
  const [selected, setSelected] = useState<Grievance | null>(null);
  const [newStatus, setNewStatus] = useState<Grievance["status"]>("Open");
  const [assignTo, setAssignTo] = useState("");
  const [resolution, setResolution] = useState("");

  const filtered = grievances.filter((g) => {
    const matchStatus = statusFilter === "All" || g.status === statusFilter;
    const matchPriority =
      priorityFilter === "All" || g.priority === priorityFilter;
    return matchStatus && matchPriority;
  });

  function openGrievance(g: Grievance) {
    setSelected(g);
    setNewStatus(g.status);
    setAssignTo(g.assignedTo || "");
    setResolution(g.resolution || "");
  }

  function saveUpdate() {
    if (!selected) return;
    setGrievances((prev) =>
      prev.map((g) =>
        g.id === selected.id
          ? {
              ...g,
              status: newStatus,
              assignedTo: assignTo || undefined,
              resolution: resolution || undefined,
              resolvedDate:
                newStatus === "Resolved"
                  ? new Date().toISOString().split("T")[0]
                  : g.resolvedDate,
            }
          : g,
      ),
    );
    toast.success("Grievance updated successfully");
    setSelected(null);
  }

  const total = grievances.length;
  const open = grievances.filter((g) => g.status === "Open").length;
  const underReview = grievances.filter(
    (g) => g.status === "Under Review",
  ).length;
  const resolvedThisMonth = grievances.filter(
    (g) => g.status === "Resolved",
  ).length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Grievance Management</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total",
            value: total,
            icon: MessageSquare,
            color: "text-blue-600",
          },
          {
            label: "Open",
            value: open,
            icon: AlertCircle,
            color: "text-red-600",
          },
          {
            label: "Under Review",
            value: underReview,
            icon: Clock,
            color: "text-amber-600",
          },
          {
            label: "Resolved This Month",
            value: resolvedThisMonth,
            icon: CheckCircle2,
            color: "text-green-600",
          },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                </div>
                <s.icon size={28} className={s.color} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1">
          {(["All", "Open", "Under Review", "Resolved", "Closed"] as const).map(
            (s) => (
              <Button
                key={s}
                size="sm"
                variant={statusFilter === s ? "default" : "outline"}
                onClick={() => setStatusFilter(s)}
                data-ocid={`grievances.${s.toLowerCase().replace(" ", "_")}.tab`}
              >
                {s}
              </Button>
            ),
          )}
        </div>
        <div className="flex gap-1 ml-4">
          {(["All", "High", "Medium", "Low"] as const).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={priorityFilter === p ? "secondary" : "outline"}
              onClick={() => setPriorityFilter(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket #</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((g, idx) => (
              <TableRow
                key={g.id}
                data-ocid={`grievances.item.${idx + 1}`}
                className={
                  g.priority === "High" ? "border-l-4 border-l-red-500" : ""
                }
              >
                <TableCell className="font-mono text-xs">
                  {g.ticketNo}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">{g.submittedBy}</p>
                    <p className="text-xs text-muted-foreground">{g.role}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{g.category}</TableCell>
                <TableCell className="text-sm max-w-xs truncate">
                  {g.subject}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {g.submittedDate}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${PRIORITY_COLORS[g.priority]}`}
                  >
                    {g.priority}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[g.status]}`}
                  >
                    {g.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openGrievance(g)}
                    data-ocid={`grievances.edit_button.${idx + 1}`}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Detail Sheet */}
      <Sheet
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <SheetContent
          className="w-full sm:max-w-md overflow-y-auto"
          data-ocid="grievances.sheet"
        >
          <SheetHeader>
            <SheetTitle className="text-base">{selected?.ticketNo}</SheetTitle>
          </SheetHeader>
          {selected && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Badge>{selected.category}</Badge>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${PRIORITY_COLORS[selected.priority]}`}
                  >
                    {selected.priority}
                  </span>
                </div>
                <h3 className="font-semibold">{selected.subject}</h3>
                <p className="text-sm text-muted-foreground">
                  By {selected.submittedBy} ({selected.role}) on{" "}
                  {selected.submittedDate}
                </p>
                <p className="text-sm border rounded-lg p-3 bg-muted/30">
                  {selected.description}
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Update Status</Label>
                  <Select
                    value={newStatus}
                    onValueChange={(v) =>
                      setNewStatus(v as Grievance["status"])
                    }
                  >
                    <SelectTrigger data-ocid="grievances.status.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        ["Open", "Under Review", "Resolved", "Closed"] as const
                      ).map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Assign To</Label>
                  <Select value={assignTo} onValueChange={setAssignTo}>
                    <SelectTrigger data-ocid="grievances.assign.select">
                      <SelectValue placeholder="Select staff..." />
                    </SelectTrigger>
                    <SelectContent>
                      {STAFF.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {newStatus === "Resolved" && (
                  <div className="space-y-1">
                    <Label>Resolution</Label>
                    <Textarea
                      placeholder="Describe the resolution..."
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      rows={3}
                      data-ocid="grievances.resolution.textarea"
                    />
                  </div>
                )}
              </div>

              {/* Status timeline */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  Timeline
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-muted-foreground">
                      Submitted on {selected.submittedDate}
                    </span>
                  </div>
                  {selected.assignedTo && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">
                        Assigned to {selected.assignedTo}
                      </span>
                    </div>
                  )}
                  {selected.resolvedDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-muted-foreground">
                        Resolved on {selected.resolvedDate}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={saveUpdate}
                data-ocid="grievances.save_button"
              >
                Save Changes
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
