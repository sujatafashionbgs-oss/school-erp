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
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockStudents } from "@/data/mockStudents";
import { FileText, Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SplitBillingEntry {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  parent1: string;
  p1Pct: number;
  parent2: string;
  p2Pct: number;
  totalFee: number;
  status: "Active" | "Inactive";
}

const mockSplitBilling: SplitBillingEntry[] = [
  {
    id: "sb1",
    studentId: "s001",
    studentName: "Arjun Sharma",
    className: "VII-A",
    parent1: "Ramesh Sharma",
    p1Pct: 60,
    parent2: "Sunita Sharma",
    p2Pct: 40,
    totalFee: 24000,
    status: "Active",
  },
  {
    id: "sb2",
    studentId: "s002",
    studentName: "Priya Singh",
    className: "VI-B",
    parent1: "Vikram Singh",
    p1Pct: 50,
    parent2: "Meena Singh",
    p2Pct: 50,
    totalFee: 18500,
    status: "Active",
  },
  {
    id: "sb3",
    studentId: "s003",
    studentName: "Rohan Mehta",
    className: "IX-C",
    parent1: "Suresh Mehta",
    p1Pct: 70,
    parent2: "Anita Mehta",
    p2Pct: 30,
    totalFee: 30000,
    status: "Active",
  },
  {
    id: "sb4",
    studentId: "s004",
    studentName: "Kavya Patel",
    className: "VIII-B",
    parent1: "Dilip Patel",
    p1Pct: 50,
    parent2: "Hema Patel",
    p2Pct: 50,
    totalFee: 26000,
    status: "Active",
  },
  {
    id: "sb5",
    studentId: "s005",
    studentName: "Aditya Kumar",
    className: "X-A",
    parent1: "Rajesh Kumar",
    p1Pct: 60,
    parent2: "Suman Kumar",
    p2Pct: 40,
    totalFee: 32000,
    status: "Inactive",
  },
  {
    id: "sb6",
    studentId: "s006",
    studentName: "Sneha Joshi",
    className: "XI-Science",
    parent1: "Prakash Joshi",
    p1Pct: 55,
    parent2: "Leela Joshi",
    p2Pct: 45,
    totalFee: 35000,
    status: "Active",
  },
];

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function SplitBillingPage() {
  const [entries, setEntries] = useState<SplitBillingEntry[]>(mockSplitBilling);
  const [configOpen, setConfigOpen] = useState(false);
  const [invoiceEntry, setInvoiceEntry] = useState<SplitBillingEntry | null>(
    null,
  );
  const [search, setSearch] = useState("");

  // Form state
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [p1Name, setP1Name] = useState("");
  const [p2Name, setP2Name] = useState("");
  const [p1Pct, setP1Pct] = useState(50);

  const selectedStudent = mockStudents.find((s) => s.id === selectedStudentId);
  const p2Pct = 100 - p1Pct;
  const pctValid = p1Pct + p2Pct === 100;

  const filteredStudents = mockStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(search.toLowerCase()),
  );

  function handleSave() {
    if (!selectedStudentId) {
      toast.error("Please select a student");
      return;
    }
    if (!p1Name.trim()) {
      toast.error("Parent 1 name is required");
      return;
    }
    if (!p2Name.trim()) {
      toast.error("Parent 2 name is required");
      return;
    }
    const student = mockStudents.find((s) => s.id === selectedStudentId);
    if (!student) return;
    const newEntry: SplitBillingEntry = {
      id: `sb${Date.now()}`,
      studentId: selectedStudentId,
      studentName: student.name,
      className: `${student.className}-${student.section}`,
      parent1: p1Name,
      p1Pct,
      parent2: p2Name,
      p2Pct,
      totalFee: student.feeDue,
      status: "Active",
    };
    setEntries((prev) => [newEntry, ...prev]);
    setConfigOpen(false);
    setSelectedStudentId("");
    setP1Name("");
    setP2Name("");
    setP1Pct(50);
    toast.success("Split billing configured successfully");
  }

  function toggleStatus(id: string) {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: e.status === "Active" ? "Inactive" : "Active" }
          : e,
      ),
    );
    toast.success("Status updated");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Split Billing</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Configure invoice splitting between two parent/carer accounts
          </p>
        </div>
        <Button
          onClick={() => setConfigOpen(true)}
          data-ocid="split-billing-configure-btn"
        >
          <Plus size={16} className="mr-2" /> Configure Split Billing
        </Button>
      </div>

      {/* Stat card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Users size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Students with Split Billing
              </p>
              <p className="text-2xl font-bold text-foreground">
                {entries.filter((e) => e.status === "Active").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-500/10">
              <FileText size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Active Configurations
              </p>
              <p className="text-2xl font-bold text-foreground">
                {entries.filter((e) => e.status === "Active").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-yellow-500/10">
              <FileText size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Split Amount
              </p>
              <p className="text-2xl font-bold text-foreground">
                {fmt(
                  entries
                    .filter((e) => e.status === "Active")
                    .reduce((s, e) => s + e.totalFee, 0),
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Split Billing Configurations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Parent 1</TableHead>
                <TableHead className="text-right">P1 %</TableHead>
                <TableHead>Parent 2</TableHead>
                <TableHead className="text-right">P2 %</TableHead>
                <TableHead className="text-right">Total Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((e) => (
                <TableRow key={e.id} data-ocid={`split-row-${e.id}`}>
                  <TableCell className="font-medium">{e.studentName}</TableCell>
                  <TableCell>{e.className}</TableCell>
                  <TableCell>{e.parent1}</TableCell>
                  <TableCell className="text-right">{e.p1Pct}%</TableCell>
                  <TableCell>{e.parent2}</TableCell>
                  <TableCell className="text-right">{e.p2Pct}%</TableCell>
                  <TableCell className="text-right font-medium">
                    {fmt(e.totalFee)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={e.status === "Active" ? "default" : "secondary"}
                    >
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setInvoiceEntry(e)}
                        data-ocid={`generate-invoices-${e.id}`}
                      >
                        <FileText size={14} className="mr-1" /> Invoices
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleStatus(e.id)}
                        data-ocid={`toggle-status-${e.id}`}
                      >
                        {e.status === "Active" ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Configure Dialog */}
      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Configure Split Billing</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Search & Select Student</Label>
              <Input
                placeholder="Type name or admission no..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-1"
                data-ocid="split-student-search"
              />
              {search && (
                <div className="border rounded-md mt-1 max-h-36 overflow-y-auto">
                  {filteredStudents.slice(0, 10).map((s) => (
                    <div
                      key={s.id}
                      className={`px-3 py-2 text-sm cursor-pointer hover:bg-muted transition-colors ${selectedStudentId === s.id ? "bg-primary/10 font-medium" : ""}`}
                      onClick={() => {
                        setSelectedStudentId(s.id);
                        setSearch("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setSelectedStudentId(s.id);
                          setSearch("");
                        }
                      }}
                      data-ocid={`split-student-option-${s.id}`}
                    >
                      {s.name} — {s.className}-{s.section} ({s.admissionNo})
                    </div>
                  ))}
                </div>
              )}
              {selectedStudent && (
                <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                  Selected: <strong>{selectedStudent.name}</strong> | Class{" "}
                  {selectedStudent.className}-{selectedStudent.section} |
                  Outstanding: <strong>{fmt(selectedStudent.feeDue)}</strong>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Parent 1 Name</Label>
                <Input
                  value={p1Name}
                  onChange={(e) => setP1Name(e.target.value)}
                  placeholder="Parent 1 full name"
                  className="mt-1"
                  data-ocid="split-p1-name"
                />
              </div>
              <div>
                <Label>Parent 2 Name</Label>
                <Input
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value)}
                  placeholder="Parent 2 full name"
                  className="mt-1"
                  data-ocid="split-p2-name"
                />
              </div>
            </div>

            <div>
              <Label>
                Parent 1 Share: <strong>{p1Pct}%</strong> | Parent 2 Share:{" "}
                <strong>{p2Pct}%</strong>
              </Label>
              <Slider
                value={[p1Pct]}
                onValueChange={([v]) => setP1Pct(v)}
                min={0}
                max={100}
                step={5}
                className="mt-2"
                data-ocid="split-pct-slider"
              />
              {!pctValid && (
                <p className="text-destructive text-xs mt-1">
                  Total must equal 100%
                </p>
              )}
            </div>

            {selectedStudent && (
              <div className="grid grid-cols-2 gap-2 text-sm bg-muted/40 rounded p-3">
                <div>
                  Parent 1 Amount:{" "}
                  <strong>
                    {fmt(Math.round((selectedStudent.feeDue * p1Pct) / 100))}
                  </strong>
                </div>
                <div>
                  Parent 2 Amount:{" "}
                  <strong>
                    {fmt(Math.round((selectedStudent.feeDue * p2Pct) / 100))}
                  </strong>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} data-ocid="split-save-btn">
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice Preview Dialog */}
      {invoiceEntry && (
        <Dialog
          open={!!invoiceEntry}
          onOpenChange={() => setInvoiceEntry(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Invoice Preview — {invoiceEntry.studentName}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              {[
                {
                  parent: invoiceEntry.parent1,
                  pct: invoiceEntry.p1Pct,
                  key: "p1",
                },
                {
                  parent: invoiceEntry.parent2,
                  pct: invoiceEntry.p2Pct,
                  key: "p2",
                },
              ].map((p) => {
                const amt = Math.round((invoiceEntry.totalFee * p.pct) / 100);
                return (
                  <div key={p.key} className="border rounded-lg p-4 space-y-2">
                    <div className="text-center font-bold text-sm border-b pb-2">
                      SmartSkale School
                    </div>
                    <div className="text-center text-xs text-muted-foreground uppercase tracking-wide">
                      Fee Invoice
                    </div>
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="text-muted-foreground">Student:</span>{" "}
                        {invoiceEntry.studentName}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Class:</span>{" "}
                        {invoiceEntry.className}
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Billed To:
                        </span>{" "}
                        {p.parent}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Share:</span>{" "}
                        {p.pct}%
                      </div>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Amount Due</span>
                      <span className="text-primary">{fmt(amt)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Academic Year: 2026-27
                    </div>
                  </div>
                );
              })}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInvoiceEntry(null)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  toast.success("Invoices sent to parents via WhatsApp");
                  setInvoiceEntry(null);
                }}
                data-ocid="send-invoices-btn"
              >
                Send to Parents
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
