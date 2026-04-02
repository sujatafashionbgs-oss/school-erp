import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { useAuth } from "@/context/AuthContext";
import { mockStudents } from "@/data/mockStudents";
import { useLoadingData } from "@/hooks/useLoadingData";
import {
  Building2,
  CheckCircle,
  CreditCard,
  Download,
  Loader2,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type PayMethod = "upi" | "netbanking" | "debit" | "credit";

export function StudentFees() {
  const { user } = useAuth();
  const { loading } = useLoadingData(null);

  const [payDialog, setPayDialog] = useState<{
    open: boolean;
    amount: number;
    term: string;
  }>({ open: false, amount: 0, term: "" });
  const [payMethod, setPayMethod] = useState<PayMethod>("upi");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState<{ txnId: string } | null>(null);
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("SBI");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  if (loading) {
    return (
      <div className="max-w-xl space-y-5">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  const student =
    mockStudents.find((s) => s.admissionNo === user?.admissionNo) ||
    mockStudents[0];

  const feeItems = [
    { term: "Term 1 (Apr-Jun)", amount: 5000, paid: true },
    { term: "Term 2 (Jul-Sep)", amount: 5000, paid: true },
    {
      term: "Term 3 (Oct-Dec)",
      amount: student.feeDue || 0,
      paid: student.feeDue === 0,
    },
  ];

  const openPayDialog = () => {
    setPayDialog({
      open: true,
      amount: student.feeDue,
      term: "Term 3 (Oct-Dec)",
    });
    setSuccess(null);
    setProcessing(false);
  };

  const closePayDialog = () => {
    setPayDialog({ open: false, amount: 0, term: "" });
    setSuccess(null);
    setProcessing(false);
  };

  const handlePay = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSuccess({ txnId: `TXN${Date.now()}` });
    setProcessing(false);
  };

  const METHODS: { id: PayMethod; label: string; icon: React.ReactNode }[] = [
    { id: "upi", label: "UPI", icon: <Smartphone size={18} /> },
    { id: "netbanking", label: "Net Banking", icon: <Building2 size={18} /> },
    { id: "debit", label: "Debit Card", icon: <CreditCard size={18} /> },
    { id: "credit", label: "Credit Card", icon: <CreditCard size={18} /> },
  ];

  return (
    <div className="max-w-xl space-y-5" data-ocid="student_fees.page">
      <h1 className="text-2xl font-bold text-foreground">Fee Details</h1>
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Due</p>
            <p
              className={`text-3xl font-bold ${student.feeDue > 0 ? "text-destructive" : "text-green-600"}`}
            >
              {student.feeDue > 0 ? `₹${student.feeDue}` : "Paid"}
            </p>
          </div>
          {student.feeDue > 0 && (
            <Button onClick={openPayDialog} data-ocid="student_fees.pay.button">
              <CreditCard size={16} className="mr-2" /> Pay Now
            </Button>
          )}
        </div>
        <div className="space-y-3" data-ocid="student_fees.list">
          {feeItems.map((f, i) => (
            <div
              key={f.term}
              className="flex items-center justify-between p-3 rounded-xl bg-secondary/30"
              data-ocid={`student_fees.item.${i + 1}`}
            >
              <div>
                <p className="text-sm font-medium text-foreground">{f.term}</p>
                <p className="text-sm font-bold text-foreground">₹{f.amount}</p>
              </div>
              <Badge
                variant={f.paid ? "secondary" : "destructive"}
                className="text-xs"
              >
                {f.paid ? (
                  <>
                    <CheckCircle size={10} className="mr-1" />
                    Paid
                  </>
                ) : (
                  "Pending"
                )}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog
        open={payDialog.open}
        onOpenChange={(o) => {
          if (!o) closePayDialog();
        }}
      >
        <DialogContent className="max-w-md" data-ocid="student_fees.dialog">
          <DialogHeader>
            <DialogTitle>Online Fee Payment</DialogTitle>
          </DialogHeader>

          {processing ? (
            <div
              className="flex flex-col items-center gap-4 py-10"
              data-ocid="student_fees.loading_state"
            >
              <Loader2 size={40} className="animate-spin text-primary" />
              <p className="text-muted-foreground text-sm">
                Processing payment...
              </p>
            </div>
          ) : success ? (
            <div
              className="flex flex-col items-center gap-4 py-6"
              data-ocid="student_fees.success_state"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center">
                <CheckCircle size={36} className="text-green-600" />
              </div>
              <p className="text-xl font-bold text-foreground">
                Payment Successful!
              </p>
              <div className="w-full space-y-2 bg-secondary/30 rounded-xl p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="text-foreground font-mono font-medium">
                    {success.txnId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="text-foreground font-bold">
                    ₹{payDialog.amount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="text-foreground">
                    {new Date().toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => toast.info("Receipt download would start here")}
                data-ocid="student_fees.download_receipt_button"
              >
                <Download size={15} className="mr-2" /> Download Receipt
              </Button>
              <Button
                className="w-full"
                onClick={closePayDialog}
                data-ocid="student_fees.close_button"
              >
                Close
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-center py-3 bg-primary/5 rounded-xl">
                <p className="text-sm text-muted-foreground">Amount to Pay</p>
                <p className="text-4xl font-bold text-foreground">
                  ₹{payDialog.amount}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {payDialog.term}
                </p>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 gap-2">
                  {METHODS.map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setPayMethod(m.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-colors ${
                        payMethod === m.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50 text-foreground"
                      }`}
                      data-ocid={`student_fees.${m.id}_method`}
                    >
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Method-specific form */}
              {payMethod === "upi" && (
                <div className="space-y-1.5">
                  <Label>UPI ID</Label>
                  <Input
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="Enter UPI ID (e.g. name@upi)"
                    data-ocid="student_fees.upi_id.input"
                  />
                </div>
              )}
              {payMethod === "netbanking" && (
                <div className="space-y-1.5">
                  <Label>Select Bank</Label>
                  <Select value={bank} onValueChange={setBank}>
                    <SelectTrigger data-ocid="student_fees.bank.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["SBI", "HDFC", "ICICI", "Axis", "PNB"].map((b) => (
                        <SelectItem key={b} value={b}>
                          {b} Bank
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {(payMethod === "debit" || payMethod === "credit") && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label>Card Number</Label>
                    <Input
                      value={cardNum}
                      onChange={(e) => setCardNum(e.target.value.slice(0, 16))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={16}
                      data-ocid="student_fees.card_number.input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Expiry (MM/YY)</Label>
                      <Input
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                        data-ocid="student_fees.expiry.input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>CVV</Label>
                      <Input
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.slice(0, 3))}
                        placeholder="•••"
                        type="password"
                        maxLength={3}
                        data-ocid="student_fees.cvv.input"
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handlePay}
                className="w-full"
                data-ocid="student_fees.pay_submit_button"
              >
                Pay ₹{payDialog.amount}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
