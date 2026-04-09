import { PaymentGateway } from "@/components/PaymentGateway";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { CLASSES, SECTIONS } from "@/data/classConfig";
import { type Student, mockStudents } from "@/data/mockStudents";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
  History,
  Search,
  WifiOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import type { FeeCategory, FeePayment } from "../../backend.d.ts";

// ─── Fallback mock fee categories ─────────────────────────────────────────────
const MOCK_FEE_CATEGORIES: FeeCategory[] = [
  {
    id: "tuition",
    name: "Tuition Fee",
    amount: 5000,
    dueDate: "2026-03-31",
    academicYear: "2026-27",
    className: "",
    section: "",
    isOptional: false,
  },
  {
    id: "transport",
    name: "Transport Fee",
    amount: 1200,
    dueDate: "2026-03-31",
    academicYear: "2026-27",
    className: "",
    section: "",
    isOptional: true,
  },
  {
    id: "library",
    name: "Library Fee",
    amount: 500,
    dueDate: "2026-04-15",
    academicYear: "2026-27",
    className: "",
    section: "",
    isOptional: false,
  },
  {
    id: "sports",
    name: "Sports Fee",
    amount: 800,
    dueDate: "2026-04-15",
    academicYear: "2026-27",
    className: "",
    section: "",
    isOptional: false,
  },
  {
    id: "activity",
    name: "Activity Fee",
    amount: 600,
    dueDate: "2026-04-30",
    academicYear: "2026-27",
    className: "",
    section: "",
    isOptional: false,
  },
];

interface FeeItem {
  id: string;
  name: string;
  due: number;
  paid: number;
  dueDate: string;
  partialPayment: string;
}

function paymentStatusBadge(status: string) {
  const colors: Record<string, string> = {
    Paid: "bg-green-500/15 text-green-700",
    Partial: "bg-yellow-500/15 text-yellow-700",
    Overdue: "bg-destructive/15 text-destructive",
  };
  return colors[status] ?? "bg-muted text-muted-foreground";
}

