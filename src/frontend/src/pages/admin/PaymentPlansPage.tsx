import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { mockStudents } from "@/data/mockStudents";
import { AlertCircle, CheckCircle, Clock, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Instalment {
  no: number;
  dueDate: string;
  amount: number;
  status: "Pending" | "Paid" | "Overdue";
}

interface PaymentPlan {
  id: string;
  studentName: string;
  className: string;
  totalFee: number;
  instalments: number;
  paid: number;
  nextDue: string | null;
  nextAmount: number;
  status: "On Track" | "Overdue" | "Completed";
  schedule: Instalment[];
}

const mockPaymentPlans: PaymentPlan[] = [
  {
    id: "pp1",
    studentName: "Arjun Sharma",
    className: "VII-A",
    totalFee: 24000,
    instalments: 4,
    paid: 2,
    nextDue: "2026-10-01",
    nextAmount: 6000,
    status: "On Track",
    schedule: [
      { no: 1, dueDate: "2026-04-01", amount: 6000, status: "Paid" },
      { no: 2, dueDate: "2026-07-01", amount: 6000, status: "Paid" },
      { no: 3, dueDate: "2026-10-01", amount: 6000, status: "Pending" },
      { no: 4, dueDate: "2027-01-01", amount: 6000, status: "Pending" },
    ],
  },
  {
    id: "pp2",
    studentName: "Priya Singh",
    className: "VI-B",
    totalFee: 18500,
    instalments: 3,
    paid: 1,
    nextDue: "2026-09-01",
    nextAmount: 6167,
    status: "Overdue",
    schedule: [
      { no: 1, dueDate: "2026-04-01", amount: 6167, status: "Paid" },
      { no: 2, dueDate: "2026-09-01", amount: 6167, status: "Overdue" },
      { no: 3, dueDate: "2027-01-01", amount: 6166, status: "Pending" },
    ],
  },
  {
    id: "pp3",
    studentName: "Rohan Mehta",
    className: "IX-C",
    totalFee: 30000,
    instalments: 6,
    paid: 3,
    nextDue: "2026-10-01",
    nextAmount: 5000,
    status: "On Track",
    schedule: [
      { no: 1, dueDate: "2026-04-01", amount: 5000, status: "Paid" },
      { no: 2, dueDate: "2026-05-01", amount: 5000, status: "Paid" },
      { no: 3, dueDate: "2026-06-01", amount: 5000, status: "Paid" },
      { no: 4, dueDate: "2026-10-01", amount: 5000, status: "Pending" },
      { no: 5, dueDate: "2026-11-01", amount: 5000, status: "Pending" },
      { no: 6, dueDate: "2026-12-01", amount: 5000, status: "Pending" },
    ],
  },
  {
    id: "pp4",
    studentName: "Kavya Patel",
    className: "VIII-B",
    totalFee: 26000,
    instalments: 2,
    paid: 2,
    nextDue: null,
    nextAmount: 0,
    status: "Completed",
    schedule: [
      { no: 1, dueDate: "2026-04-01", amount: 13000, status: "Paid" },
      { no: 2, dueDate: "2026-10-01", amount: 13000, status: "Paid" },
    ],
  },
  {
    id: "pp5",
    studentName: "Aditya Kumar",
    className: "X-A",
    totalFee: 32000,
    instalments: 4,
    paid: 1,
    nextDue: "2026-07-01",
    nextAmount: 8000,
    status: "Overdue",
    schedule: [
      { no: 1, dueDate: "2026-04-01", amount: 8000, status: "Paid" },
      { no: 2, dueDate: "2026-07-01", amount: 8000, status: "Overdue" },
      { no: 3, dueDate: "2026-10-01", amount: 8000, status: "Pending" },
      { no: 4, dueDate: "2027-01-01", amount: 8000, status: "Pending" },
    ],
  },
  {
    id: "pp6",
    studentName: "Sneha Joshi",
    className: "XI-Science",
    totalFee: 35000,
    instalments: 4,
    paid: 2,
    nextDue: "2026-10-01",
    nextAmount: 8750,
    status: "On Track",
    schedule: [
      { no: 1, dueDate: "2026-04-01", amount: 8750, status: "Paid" },
      { no: 2, dueDate: "2026-07-01", amount: 8750, status: "Paid" },
      { no: 3, dueDate: "2026-10-01", amount: 8750, status: "Pending" },
      { no: 4, dueDate: "2027-01-01", amount: 8750, status: "Pending" },
    ],
  },
];

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusBadge(s: PaymentPlan["status"]) {
  if (s === "On Track")
    return (
      <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
        On Track
      </Badge>
    );
  if (s === "Overdue")
    return (
      <Badge className="bg-red-500/20 text-red-700 border-red-500/30">
        Overdue
      </Badge>
    );
  return <Badge variant="secondary">Completed</Badge>;
}

function instalmentBadge(s: Instalment["status"]) {
  if (s === "Paid")
    return (
      <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
        Paid
      </Badge>
    );
  if (s === "Overdue")
    return (
      <Badge className="bg-red-500/20 text-red-700 border-red-500/30">
        Overdue
      </Badge>
    );
  return <Badge variant="outline">Pending</Badge>;
}

function addMonths(dateStr: string, n: number): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + n);
  return d.toISOString().split("T")[0];
}

