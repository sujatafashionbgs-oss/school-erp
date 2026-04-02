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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CLASSES, SECTIONS } from "@/data/classConfig";
import {
  type Discount,
  type FeeCategory,
  type FeePayment,
  mockDiscounts,
  mockFeeCategories,
  mockFeePayments,
} from "@/data/mockFeeStructure";
import { mockStudents } from "@/data/mockStudents";
import { useLoadingData } from "@/hooks/useLoadingData";
import {
  AlertCircle,
  Bell,
  CheckCircle,
  CreditCard,
  Edit2,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FeesPageProps {
  navigate: (path: string) => void;
}

function FeesSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {["a", "b", "c"].map((k) => (
          <Skeleton key={k} className="h-24 rounded-2xl" />
        ))}
      </div>
      {["a", "b", "c", "d"].map((k) => (
        <Skeleton key={k} className="h-14 rounded-xl" />
      ))}
    </div>
  );
}

const statusBadge = (status: FeePayment["status"]) => {
  if (status === "Paid")
    return (
      <Badge className="bg-green-500/15 text-green-600 border-green-200">
        Paid
      </Badge>
    );
  if (status === "Partial")
    return (
      <Badge className="bg-yellow-500/15 text-yellow-600 border-yellow-200">
        Partial
      </Badge>
    );
  return (
    <Badge className="bg-red-500/15 text-red-600 border-red-200">Overdue</Badge>
  );
};

