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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockStudents } from "@/data/mockStudents";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Txn {
  id: string;
  student: string;
  class: string;
  amount: number;
  method: string;
  time: string;
  status: "Reconciled" | "Pending" | "Mismatch";
  feeHead: string;
  balBefore: number;
  balAfter: number;
}

const initialTxns: Txn[] = [
  {
    id: "TXN-2026-001",
    student: "Arjun Sharma",
    class: "VII-A",
    amount: 6000,
    method: "UPI",
    time: "09:14 AM",
    status: "Reconciled",
    feeHead: "Tuition Fee",
    balBefore: 12000,
    balAfter: 6000,
  },
  {
    id: "TXN-2026-002",
    student: "Priya Singh",
    class: "VI-B",
    amount: 6167,
    method: "Online Banking",
    time: "09:32 AM",
    status: "Reconciled",
    feeHead: "Tuition Fee Q2",
    balBefore: 12334,
    balAfter: 6167,
  },
  {
    id: "TXN-2026-003",
    student: "Rohan Mehta",
    class: "IX-C",
    amount: 5000,
    method: "UPI",
    time: "10:05 AM",
    status: "Reconciled",
    feeHead: "Monthly Fee Oct",
    balBefore: 15000,
    balAfter: 10000,
  },
  {
    id: "TXN-2026-004",
    student: "Kavya Patel",
    class: "VIII-B",
    amount: 2500,
    method: "Card",
    time: "10:45 AM",
    status: "Pending",
    feeHead: "",
    balBefore: 5000,
    balAfter: 5000,
  },
  {
    id: "TXN-2026-005",
    student: "Aditya Kumar",
    class: "X-A",
    amount: 8000,
    method: "UPI",
    time: "11:02 AM",
    status: "Pending",
    feeHead: "",
    balBefore: 24000,
    balAfter: 24000,
  },
  {
    id: "TXN-2026-006",
    student: "Sneha Joshi",
    class: "XI-Science",
    amount: 8750,
    method: "Online Banking",
    time: "11:20 AM",
    status: "Reconciled",
    feeHead: "Term 3 Fee",
    balBefore: 17500,
    balAfter: 8750,
  },
  {
    id: "TXN-2026-007",
    student: "Unknown",
    class: "-",
    amount: 3200,
    method: "UPI",
    time: "11:45 AM",
    status: "Mismatch",
    feeHead: "",
    balBefore: 0,
    balAfter: 0,
  },
  {
    id: "TXN-2026-008",
    student: "Rahul Verma",
    class: "VII-B",
    amount: 6000,
    method: "UPI",
    time: "12:10 PM",
    status: "Reconciled",
    feeHead: "Tuition Fee Q3",
    balBefore: 12000,
    balAfter: 6000,
  },
  {
    id: "TXN-2026-009",
    student: "Ananya Nair",
    class: "VIII-A",
    amount: 4500,
    method: "Card",
    time: "12:30 PM",
    status: "Pending",
    feeHead: "",
    balBefore: 9000,
    balAfter: 9000,
  },
  {
    id: "TXN-2026-010",
    student: "Nikhil Das",
    class: "VI-C",
    amount: 5500,
    method: "Online Banking",
    time: "01:05 PM",
    status: "Reconciled",
    feeHead: "Annual Fee",
    balBefore: 11000,
    balAfter: 5500,
  },
  {
    id: "TXN-2026-011",
    student: "Pooja Reddy",
    class: "IX-A",
    amount: 7200,
    method: "UPI",
    time: "01:45 PM",
    status: "Reconciled",
    feeHead: "Tuition + Transport",
    balBefore: 14400,
    balAfter: 7200,
  },
  {
    id: "TXN-2026-012",
    student: "Vikram Gupta",
    class: "X-B",
    amount: 4000,
    method: "Card",
    time: "02:15 PM",
    status: "Pending",
    feeHead: "",
    balBefore: 8000,
    balAfter: 8000,
  },
  {
    id: "TXN-2026-013",
    student: "Unknown",
    class: "-",
    amount: 1500,
    method: "UPI",
    time: "02:40 PM",
    status: "Mismatch",
    feeHead: "",
    balBefore: 0,
    balAfter: 0,
  },
  {
    id: "TXN-2026-014",
    student: "Deepa Menon",
    class: "XI-Commerce",
    amount: 9500,
    method: "Online Banking",
    time: "03:00 PM",
    status: "Reconciled",
    feeHead: "Senior Fee Q3",
    balBefore: 19000,
    balAfter: 9500,
  },
  {
    id: "TXN-2026-015",
    student: "Rohit Jain",
    class: "XII-Science",
    amount: 10000,
    method: "UPI",
    time: "03:20 PM",
    status: "Reconciled",
    feeHead: "Board Year Fee",
    balBefore: 20000,
    balAfter: 10000,
  },
  {
    id: "TXN-2026-016",
    student: "Sita Rao",
    class: "VII-C",
    amount: 5800,
    method: "Card",
    time: "03:50 PM",
    status: "Pending",
    feeHead: "",
    balBefore: 11600,
    balAfter: 11600,
  },
  {
    id: "TXN-2026-017",
    student: "Ramesh Bhat",
    class: "IX-B",
    amount: 6500,
    method: "UPI",
    time: "04:10 PM",
    status: "Reconciled",
    feeHead: "Tuition Fee Q3",
    balBefore: 13000,
    balAfter: 6500,
  },
  {
    id: "TXN-2026-018",
    student: "Geeta Pillai",
    class: "VIII-C",
    amount: 7000,
    method: "Online Banking",
    time: "04:30 PM",
    status: "Reconciled",
    feeHead: "Annual Dev Fee",
    balBefore: 14000,
    balAfter: 7000,
  },
];

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function StatusIcon({ s }: { s: Txn["status"] }) {
  if (s === "Reconciled")
    return <CheckCircle size={16} className="text-green-600" />;
  if (s === "Pending") return <Clock size={16} className="text-yellow-500" />;
  return <XCircle size={16} className="text-red-600" />;
}