export function PaymentPlansPage() {
  const [plans, setPlans] = useState<PaymentPlan[]>(mockPaymentPlans);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewPlan, setViewPlan] = useState<PaymentPlan | null>(null);
  const [search, setSearch] = useState("");

  // Create form state
  const [fStudentId, setFStudentId] = useState("");
  const [fStudentSearch, setFStudentSearch] = useState("");
  const [fTotal, setFTotal] = useState("");
  const [fInstalments, setFInstalments] = useState("4");
  const [fStartDate, setFStartDate] = useState("2026-04-01");
  const [fFrequency, setFFrequency] = useState("Monthly");

  const fStudent = mockStudents.find((s) => s.id === fStudentId);
  const nInst = Number.parseInt(fInstalments) || 4;
  const totalAmt = Number.parseFloat(fTotal) || 0;
  const baseAmt = totalAmt > 0 ? Math.floor(totalAmt / nInst) : 0;
  const freqMonths: Record<string, number> = {
    Monthly: 1,
    Quarterly: 3,
    Termly: 4,
  };

  const previewSchedule: Instalment[] = Array.from(
    { length: nInst },
    (_, i) => ({
      no: i + 1,
      dueDate: addMonths(fStartDate, i * (freqMonths[fFrequency] ?? 1)),
      amount: i === nInst - 1 ? totalAmt - baseAmt * (nInst - 1) : baseAmt,
      status: "Pending",
    }),
  );

  function handleCreate() {
    if (!fStudentId) {
      toast.error("Please select a student");
      return;
    }
    if (!totalAmt) {
      toast.error("Enter total fee amount");
      return;
    }
    const newPlan: PaymentPlan = {
      id: `pp${Date.now()}`,
      studentName: fStudent?.name ?? "Unknown",
      className: fStudent ? `${fStudent.className}-${fStudent.section}` : "",
      totalFee: totalAmt,
      instalments: nInst,
      paid: 0,
      nextDue: previewSchedule[0]?.dueDate ?? null,
      nextAmount: previewSchedule[0]?.amount ?? 0,
      status: "On Track",
      schedule: previewSchedule,
    };
    setPlans((prev) => [newPlan, ...prev]);
    setCreateOpen(false);
    setFStudentId("");
    setFTotal("");
    setFInstalments("4");
    setFStartDate("2026-04-01");
    toast.success("Payment plan created successfully");
  }

  function markPaid(planId: string, instNo: number) {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        const newSched = p.schedule.map((s) =>
          s.no === instNo ? { ...s, status: "Paid" as const } : s,
        );
        const paid = newSched.filter((s) => s.status === "Paid").length;
        const next = newSched.find((s) => s.status !== "Paid");
        const completed = paid === p.instalments;
        return {
          ...p,
          schedule: newSched,
          paid,
          nextDue: next?.dueDate ?? null,
          nextAmount: next?.amount ?? 0,
          status: completed ? "Completed" : "On Track",
        };
      }),
    );
    if (viewPlan) {
      setViewPlan((prev) =>
        prev
          ? {
              ...prev,
              schedule: prev.schedule.map((s) =>
                s.no === instNo ? { ...s, status: "Paid" } : s,
              ),
            }
          : null,
      );
    }
    toast.success("Instalment marked as paid");
  }

  const filteredPlans = plans.filter(
    (p) =>
      p.studentName.toLowerCase().includes(search.toLowerCase()) ||
      p.className.toLowerCase().includes(search.toLowerCase()),
  );

  const totals = {
    total: plans.length,
    onTrack: plans.filter((p) => p.status === "On Track").length,
    overdue: plans.filter((p) => p.status === "Overdue").length,
    outstanding: plans
      .filter((p) => p.status !== "Completed")
      .reduce(
        (s, p) =>
          s + (p.totalFee - p.paid * Math.round(p.totalFee / p.instalments)),
        0,
      ),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payment Plans</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage instalment schedules and fee payment plans
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} data-ocid="create-plan-btn">
          <Plus size={16} className="mr-2" /> Create Payment Plan
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Plans",
            value: totals.total,
            icon: <Clock size={20} />,
            color: "text-primary",
          },
          {
            label: "On Track",
            value: totals.onTrack,
            icon: <CheckCircle size={20} />,
            color: "text-green-600",
          },
          {
            label: "Overdue Plans",
            value: totals.overdue,
            icon: <AlertCircle size={20} />,
            color: "text-red-600",
          },
          {
            label: "Total Outstanding",
            value: fmt(totals.outstanding),
            icon: <AlertCircle size={20} />,
            color: "text-yellow-600",
          },
        ].map((c) => (
          <Card key={c.label}>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className={`${c.color} p-2 rounded-full bg-muted/60`}>
                {c.icon}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{c.label}</p>
                <p className="text-xl font-bold text-foreground">{c.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">All Payment Plans</CardTitle>
          <Input
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-52 h-8 text-sm"
            data-ocid="plans-search"
          />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead className="text-right">Total Fee</TableHead>
                <TableHead className="text-center">Instalments</TableHead>
                <TableHead className="text-center">Paid</TableHead>
                <TableHead>Next Due</TableHead>
                <TableHead className="text-right">Next Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.map((p) => (
                <TableRow key={p.id} data-ocid={`plan-row-${p.id}`}>
                  <TableCell className="font-medium">{p.studentName}</TableCell>
                  <TableCell>{p.className}</TableCell>
                  <TableCell className="text-right">
                    {fmt(p.totalFee)}
                  </TableCell>
                  <TableCell className="text-center">{p.instalments}</TableCell>
                  <TableCell className="text-center">
                    {p.paid}/{p.instalments}
                  </TableCell>
                  <TableCell>{p.nextDue ? fmtDate(p.nextDue) : "—"}</TableCell>
                  <TableCell className="text-right">
                    {p.nextAmount ? fmt(p.nextAmount) : "—"}
                  </TableCell>
                  <TableCell>{statusBadge(p.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setViewPlan(p)}
                        data-ocid={`view-plan-${p.id}`}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          window.open(
                            `https://wa.me/?text=Fee+reminder+for+${encodeURIComponent(p.studentName)}`,
                          );
                          toast.info("Opening WhatsApp...");
                        }}
                        data-ocid={`send-reminder-${p.id}`}
                      >
                        Remind
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Payment Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Student</Label>
              <Input
                placeholder="Search student..."
                value={fStudentSearch}
                onChange={(e) => setFStudentSearch(e.target.value)}
                className="mt-1"
                data-ocid="new-plan-student-search"
              />
              {fStudentSearch && (
                <div className="border rounded mt-1 max-h-32 overflow-y-auto">
                  {mockStudents
                    .filter((s) =>
                      s.name
                        .toLowerCase()
                        .includes(fStudentSearch.toLowerCase()),
                    )
                    .slice(0, 8)
                    .map((s) => (
                      <div
                        key={s.id}
                        className="px-3 py-1.5 text-sm cursor-pointer hover:bg-muted"
                        onClick={() => {
                          setFStudentId(s.id);
                          setFTotal(String(s.feeDue));
                          setFStudentSearch("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setFStudentId(s.id);
                            setFTotal(String(s.feeDue));
                            setFStudentSearch("");
                          }
                        }}
                      >
                        {s.name} — {s.className}-{s.section}
                      </div>
                    ))}
                </div>
              )}
              {fStudent && (
                <p className="text-xs mt-1 text-muted-foreground">
                  Selected: {fStudent.name} | Outstanding:{" "}
                  {fmt(fStudent.feeDue)}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Total Fee Amount (₹)</Label>
                <Input
                  type="number"
                  value={fTotal}
                  onChange={(e) => setFTotal(e.target.value)}
                  placeholder="0"
                  className="mt-1"
                  data-ocid="new-plan-total"
                />
              </div>
              <div>
                <Label>Number of Instalments</Label>
                <Select value={fInstalments} onValueChange={setFInstalments}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["2", "3", "4", "6", "12"].map((n) => (
                      <SelectItem key={n} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={fStartDate}
                  onChange={(e) => setFStartDate(e.target.value)}
                  className="mt-1"
                  data-ocid="new-plan-start"
                />
              </div>
              <div>
                <Label>Frequency</Label>
                <Select value={fFrequency} onValueChange={setFFrequency}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Termly">Termly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {totalAmt > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground">
                  Generated Schedule
                </Label>
                <div className="border rounded mt-1 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="text-xs">
                        <TableHead className="py-1">#</TableHead>
                        <TableHead className="py-1">Due Date</TableHead>
                        <TableHead className="py-1 text-right">
                          Amount
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewSchedule.map((s) => (
                        <TableRow key={s.no} className="text-xs">
                          <TableCell className="py-1">{s.no}</TableCell>
                          <TableCell className="py-1">
                            {fmtDate(s.dueDate)}
                          </TableCell>
                          <TableCell className="py-1 text-right">
                            {fmt(s.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} data-ocid="create-plan-submit">
              Create Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Plan Sheet */}
      <Sheet open={!!viewPlan} onOpenChange={() => setViewPlan(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Payment Plan — {viewPlan?.studentName}</SheetTitle>
          </SheetHeader>
          {viewPlan && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm bg-muted/40 rounded p-3">
                <div>
                  Class: <strong>{viewPlan.className}</strong>
                </div>
                <div>
                  Total: <strong>{fmt(viewPlan.totalFee)}</strong>
                </div>
                <div>
                  Instalments: <strong>{viewPlan.instalments}</strong>
                </div>
                <div>
                  Paid:{" "}
                  <strong>
                    {viewPlan.paid}/{viewPlan.instalments}
                  </strong>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {viewPlan.schedule.map((s) => (
                    <TableRow
                      key={s.no}
                      className={s.status === "Overdue" ? "bg-red-500/5" : ""}
                    >
                      <TableCell>{s.no}</TableCell>
                      <TableCell>{fmtDate(s.dueDate)}</TableCell>
                      <TableCell className="text-right">
                        {fmt(s.amount)}
                      </TableCell>
                      <TableCell>{instalmentBadge(s.status)}</TableCell>
                      <TableCell>
                        {s.status !== "Paid" && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => markPaid(viewPlan.id, s.no)}
                              data-ocid={`mark-paid-${viewPlan.id}-${s.no}`}
                            >
                              Mark Paid
                            </Button>
                            {s.status === "Overdue" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs"
                                onClick={() =>
                                  toast.info("Reminder sent via WhatsApp")
                                }
                                data-ocid={`remind-overdue-${s.no}`}
                              >
                                Remind
                              </Button>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