export function FeeCollect({ navigate }: { navigate?: (p: string) => void }) {
  const { actor, isFetching: isActorLoading } = useActor(createActor);

  // Search state
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [student, setStudent] = useState<Student | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  // Fee categories (from backend or fallback)
  const [feeCategories, setFeeCategories] = useState<FeeCategory[]>([]);
  const [, setLoadingCategories] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  // Fee items (with paid/due from backend fee status)
  const [feeItems, setFeeItems] = useState<FeeItem[]>([]);
  const [loadingFeeStatus, setLoadingFeeStatus] = useState(false);

  // Payment state
  const [paymentMode, setPaymentMode] = useState("cash");
  const [collected, setCollected] = useState(false);
  const [receiptNo, setReceiptNo] = useState("");
  const [collectedItems, setCollectedItems] = useState<FeeItem[]>([]);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [previousReceipts, setPreviousReceipts] = useState<string[]>([]);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [gatewayTxnId, setGatewayTxnId] = useState("");
  const [saving, setSaving] = useState(false);

  // Payment history
  const [paymentHistory, setPaymentHistory] = useState<FeePayment[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(false);

  // Track if we already loaded categories for this class
  const lastCategoryClass = useRef<string | null>(null);

  // ── Load fee categories when class filter changes or actor becomes available ──
  useEffect(() => {
    if (isActorLoading) return;
    const cls = classFilter === "all" ? null : classFilter;
    const cacheKey = cls ?? "__all__";
    if (lastCategoryClass.current === cacheKey) return;
    lastCategoryClass.current = cacheKey;

    setLoadingCategories(true);
    if (actor) {
      actor
        .loadFeeCategories(cls, "2026-27")
        .then((cats) => {
          if (cats.length > 0) {
            setFeeCategories(cats);
            setIsDemo(false);
          } else {
            setFeeCategories(MOCK_FEE_CATEGORIES);
            setIsDemo(true);
          }
        })
        .catch(() => {
          setFeeCategories(MOCK_FEE_CATEGORIES);
          setIsDemo(true);
        })
        .finally(() => setLoadingCategories(false));
    } else {
      setFeeCategories(MOCK_FEE_CATEGORIES);
      setIsDemo(true);
      setLoadingCategories(false);
    }
  }, [actor, isActorLoading, classFilter]);

  // ── Reload categories when class filter changes (reset cache key) ──
  const handleClassFilterChange = (v: string) => {
    setClassFilter(v);
    setSectionFilter("all");
    lastCategoryClass.current = null; // force reload
  };

  // ── Load student fee status + payment history when student is selected ──
  const loadStudentData = async (s: Student) => {
    setFeeItems([]);
    setPaymentHistory([]);
    setHistoryExpanded(false);
    setLoadingFeeStatus(true);
    setLoadingHistory(true);

    const cats = feeCategories.length > 0 ? feeCategories : MOCK_FEE_CATEGORIES;

    if (actor) {
      // Load fee status (paid/outstanding per student)
      try {
        const status = await actor.getStudentFeeStatus(s.id, "2026-27");
        // Distribute paid amount across categories proportionally
        const totalDue = cats.reduce((sum, c) => sum + c.amount, 0);
        const paidSoFar = status.paid;
        let remainingPaid = paidSoFar;

        const items: FeeItem[] = cats.map((cat) => {
          const catPaid =
            totalDue > 0
              ? Math.min(
                  cat.amount,
                  Math.round((cat.amount / totalDue) * paidSoFar),
                )
              : 0;
          const allocated = Math.min(catPaid, remainingPaid);
          remainingPaid -= allocated;
          return {
            id: cat.id,
            name: cat.name,
            due: cat.amount,
            paid: allocated,
            dueDate: cat.dueDate,
            partialPayment:
              cat.amount - allocated > 0 ? String(cat.amount - allocated) : "0",
          };
        });
        setFeeItems(items);
      } catch {
        setFeeItems(buildFeeItemsFromMock(cats));
      }

      // Load payment history
      try {
        const history = await actor.loadPaymentsByStudent(s.id);
        setPaymentHistory(history);
      } catch {
        setPaymentHistory([]);
      }
    } else {
      setFeeItems(buildFeeItemsFromMock(cats));
    }

    setLoadingFeeStatus(false);
    setLoadingHistory(false);
  };

  function buildFeeItemsFromMock(cats: FeeCategory[]): FeeItem[] {
    return cats.map((cat) => ({
      id: cat.id,
      name: cat.name,
      due: cat.amount,
      paid: 0,
      dueDate: cat.dueDate,
      partialPayment: String(cat.amount),
    }));
  }

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    await new Promise((r) => setTimeout(r, 300));
    const candidates =
      classFilter !== "all"
        ? mockStudents.filter((s) => {
            if (s.className !== classFilter) return false;
            if (sectionFilter !== "all" && s.section !== sectionFilter)
              return false;
            return true;
          })
        : mockStudents;
    const found = candidates.find(
      (s) =>
        s.admissionNo.toLowerCase() === query.toLowerCase() ||
        s.name.toLowerCase().includes(query.toLowerCase()),
    );
    setSearchAttempted(true);
    setStudent(found || null);
    setSearching(false);
    setCollected(false);
    setReceiptNo("");
    setGatewayTxnId("");
    if (found) {
      await loadStudentData(found);
    }
  };

  const totalOutstanding = feeItems.reduce(
    (sum, f) => sum + (f.due - f.paid),
    0,
  );
  const totalCollecting = feeItems.reduce(
    (sum, f) => sum + (Number(f.partialPayment) || 0),
    0,
  );

  const proceedWithCollection = async (txnId?: string) => {
    if (!student) return;
    const newReceiptNo = `RCP-${String(Date.now() % 1000000).padStart(6, "0")}`;
    setSaving(true);

    const payment: FeePayment = {
      id: `PAY-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      admissionNo: student.admissionNo,
      className: student.className,
      section: student.section,
      academicYear: "2026-27",
      receiptNo: newReceiptNo,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMode,
      totalAmount: feeItems.reduce((s, f) => s + f.due, 0),
      paidAmount: totalCollecting,
      balance: totalOutstanding - totalCollecting,
      status: totalOutstanding - totalCollecting <= 0 ? "Paid" : "Partial",
      txnId: txnId ?? "",
      categories: feeItems
        .filter((f) => Number(f.partialPayment) > 0)
        .map((f) => ({
          categoryId: f.id,
          categoryName: f.name,
          amount: f.due,
          paid: Number(f.partialPayment),
        })),
    };

    if (actor) {
      try {
        const result = await actor.savePayment(payment);
        if (result.__kind__ === "err") {
          toast.error(result.err);
          setSaving(false);
          return;
        }
      } catch (_e) {
        toast.error("Failed to save payment. Please try again.");
        setSaving(false);
        return;
      }
    }

    setReceiptNo(newReceiptNo);
    setCollectedItems([...feeItems]);
    setCollected(true);
    setShowDuplicateWarning(false);
    if (txnId) setGatewayTxnId(txnId);
    setSaving(false);

    // Refresh history after save
    if (actor) {
      actor
        .loadPaymentsByStudent(student.id)
        .then(setPaymentHistory)
        .catch(() => {});
    }

    toast.success(`Fee of ₹${totalCollecting} collected from ${student.name}`);
  };

  const handleCollect = () => {
    if (totalCollecting <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }
    const duplicateFeeHeads = feeItems.filter(
      (item) => Number.parseFloat(item.partialPayment) > 0 && item.paid > 0,
    );
    if (duplicateFeeHeads.length > 0) {
      setPreviousReceipts(duplicateFeeHeads.map((f) => f.name));
      setShowDuplicateWarning(true);
      return;
    }
    if (paymentMode === "online") {
      setShowPaymentGateway(true);
      return;
    }
    proceedWithCollection();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6" data-ocid="fee_collect.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Collect Fee</h1>
        <p className="text-muted-foreground text-sm">
          Search student and collect fee payment
        </p>
      </div>

      {/* Demo mode banner */}
      {isDemo && !isActorLoading && (
        <div
          className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 rounded-xl px-4 py-2.5 text-sm"
          data-ocid="fee_collect.demo_banner"
        >
          <WifiOff size={15} />
          <span>
            <strong>Demo mode</strong> — using sample fee categories. Connect to
            backend to load real data.
          </span>
        </div>
      )}

      {/* Search */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <Label className="mb-2 block">Search Student</Label>
        <div className="flex gap-2 mb-3 flex-wrap">
          <Select value={classFilter} onValueChange={handleClassFilterChange}>
            <SelectTrigger
              className="w-36"
              data-ocid="fee_collect.class_filter.select"
            >
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              <SelectItem value="all">All Classes</SelectItem>
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
            disabled={classFilter === "all"}
          >
            <SelectTrigger
              className="w-36"
              data-ocid="fee_collect.section_filter.select"
            >
              <SelectValue placeholder="All Sections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
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
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Admission no or student name"
              className="pl-9"
              data-ocid="fee_collect.search.input"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={searching}
            data-ocid="fee_collect.search.button"
          >
            {searching ? "Searching..." : "Search"}
          </Button>
        </div>
        {searchAttempted && !student && !searching && (
          <div
            className="mt-3 flex items-center gap-2 text-destructive bg-destructive/10 rounded-xl px-4 py-3 text-sm"
            data-ocid="fee_collect.error_state"
          >
            <AlertCircle size={16} />
            No student found. Please check and try again.
          </div>
        )}
      </div>

      {/* Student Info + Fee Breakdown */}
      {student && (
        <div
          className="bg-card border border-border rounded-2xl p-5 space-y-4"
          data-ocid="fee_collect.student.card"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              {student.name.charAt(0)}
            </div>
            <div>
              <button
                type="button"
                className="font-semibold text-foreground cursor-pointer hover:text-primary hover:underline text-left"
                onClick={() =>
                  navigate?.(`/admin/students?highlight=${student.id}`)
                }
              >
                {student.name}
              </button>
              <p className="text-sm text-muted-foreground">
                Class {student.className}-{student.section} ·{" "}
                {student.admissionNo}
              </p>
              <p className="text-sm text-muted-foreground">
                {student.fatherName}
              </p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-muted-foreground">Outstanding</p>
              {loadingFeeStatus ? (
                <Skeleton className="h-7 w-20 mt-1 ml-auto" />
              ) : (
                <p
                  className={`text-xl font-bold ${
                    totalOutstanding > 0 ? "text-destructive" : "text-green-600"
                  }`}
                >
                  ₹{totalOutstanding}
                </p>
              )}
            </div>
          </div>

          {collected ? (
            <div
              className="border border-border rounded-2xl p-5 space-y-3 bg-card"
              data-ocid="fee_collect.receipt"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Fee Receipt</h3>
                <Badge className="bg-green-500/15 text-green-600">
                  <CheckCircle size={12} className="mr-1" /> Paid
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground space-y-1.5">
                <div className="flex justify-between">
                  <span>School</span>
                  <span className="text-foreground font-medium">
                    SmartSkale Public School
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Student</span>
                  <span className="text-foreground font-medium">
                    {student?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Receipt No.</span>
                  <span className="text-foreground font-medium font-mono">
                    {receiptNo}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Date</span>
                  <span className="text-foreground font-medium">
                    {new Date().toLocaleDateString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Mode</span>
                  <span className="text-foreground font-medium capitalize">
                    {paymentMode}
                  </span>
                </div>
                {gatewayTxnId && (
                  <div
                    className="flex justify-between"
                    data-ocid="fee_collect.receipt.txn_id"
                  >
                    <span>Transaction ID</span>
                    <span className="text-foreground font-medium font-mono">
                      {gatewayTxnId}
                    </span>
                  </div>
                )}
              </div>
              {/* Itemized breakdown */}
              <div className="border-t border-border pt-3 space-y-1 text-xs">
                <p className="font-semibold text-foreground mb-2">
                  Payment Breakdown
                </p>
                {collectedItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium text-foreground">
                      {Number(item.partialPayment) > 0
                        ? `₹${item.partialPayment}`
                        : "—"}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-border pt-1 font-bold">
                  <span className="text-foreground">Total Collected</span>
                  <span className="text-foreground">
                    ₹
                    {collectedItems.reduce(
                      (s, i) => s + (Number(i.partialPayment) || 0),
                      0,
                    )}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.print()}
                data-ocid="fee_collect.print_button"
              >
                Print Receipt
              </Button>
            </div>
          ) : (
            <div className="space-y-4 border-t border-border pt-4">
              {/* Fee breakdown table */}
              <div>
                <p className="text-sm font-semibold text-foreground mb-3">
                  Fee Breakdown
                </p>
                {loadingFeeStatus ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-8 w-full rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <div className="border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-muted/40 border-b border-border">
                          <th className="text-left px-3 py-2 font-semibold text-muted-foreground">
                            Fee Head
                          </th>
                          <th className="text-right px-3 py-2 font-semibold text-muted-foreground">
                            Due
                          </th>
                          <th className="text-right px-3 py-2 font-semibold text-muted-foreground">
                            Paid
                          </th>
                          <th className="text-right px-3 py-2 font-semibold text-muted-foreground">
                            Balance
                          </th>
                          <th className="text-right px-3 py-2 font-semibold text-muted-foreground">
                            Due Date
                          </th>
                          <th className="text-right px-3 py-2 font-semibold text-muted-foreground">
                            Pay Now
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {feeItems.map((item, i) => {
                          const balance = item.due - item.paid;
                          const payNow = Number(item.partialPayment) || 0;
                          const isOver = payNow > balance;
                          return (
                            <tr
                              key={item.id}
                              className="border-b border-border last:border-0"
                              data-ocid={`fee_collect.fee_item.${i + 1}`}
                            >
                              <td className="px-3 py-2 font-medium text-foreground">
                                {item.name}
                              </td>
                              <td className="px-3 py-2 text-right text-muted-foreground">
                                ₹{item.due}
                              </td>
                              <td className="px-3 py-2 text-right text-green-600">
                                ₹{item.paid}
                              </td>
                              <td
                                className={`px-3 py-2 text-right font-semibold ${
                                  balance > 0
                                    ? "text-destructive"
                                    : "text-green-600"
                                }`}
                              >
                                ₹{balance}
                              </td>
                              <td className="px-3 py-2 text-right text-muted-foreground">
                                {item.dueDate}
                              </td>
                              <td className="px-3 py-2 text-right">
                                <input
                                  type="number"
                                  min="0"
                                  max={balance}
                                  value={item.partialPayment}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (Number.isNaN(val) || val < 0) {
                                      toast.error("Amount cannot be negative");
                                      return;
                                    }
                                    if (val > balance) {
                                      toast.error(
                                        `Amount cannot exceed balance (₹${balance})`,
                                      );
                                      return;
                                    }
                                    setFeeItems((prev) =>
                                      prev.map((f) =>
                                        f.id === item.id
                                          ? {
                                              ...f,
                                              partialPayment: e.target.value,
                                            }
                                          : f,
                                      ),
                                    );
                                  }}
                                  disabled={balance <= 0}
                                  className={`w-20 h-7 px-2 rounded border ${
                                    isOver
                                      ? "border-destructive ring-1 ring-destructive"
                                      : "border-input"
                                  } bg-background text-xs text-right focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-40`}
                                  data-ocid={`fee_collect.pay_now.input.${i + 1}`}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-muted/20 font-semibold">
                          <td className="px-3 py-2 text-foreground">Total</td>
                          <td className="px-3 py-2 text-right text-foreground">
                            ₹{feeItems.reduce((s, f) => s + f.due, 0)}
                          </td>
                          <td className="px-3 py-2 text-right text-green-600">
                            ₹{feeItems.reduce((s, f) => s + f.paid, 0)}
                          </td>
                          <td className="px-3 py-2 text-right text-destructive">
                            ₹{totalOutstanding}
                          </td>
                          <td />
                          <td className="px-3 py-2 text-right text-primary">
                            ₹{totalCollecting}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Payment Mode</Label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                  data-ocid="fee_collect.payment_mode.select"
                >
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="online">Online / UPI</option>
                  <option value="dd">Demand Draft</option>
                </select>
              </div>

              <Button
                onClick={handleCollect}
                className="w-full"
                disabled={totalCollecting <= 0 || saving}
                data-ocid="fee_collect.collect.button"
              >
                {saving ? (
                  "Saving..."
                ) : (
                  <>
                    <CreditCard size={16} className="mr-2" /> Collect ₹
                    {totalCollecting}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Payment History */}
      {student && (
        <div
          className="bg-card border border-border rounded-2xl overflow-hidden"
          data-ocid="fee_collect.payment_history"
        >
          <button
            type="button"
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
            onClick={() => setHistoryExpanded((v) => !v)}
            data-ocid="fee_collect.history_toggle"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <History size={16} className="text-primary" />
              Payment History
              {paymentHistory.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {paymentHistory.length}
                </Badge>
              )}
            </div>
            {historyExpanded ? (
              <ChevronUp size={16} className="text-muted-foreground" />
            ) : (
              <ChevronDown size={16} className="text-muted-foreground" />
            )}
          </button>

          {historyExpanded && (
            <div className="border-t border-border px-5 pb-4">
              {loadingHistory ? (
                <div className="space-y-2 pt-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-lg" />
                  ))}
                </div>
              ) : paymentHistory.length === 0 ? (
                <div
                  className="py-8 text-center text-muted-foreground text-sm"
                  data-ocid="fee_collect.history_empty"
                >
                  No payment records found for this student.
                </div>
              ) : (
                <div className="overflow-x-auto pt-3">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left pb-2 font-semibold text-muted-foreground">
                          Receipt
                        </th>
                        <th className="text-left pb-2 font-semibold text-muted-foreground">
                          Date
                        </th>
                        <th className="text-right pb-2 font-semibold text-muted-foreground">
                          Amount
                        </th>
                        <th className="text-left pb-2 font-semibold text-muted-foreground pl-3">
                          Mode
                        </th>
                        <th className="text-left pb-2 font-semibold text-muted-foreground pl-3">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((p) => (
                        <tr
                          key={p.id}
                          className="border-b border-border/50 last:border-0"
                          data-ocid={`fee_collect.history_row.${p.id}`}
                        >
                          <td className="py-2 font-mono text-foreground">
                            {p.receiptNo}
                          </td>
                          <td className="py-2 text-muted-foreground">
                            {p.paymentDate}
                          </td>
                          <td className="py-2 text-right font-semibold text-foreground">
                            ₹{p.paidAmount}
                          </td>
                          <td className="py-2 pl-3 capitalize text-muted-foreground">
                            {p.paymentMode}
                          </td>
                          <td className="py-2 pl-3">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${paymentStatusBadge(p.status)}`}
                            >
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Payment Gateway Dialog */}
      <PaymentGateway
        open={showPaymentGateway}
        onClose={() => setShowPaymentGateway(false)}
        amount={totalCollecting}
        studentName={student?.name ?? ""}
        onSuccess={({ txnId, paymentMethod: _pm }) => {
          setShowPaymentGateway(false);
          proceedWithCollection(txnId);
        }}
      />

      <AlertDialog
        open={showDuplicateWarning}
        onOpenChange={setShowDuplicateWarning}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate Receipt Warning</AlertDialogTitle>
            <AlertDialogDescription>
              A receipt for <strong>{previousReceipts.join(", ")}</strong> may
              already exist for this student this month. Proceeding will create
              a duplicate receipt. Are you sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowDuplicateWarning(false);
                if (paymentMode === "online") {
                  setShowPaymentGateway(true);
                } else {
                  proceedWithCollection();
                }
              }}
            >
              Proceed Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
