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
import { CLASSES, SECTIONS } from "@/data/classConfig";
import { type Student, mockStudents } from "@/data/mockStudents";
import { AlertCircle, CheckCircle, CreditCard, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const FEE_CATEGORIES = [
  {
    id: "tuition",
    name: "Tuition Fee",
    due: 5000,
    paid: 2500,
    dueDate: "2026-03-31",
  },
  {
    id: "transport",
    name: "Transport Fee",
    due: 1200,
    paid: 1200,
    dueDate: "2026-03-31",
  },
  {
    id: "library",
    name: "Library Fee",
    due: 500,
    paid: 0,
    dueDate: "2026-04-15",
  },
  {
    id: "sports",
    name: "Sports Fee",
    due: 800,
    paid: 0,
    dueDate: "2026-04-15",
  },
  {
    id: "activity",
    name: "Activity Fee",
    due: 600,
    paid: 300,
    dueDate: "2026-04-30",
  },
];

type FeeItem = (typeof FEE_CATEGORIES)[0] & { partialPayment: string };

export function FeeCollect({ navigate }: { navigate?: (p: string) => void }) {
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [student, setStudent] = useState<Student | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [paymentMode, setPaymentMode] = useState("cash");
  const [collected, setCollected] = useState(false);
  const [receiptNo, setReceiptNo] = useState("");
  const [feeItems, setFeeItems] = useState<FeeItem[]>([]);
  const [collectedItems, setCollectedItems] = useState<FeeItem[]>([]);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [previousReceipts, setPreviousReceipts] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    await new Promise((r) => setTimeout(r, 400));
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
    if (found) {
      setFeeItems(
        FEE_CATEGORIES.map((fc) => ({
          ...fc,
          partialPayment: fc.due - fc.paid > 0 ? String(fc.due - fc.paid) : "0",
        })),
      );
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

  const proceedWithCollection = () => {
    const newReceiptNo = `RCP-${Date.now().toString().slice(-6)}`;
    if (!newReceiptNo.trim()) {
      toast.error("Receipt number cannot be empty");
      return;
    }
    if (!/^RCP-\d{6}$/.test(newReceiptNo.trim())) {
      toast.error("Receipt number must follow format: RCP-XXXXXX");
      return;
    }
    setReceiptNo(newReceiptNo);
    setCollectedItems([...feeItems]);
    setCollected(true);
    setShowDuplicateWarning(false);
    toast.success(`Fee of ₹${totalCollecting} collected from ${student?.name}`);
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

      {/* Search */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <Label className="mb-2 block">Search Student</Label>
        <div className="flex gap-2 mb-3 flex-wrap">
          <Select
            value={classFilter}
            onValueChange={(v) => {
              setClassFilter(v);
              setSectionFilter("all");
            }}
          >
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
              <p
                className={`text-xl font-bold ${totalOutstanding > 0 ? "text-destructive" : "text-green-600"}`}
              >
                ₹{totalOutstanding}
              </p>
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
                  <span className="text-foreground font-medium">
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
                                onChange={(e) =>
                                  setFeeItems((prev) =>
                                    prev.map((f) =>
                                      f.id === item.id
                                        ? {
                                            ...f,
                                            partialPayment: e.target.value,
                                          }
                                        : f,
                                    ),
                                  )
                                }
                                disabled={balance <= 0}
                                className="w-20 h-7 px-2 rounded border border-input bg-background text-xs text-right focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-40"
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
                disabled={totalCollecting <= 0}
                data-ocid="fee_collect.collect.button"
              >
                <CreditCard size={16} className="mr-2" /> Collect ₹
                {totalCollecting}
              </Button>
            </div>
          )}
        </div>
      )}

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
            <AlertDialogAction onClick={proceedWithCollection}>
              Proceed Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