void StatusIcon;

function statusBadge(s: Txn["status"]) {
  if (s === "Reconciled")
    return (
      <Badge className="bg-green-500/20 text-green-700 border-green-500/30 gap-1">
        <CheckCircle size={12} />
        Reconciled
      </Badge>
    );
  if (s === "Pending")
    return (
      <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30 gap-1">
        <Clock size={12} />
        Pending
      </Badge>
    );
  return (
    <Badge className="bg-red-500/20 text-red-700 border-red-500/30 gap-1">
      <AlertTriangle size={12} />
      Mismatch
    </Badge>
  );
}

export function ReconciliationPage() {
  const [txns, setTxns] = useState<Txn[]>(initialTxns);
  const [tab, setTab] = useState<"All" | "Reconciled" | "Pending" | "Mismatch">(
    "All",
  );
  const [matchDialog, setMatchDialog] = useState<Txn | null>(null);
  const [reviewDialog, setReviewDialog] = useState<Txn | null>(null);
  const [matchSearch, setMatchSearch] = useState("");
  const [matchStudentId, setMatchStudentId] = useState("");

  function runAutoReconcile() {
    const pending = txns.filter((t) => t.status === "Pending");
    if (pending.length === 0) {
      toast.info("No pending transactions to reconcile");
      return;
    }
    setTxns((prev) =>
      prev.map((t) =>
        t.status === "Pending"
          ? {
              ...t,
              status: "Reconciled",
              feeHead: "Auto-Matched Fee",
              balAfter: t.balBefore - t.amount,
            }
          : t,
      ),
    );
    toast.success(`${pending.length} transactions auto-reconciled`);
  }

  function handleMatch() {
    if (!matchStudentId) {
      toast.error("Select a student to match");
      return;
    }
    const student = mockStudents.find((s) => s.id === matchStudentId);
    if (!matchDialog || !student) return;
    setTxns((prev) =>
      prev.map((t) =>
        t.id === matchDialog.id
          ? {
              ...t,
              status: "Reconciled",
              student: student.name,
              class: `${student.className}-${student.section}`,
              feeHead: "Matched Fee",
              balAfter: student.feeDue - matchDialog.amount,
            }
          : t,
      ),
    );
    setMatchDialog(null);
    toast.success("Transaction matched and reconciled");
  }

  const filtered = txns.filter((t) => tab === "All" || t.status === tab);
  const stats = {
    total: txns.reduce((s, t) => s + t.amount, 0),
    reconciled: txns.filter((t) => t.status === "Reconciled").length,
    pending: txns.filter((t) => t.status === "Pending").length,
    rate: Math.round(
      (txns.filter((t) => t.status === "Reconciled").length / txns.length) *
        100,
    ),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Payment Reconciliation
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Auto-match online payments to student outstanding balances
          </p>
        </div>
        <Button onClick={runAutoReconcile} data-ocid="auto-reconcile-btn">
          <RefreshCw size={16} className="mr-2" /> Run Auto-Reconcile
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Payments Today",
            value: fmt(stats.total),
            color: "text-primary",
          },
          {
            label: "Auto-Reconciled",
            value: stats.reconciled,
            color: "text-green-600",
          },
          {
            label: "Pending Manual Review",
            value:
              stats.pending +
              txns.filter((t) => t.status === "Mismatch").length,
            color: "text-yellow-600",
          },
          {
            label: "Reconciliation Rate",
            value: `${stats.rate}%`,
            color: "text-blue-600",
          },
        ].map((c) => (
          <Card key={c.label}>
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">{c.label}</p>
              <p className={`text-2xl font-bold mt-1 ${c.color}`}>{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["All", "Reconciled", "Pending", "Mismatch"] as const).map((t) => (
          <Button
            key={t}
            size="sm"
            variant={tab === t ? "default" : "outline"}
            onClick={() => setTab(t)}
            data-ocid={`recon-tab-${t.toLowerCase()}`}
          >
            {t}
            <span className="ml-1.5 text-xs opacity-75">
              (
              {t === "All"
                ? txns.length
                : txns.filter((x) => x.status === t).length}
              )
            </span>
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Transaction Log</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Txn ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fee Head</TableHead>
                <TableHead className="text-right">Bal Before</TableHead>
                <TableHead className="text-right">Bal After</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow
                  key={t.id}
                  data-ocid={`txn-row-${t.id}`}
                  className={
                    t.status === "Mismatch"
                      ? "bg-red-500/5"
                      : t.status === "Pending"
                        ? "bg-yellow-500/5"
                        : ""
                  }
                >
                  <TableCell className="font-mono text-xs">{t.id}</TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{t.student}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.class}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {fmt(t.amount)}
                  </TableCell>
                  <TableCell className="text-sm">{t.method}</TableCell>
                  <TableCell className="text-sm">{t.time}</TableCell>
                  <TableCell>{statusBadge(t.status)}</TableCell>
                  <TableCell className="text-sm">
                    {t.feeHead || (
                      <span className="text-muted-foreground italic">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {t.balBefore ? fmt(t.balBefore) : "—"}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {t.balAfter !== t.balBefore ? fmt(t.balAfter) : "—"}
                  </TableCell>
                  <TableCell>
                    {t.status === "Pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => {
                          setMatchDialog(t);
                          setMatchSearch("");
                          setMatchStudentId("");
                        }}
                        data-ocid={`match-txn-${t.id}`}
                      >
                        Match
                      </Button>
                    )}
                    {t.status === "Mismatch" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 text-xs"
                        onClick={() => setReviewDialog(t)}
                        data-ocid={`review-txn-${t.id}`}
                      >
                        Review
                      </Button>
                    )}
                    {t.status === "Reconciled" && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <CheckCircle size={12} className="text-green-600" />
                        Done
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Match Dialog */}
      <Dialog open={!!matchDialog} onOpenChange={() => setMatchDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Match Transaction to Student</DialogTitle>
          </DialogHeader>
          {matchDialog && (
            <div className="space-y-4">
              <div className="bg-muted/40 rounded p-3 text-sm space-y-1">
                <div>
                  Txn: <strong>{matchDialog.id}</strong>
                </div>
                <div>
                  Amount: <strong>{fmt(matchDialog.amount)}</strong> via{" "}
                  {matchDialog.method} at {matchDialog.time}
                </div>
              </div>
              <div>
                <Label>Search Student</Label>
                <Input
                  placeholder="Student name or admission no..."
                  value={matchSearch}
                  onChange={(e) => setMatchSearch(e.target.value)}
                  className="mt-1"
                  data-ocid="match-search"
                />
                {matchSearch && (
                  <div className="border rounded mt-1 max-h-36 overflow-y-auto">
                    {mockStudents
                      .filter(
                        (s) =>
                          s.name
                            .toLowerCase()
                            .includes(matchSearch.toLowerCase()) ||
                          s.admissionNo
                            .toLowerCase()
                            .includes(matchSearch.toLowerCase()),
                      )
                      .slice(0, 8)
                      .map((s) => (
                        <div
                          key={s.id}
                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-muted ${matchStudentId === s.id ? "bg-primary/10 font-medium" : ""}`}
                          onClick={() => {
                            setMatchStudentId(s.id);
                            setMatchSearch("");
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setMatchStudentId(s.id);
                              setMatchSearch("");
                            }
                          }}
                        >
                          {s.name} — {s.className}-{s.section} (Due:{" "}
                          {fmt(s.feeDue)})
                        </div>
                      ))}
                  </div>
                )}
                {matchStudentId && (
                  <p className="text-xs mt-1 text-muted-foreground">
                    Selected:{" "}
                    {mockStudents.find((s) => s.id === matchStudentId)?.name}
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setMatchDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleMatch} data-ocid="confirm-match-btn">
              Confirm & Reconcile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Mismatch Dialog */}
      <Dialog open={!!reviewDialog} onOpenChange={() => setReviewDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-600" /> Transaction
              Mismatch Review
            </DialogTitle>
          </DialogHeader>
          {reviewDialog && (
            <div className="space-y-3 text-sm">
              <div className="bg-red-500/10 border border-red-500/20 rounded p-3 space-y-1">
                <div className="font-medium text-red-700">
                  Discrepancy Detected
                </div>
                <div>Txn ID: {reviewDialog.id}</div>
                <div>
                  Amount Received: <strong>{fmt(reviewDialog.amount)}</strong>
                </div>
                <div>
                  Method: {reviewDialog.method} at {reviewDialog.time}
                </div>
                <div>
                  Student on Record: <strong>{reviewDialog.student}</strong>
                </div>
              </div>
              <p className="text-muted-foreground">
                The payment could not be automatically matched. The sender
                details do not correspond to any enrolled student. Please verify
                the UTR/Reference number with the bank or contact the parent
                directly.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialog(null)}>
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                toast.info("Flagged for manual bank reconciliation");
                setReviewDialog(null);
              }}
              data-ocid="flag-mismatch-btn"
            >
              Flag for Manual Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
