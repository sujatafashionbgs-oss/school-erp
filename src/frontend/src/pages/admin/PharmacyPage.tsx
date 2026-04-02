import { Badge } from "@/components/ui/badge";
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
import {
  type Medicine,
  type MedicineIssue,
  mockMedicineIssues,
  mockMedicines,
} from "@/data/mockHealthRecords";
import { AlertTriangle, Pill, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const sixMonthsFromNow = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 6);
  return d.toISOString().split("T")[0];
};

export function PharmacyPage() {
  const [medicines, setMedicines] = useState<Medicine[]>(mockMedicines);
  const [issues, setIssues] = useState<MedicineIssue[]>(mockMedicineIssues);
  const [issueOpen, setIssueOpen] = useState(false);
  const [form, setForm] = useState({
    studentName: "",
    admissionNo: "",
    medicine: "",
    quantity: "",
    reason: "",
  });

  const soonThreshold = sixMonthsFromNow();
  const lowStockCount = medicines.filter(
    (m) => m.quantity <= m.minQuantity,
  ).length;
  const expiringSoonCount = medicines.filter(
    (m) => m.expiryDate <= soonThreshold,
  ).length;

  const getStatus = (m: Medicine) => {
    if (m.quantity === 0)
      return { label: "Out of Stock", cls: "bg-red-500/15 text-red-600" };
    if (m.quantity <= m.minQuantity)
      return { label: "Low Stock", cls: "bg-orange-500/15 text-orange-600" };
    return { label: "In Stock", cls: "bg-green-500/15 text-green-600" };
  };

  const handleIssue = () => {
    if (!form.studentName || !form.medicine || !form.quantity) {
      toast.error("Please fill all required fields");
      return;
    }
    const qty = Number(form.quantity);
    if (Number.isNaN(qty) || qty <= 0) {
      toast.error("Enter a valid quantity");
      return;
    }
    const med = medicines.find((m) => m.name === form.medicine);
    if (!med) {
      toast.error("Medicine not found");
      return;
    }
    if (qty > med.quantity) {
      toast.error(`Only ${med.quantity} ${med.unit} available`);
      return;
    }

    setMedicines((prev) =>
      prev.map((m) =>
        m.name === form.medicine ? { ...m, quantity: m.quantity - qty } : m,
      ),
    );
    const newIssue: MedicineIssue = {
      id: `mi${Date.now()}`,
      studentName: form.studentName,
      admissionNo: form.admissionNo,
      medicine: form.medicine,
      quantity: qty,
      reason: form.reason,
      date: new Date().toISOString().split("T")[0],
      issuedBy: "School Nurse",
    };
    setIssues((prev) => [newIssue, ...prev]);
    setForm({
      studentName: "",
      admissionNo: "",
      medicine: "",
      quantity: "",
      reason: "",
    });
    setIssueOpen(false);
    toast.success(`${form.medicine} issued to ${form.studentName}`);
  };

  return (
    <div className="space-y-6" data-ocid="pharmacy.page">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Pill size={22} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            School Pharmacy
          </h1>
        </div>
        <Button
          onClick={() => setIssueOpen(true)}
          data-ocid="pharmacy.issue_button"
        >
          <Plus size={16} className="mr-2" /> Issue Medicine
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-2xl font-bold text-foreground">
            {medicines.length}
          </p>
          <p className="text-sm text-muted-foreground">Total Medicines</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-2xl font-bold text-orange-500">{lowStockCount}</p>
          <p className="text-sm text-muted-foreground">Low Stock Items</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-2xl font-bold text-yellow-500">
            {expiringSoonCount}
          </p>
          <p className="text-sm text-muted-foreground">
            Expiring Soon (6 months)
          </p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold text-foreground">Medicine Inventory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                  Medicine
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                  Category
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                  Qty / Unit
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                  Min Qty
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                  Expiry
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((m, i) => {
                const status = getStatus(m);
                const expiringSoon = m.expiryDate <= soonThreshold;
                return (
                  <tr
                    key={m.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20"
                    data-ocid={`pharmacy.row.${i + 1}`}
                  >
                    <td className="px-5 py-3 font-medium text-foreground">
                      {m.name}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="secondary" className="text-xs">
                        {m.category}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-foreground">
                      {m.quantity} {m.unit}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {m.minQuantity}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-muted-foreground">
                        {m.expiryDate}
                      </span>
                      {expiringSoon && (
                        <Badge className="ml-2 text-xs bg-yellow-500/15 text-yellow-600">
                          Expiring Soon
                        </Badge>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <Badge className={`text-xs ${status.cls}`}>
                        {status.label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue History */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold text-foreground">Issue History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                  Date
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                  Student
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                  Admission No.
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                  Medicine
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                  Qty
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                  Reason
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                  Issued By
                </th>
              </tr>
            </thead>
            <tbody>
              {issues.map((iss, i) => (
                <tr
                  key={iss.id}
                  className="border-b border-border last:border-0 hover:bg-muted/20"
                  data-ocid={`pharmacy.issue_row.${i + 1}`}
                >
                  <td className="px-5 py-3 text-muted-foreground">
                    {iss.date}
                  </td>
                  <td className="px-5 py-3 font-medium text-foreground">
                    {iss.studentName}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {iss.admissionNo}
                  </td>
                  <td className="px-5 py-3 text-foreground">{iss.medicine}</td>
                  <td className="px-5 py-3 text-foreground">{iss.quantity}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {iss.reason}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {iss.issuedBy}
                  </td>
                </tr>
              ))}
              {issues.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-muted-foreground"
                    data-ocid="pharmacy.empty_state"
                  >
                    No issue history
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Medicine Dialog */}
      <Dialog open={issueOpen} onOpenChange={setIssueOpen}>
        <DialogContent data-ocid="pharmacy.dialog">
          <DialogHeader>
            <DialogTitle>Issue Medicine</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Student Name *</Label>
                <Input
                  value={form.studentName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, studentName: e.target.value }))
                  }
                  placeholder="Student name"
                  data-ocid="pharmacy.student_name.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Admission No.</Label>
                <Input
                  value={form.admissionNo}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, admissionNo: e.target.value }))
                  }
                  placeholder="Admission number"
                  data-ocid="pharmacy.admission_no.input"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Medicine *</Label>
              <Select
                value={form.medicine}
                onValueChange={(v) => setForm((f) => ({ ...f, medicine: v }))}
              >
                <SelectTrigger data-ocid="pharmacy.medicine.select">
                  <SelectValue placeholder="Select medicine" />
                </SelectTrigger>
                <SelectContent>
                  {medicines.map((m) => (
                    <SelectItem key={m.id} value={m.name}>
                      {m.name} ({m.quantity} {m.unit} available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, quantity: e.target.value }))
                  }
                  placeholder="Qty"
                  data-ocid="pharmacy.quantity.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Reason</Label>
                <Input
                  value={form.reason}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, reason: e.target.value }))
                  }
                  placeholder="Reason"
                  data-ocid="pharmacy.reason.input"
                />
              </div>
            </div>
            {form.medicine &&
              (() => {
                const med = medicines.find((m) => m.name === form.medicine);
                return med && med.quantity <= med.minQuantity ? (
                  <div className="flex items-center gap-2 text-orange-600 text-sm bg-orange-500/10 rounded-xl px-3 py-2">
                    <AlertTriangle size={14} /> Low stock: only {med.quantity}{" "}
                    {med.unit} remaining
                  </div>
                ) : null;
              })()}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIssueOpen(false)}
              data-ocid="pharmacy.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={handleIssue} data-ocid="pharmacy.submit_button">
              Issue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