export function FeesPage({ navigate }: FeesPageProps) {
  const { loading } = useLoadingData(null);
  const [categories, setCategories] =
    useState<FeeCategory[]>(mockFeeCategories);
  const [discounts, setDiscounts] = useState<Discount[]>(mockDiscounts);
  const [payments] = useState<FeePayment[]>(mockFeePayments);

  const [classFilter, setClassFilter] = useState("All");
  const [sectionFilter, setSectionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Category dialog
  const [catDialog, setCatDialog] = useState(false);
  const [editCat, setEditCat] = useState<FeeCategory | null>(null);
  const [catForm, setCatForm] = useState({
    name: "",
    amount: "",
    forClass: "All",
    frequency: "Annual" as FeeCategory["frequency"],
  });

  // Discount dialog
  const [discDialog, setDiscDialog] = useState(false);
  const [editDisc, setEditDisc] = useState<Discount | null>(null);
  const [discForm, setDiscForm] = useState({
    name: "",
    type: "Percentage" as Discount["type"],
    value: "",
    appliedTo: "All",
  });

  if (loading) return <FeesSkeleton />;

  const totalDue = mockStudents.reduce((a, s) => a + s.feeDue, 0);
  const defaulters = mockStudents.filter((s) => s.feeDue > 0);
  const cleared = mockStudents.filter((s) => s.feeDue === 0);

  const filteredPayments = payments.filter((p) => {
    const classOk =
      classFilter === "All" || p.className.startsWith(classFilter);
    const sectionOk =
      sectionFilter === "All" || p.className.includes(`-${sectionFilter}`);
    const statusOk = statusFilter === "All" || p.status === statusFilter;
    return classOk && sectionOk && statusOk;
  });

  const openAddCat = () => {
    setEditCat(null);
    setCatForm({ name: "", amount: "", forClass: "All", frequency: "Annual" });
    setCatDialog(true);
  };

  const openEditCat = (cat: FeeCategory) => {
    setEditCat(cat);
    setCatForm({
      name: cat.name,
      amount: String(cat.amount),
      forClass: cat.forClass,
      frequency: cat.frequency,
    });
    setCatDialog(true);
  };

  const saveCat = () => {
    if (!catForm.name || !catForm.amount) {
      toast.error("Please fill all required fields");
      return;
    }
    if (editCat) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editCat.id
            ? { ...c, ...catForm, amount: Number(catForm.amount) }
            : c,
        ),
      );
      toast.success("Fee category updated");
    } else {
      setCategories((prev) => [
        ...prev,
        { id: `fc${Date.now()}`, ...catForm, amount: Number(catForm.amount) },
      ]);
      toast.success("Fee category added");
    }
    setCatDialog(false);
  };

  const deleteCat = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success("Category deleted");
  };

  const openAddDisc = () => {
    setEditDisc(null);
    setDiscForm({ name: "", type: "Percentage", value: "", appliedTo: "All" });
    setDiscDialog(true);
  };

  const openEditDisc = (d: Discount) => {
    setEditDisc(d);
    setDiscForm({
      name: d.name,
      type: d.type,
      value: String(d.value),
      appliedTo: d.appliedTo,
    });
    setDiscDialog(true);
  };

  const saveDisc = () => {
    if (!discForm.name || !discForm.value) {
      toast.error("Please fill all required fields");
      return;
    }
    if (editDisc) {
      setDiscounts((prev) =>
        prev.map((d) =>
          d.id === editDisc.id
            ? { ...d, ...discForm, value: Number(discForm.value) }
            : d,
        ),
      );
      toast.success("Discount updated");
    } else {
      setDiscounts((prev) => [
        ...prev,
        { id: `d${Date.now()}`, ...discForm, value: Number(discForm.value) },
      ]);
      toast.success("Discount added");
    }
    setDiscDialog(false);
  };

  const deleteDisc = (id: string) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
    toast.success("Discount deleted");
  };

  return (
    <div className="space-y-6" data-ocid="fees.page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fee Management</h1>
          <p className="text-muted-foreground text-sm">
            Manage fee structure, collections, discounts & reminders
          </p>
        </div>
        <Button
          onClick={() => navigate("/admin/fees/collect")}
          data-ocid="fees.collect.button"
        >
          <CreditCard size={16} className="mr-2" /> Collect Fee
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <AlertCircle size={22} className="text-red-500 mb-2" />
          <p className="text-2xl font-bold text-red-600">
            ₹{(totalDue / 1000).toFixed(1)}k
          </p>
          <p className="text-sm text-muted-foreground">Total Due</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <AlertCircle size={22} className="text-orange-500 mb-2" />
          <p className="text-2xl font-bold text-foreground">
            {defaulters.length}
          </p>
          <p className="text-sm text-muted-foreground">Defaulters</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <CheckCircle size={22} className="text-green-500 mb-2" />
          <p className="text-2xl font-bold text-green-600">{cleared.length}</p>
          <p className="text-sm text-muted-foreground">Fees Cleared</p>
        </div>
      </div>

      <Tabs defaultValue="structure">
        <TabsList className="mb-4">
          <TabsTrigger value="structure" data-ocid="fees.structure.tab">
            Fee Structure
          </TabsTrigger>
          <TabsTrigger value="collections" data-ocid="fees.collections.tab">
            Collections
          </TabsTrigger>
          <TabsTrigger value="discounts" data-ocid="fees.discounts.tab">
            Discounts
          </TabsTrigger>
          <TabsTrigger value="reminders" data-ocid="fees.reminders.tab">
            Reminders
          </TabsTrigger>
        </TabsList>

        {/* Fee Structure Tab */}
        <TabsContent value="structure">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Fee Categories</h2>
              <Button
                size="sm"
                onClick={openAddCat}
                data-ocid="fees.add_category.button"
              >
                <Plus size={14} className="mr-1" /> Add Category
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Category
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Class
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Frequency
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {categories.map((cat, i) => (
                    <tr
                      key={cat.id}
                      data-ocid={`fees.category.item.${i + 1}`}
                      className="hover:bg-muted/20"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {cat.name}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        ₹{cat.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {cat.forClass}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{cat.frequency}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditCat(cat)}
                            data-ocid={`fees.category.edit_button.${i + 1}`}
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteCat(cat.id)}
                            data-ocid={`fees.category.delete_button.${i + 1}`}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Collections Tab */}
        <TabsContent value="collections">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 p-4 border-b border-border">
              <h2 className="font-semibold text-foreground flex-1">
                Payment Collections
              </h2>
              <Select
                value={classFilter}
                onValueChange={(v) => {
                  setClassFilter(v);
                  setSectionFilter("All");
                }}
              >
                <SelectTrigger
                  className="w-32"
                  data-ocid="fees.class_filter.select"
                >
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="All">All Classes</SelectItem>
                  {CLASSES.map((c) => (
                    <SelectItem key={c} value={c}>
                      Class {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={sectionFilter}
                onValueChange={setSectionFilter}
                disabled={classFilter === "All"}
              >
                <SelectTrigger
                  className="w-32"
                  data-ocid="fees.section_filter.select"
                >
                  <SelectValue placeholder="All Sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Sections</SelectItem>
                  {(classFilter === "XI" || classFilter === "XII"
                    ? [...SECTIONS, "Science", "Commerce", "Arts"]
                    : SECTIONS
                  ).map((s) => (
                    <SelectItem key={s} value={s}>
                      Section {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32" data-ocid="fees.status.select">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Partial">Partial</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Student
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Class
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Total
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Paid
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Due
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Plan
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPayments.map((p, i) => (
                    <tr
                      key={p.id}
                      data-ocid={`fees.payment.item.${i + 1}`}
                      className="hover:bg-muted/20"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">
                          {p.studentName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {p.admissionNo}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {p.className}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        ₹{p.totalFee.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-green-600">
                        ₹{p.paidAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-red-600">
                        ₹{p.dueAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">
                          {p.installmentPlan}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">{statusBadge(p.status)}</td>
                      <td className="px-4 py-3">
                        {p.dueAmount > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate("/admin/fees/collect")}
                          >
                            <CheckCircle size={13} className="mr-1" /> Collect
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredPayments.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-muted-foreground"
                        data-ocid="fees.payment.empty_state"
                      >
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Discounts Tab */}
        <TabsContent value="discounts">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold text-foreground">
                Discounts & Scholarships
              </h2>
              <Button
                size="sm"
                onClick={openAddDisc}
                data-ocid="fees.add_discount.button"
              >
                <Plus size={14} className="mr-1" /> Add Discount
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Value
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Applied To
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {discounts.map((d, i) => (
                    <tr
                      key={d.id}
                      data-ocid={`fees.discount.item.${i + 1}`}
                      className="hover:bg-muted/20"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {d.name}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{d.type}</Badge>
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {d.type === "Percentage"
                          ? `${d.value}%`
                          : `₹${d.value}`}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {d.appliedTo}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditDisc(d)}
                            data-ocid={`fees.discount.edit_button.${i + 1}`}
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteDisc(d.id)}
                            data-ocid={`fees.discount.delete_button.${i + 1}`}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Reminders Tab */}
        <TabsContent value="reminders">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Fee Reminders</h2>
              <Button
                size="sm"
                onClick={() => {
                  for (const s of defaulters)
                    toast.success(`Reminder sent to ${s.fatherName}`);
                }}
                data-ocid="fees.send_all_reminders.button"
              >
                <Bell size={14} className="mr-1" /> Send All Reminders
              </Button>
            </div>
            <div className="divide-y divide-border">
              {defaulters.map((s, i) => (
                <div
                  key={s.admissionNo}
                  data-ocid={`fees.reminder.item.${i + 1}`}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {s.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {s.admissionNo} · Class {s.className}-{s.section} ·
                      Parent: {s.fatherName}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-red-600">
                      ₹{s.feeDue} due
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toast.success(`Reminder sent to ${s.fatherName}`)
                      }
                      data-ocid={`fees.send_reminder.button.${i + 1}`}
                    >
                      <Bell size={13} className="mr-1" /> Remind
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Category Dialog */}
      <Dialog open={catDialog} onOpenChange={setCatDialog}>
        <DialogContent data-ocid="fees.category.dialog">
          <DialogHeader>
            <DialogTitle>{editCat ? "Edit" : "Add"} Fee Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Category Name</Label>
              <Input
                value={catForm.name}
                onChange={(e) =>
                  setCatForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Tuition Fee"
                data-ocid="fees.category.input"
              />
            </div>
            <div>
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                value={catForm.amount}
                onChange={(e) =>
                  setCatForm((p) => ({ ...p, amount: e.target.value }))
                }
                placeholder="12000"
              />
            </div>
            <div>
              <Label>For Class</Label>
              <Select
                value={catForm.forClass}
                onValueChange={(v) =>
                  setCatForm((p) => ({ ...p, forClass: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Classes</SelectItem>
                  {["V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"].map(
                    (c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Frequency</Label>
              <Select
                value={catForm.frequency}
                onValueChange={(v) =>
                  setCatForm((p) => ({
                    ...p,
                    frequency: v as FeeCategory["frequency"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Annual">Annual</SelectItem>
                  <SelectItem value="Term">Per Term</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCatDialog(false)}
              data-ocid="fees.category.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={saveCat} data-ocid="fees.category.save_button">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Discount Dialog */}
      <Dialog open={discDialog} onOpenChange={setDiscDialog}>
        <DialogContent data-ocid="fees.discount.dialog">
          <DialogHeader>
            <DialogTitle>{editDisc ? "Edit" : "Add"} Discount</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Discount Name</Label>
              <Input
                value={discForm.name}
                onChange={(e) =>
                  setDiscForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Sibling Discount"
                data-ocid="fees.discount.input"
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select
                value={discForm.type}
                onValueChange={(v) =>
                  setDiscForm((p) => ({ ...p, type: v as Discount["type"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Percentage">Percentage (%)</SelectItem>
                  <SelectItem value="Fixed">Fixed Amount (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Value</Label>
              <Input
                type="number"
                value={discForm.value}
                onChange={(e) =>
                  setDiscForm((p) => ({ ...p, value: e.target.value }))
                }
                placeholder={discForm.type === "Percentage" ? "10" : "3000"}
              />
            </div>
            <div>
              <Label>Applied To</Label>
              <Input
                value={discForm.appliedTo}
                onChange={(e) =>
                  setDiscForm((p) => ({ ...p, appliedTo: e.target.value }))
                }
                placeholder="All or student name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDiscDialog(false)}
              data-ocid="fees.discount.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={saveDisc} data-ocid="fees.discount.save_button">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
