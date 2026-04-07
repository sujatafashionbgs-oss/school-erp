import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  Copy,
  CreditCard,
  Loader2,
  QrCode,
  Smartphone,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface PaymentGatewayProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  studentName: string;
  onSuccess: (result: { txnId: string; paymentMethod: string }) => void;
}

type PayState = "idle" | "processing" | "success" | "failed";

const UPI_SUFFIXES = ["@okaxis", "@oksbi", "@paytm", "@ybl", "@ibl"];
const UPI_DISPLAY_ID = "smartskale@okaxis";

// Minimal QR-like pattern using colored divs
function MockQRCode() {
  // Generate a deterministic 10x10 grid for visual representation
  const pattern = Array.from({ length: 10 }, (_, r) =>
    Array.from({ length: 10 }, (_, c) => ({
      filled:
        (r < 3 && c < 3) || (r < 3 && c > 6) || (r > 6 && c < 3)
          ? true
          : (r * 7 + c * 13) % 5 < 2,
      key: `qr-${r}-${c}`,
    })),
  );

  return (
    <div
      className="inline-grid p-2 bg-white border-2 border-border rounded-lg"
      style={{ gridTemplateColumns: "repeat(10, 1fr)", gap: 2 }}
    >
      {pattern.flat().map(({ filled, key }) => (
        <div
          key={key}
          className={`w-4 h-4 rounded-sm ${filled ? "bg-gray-900" : "bg-white"}`}
        />
      ))}
    </div>
  );
}

export function PaymentGateway({
  open,
  onClose,
  amount,
  studentName,
  onSuccess,
}: PaymentGatewayProps) {
  const [activeTab, setActiveTab] = useState("card");
  const [state, setState] = useState<PayState>("idle");
  const [txnId, setTxnId] = useState("");

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // UPI
  const [upiId, setUpiId] = useState("");

  const handleClose = () => {
    if (state === "processing") return;
    // Reset
    setState("idle");
    setTxnId("");
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setCardName("");
    setUpiId("");
    onClose();
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const appendUpiSuffix = (suffix: string) => {
    const base = upiId.includes("@") ? upiId.split("@")[0] : upiId;
    setUpiId(base + suffix);
  };

  const validate = () => {
    if (activeTab === "card") {
      if (cardNumber.replace(/\s/g, "").length < 16) {
        toast.error("Please enter a valid 16-digit card number");
        return false;
      }
      if (expiry.length < 5) {
        toast.error("Please enter a valid expiry date (MM/YY)");
        return false;
      }
      if (cvv.length < 3) {
        toast.error("Please enter a valid 3-digit CVV");
        return false;
      }
      if (!cardName.trim()) {
        toast.error("Please enter cardholder name");
        return false;
      }
    } else if (activeTab === "upi") {
      if (!upiId.includes("@")) {
        toast.error("Please enter a valid UPI ID (e.g. name@bank)");
        return false;
      }
    }
    // QR tab: no validation needed
    return true;
  };

  const handlePay = () => {
    if (!validate()) return;
    setState("processing");
    setTimeout(() => {
      const success = Math.random() > 0.15;
      if (success) {
        const newTxnId = `TXN${Date.now().toString().slice(-8)}`;
        setState("success");
        setTxnId(newTxnId);
      } else {
        setState("failed");
      }
    }, 1500);
  };

  const handleDone = () => {
    onSuccess({ txnId, paymentMethod: activeTab });
    handleClose();
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_DISPLAY_ID);
    toast.success("Copied!");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="max-w-md p-0 overflow-hidden"
        data-ocid="payment_gateway.dialog"
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">
                Pay ₹{amount.toLocaleString("en-IN")}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Secure Payment for {studentName}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                🔒 Secured
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-4">
          {state === "processing" && (
            <div
              className="flex flex-col items-center justify-center py-12 gap-4"
              data-ocid="payment_gateway.loading_state"
            >
              <Loader2 size={40} className="animate-spin text-primary" />
              <p className="text-lg font-semibold text-foreground">
                Processing payment...
              </p>
              <p className="text-sm text-muted-foreground">
                Please do not close this window
              </p>
            </div>
          )}

          {state === "success" && (
            <div
              className="flex flex-col items-center justify-center py-10 gap-4"
              data-ocid="payment_gateway.success_state"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center">
                <Check size={32} className="text-green-600" />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">
                  Payment Successful!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  ₹{amount.toLocaleString("en-IN")} paid for {studentName}
                </p>
              </div>
              <div className="w-full bg-muted rounded-xl px-4 py-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  Transaction ID
                </p>
                <p className="font-mono font-bold text-foreground text-sm">
                  {txnId}
                </p>
              </div>
              <Button
                className="w-full"
                onClick={handleDone}
                data-ocid="payment_gateway.done_button"
              >
                Done
              </Button>
            </div>
          )}

          {state === "failed" && (
            <div
              className="flex flex-col items-center justify-center py-10 gap-4"
              data-ocid="payment_gateway.error_state"
            >
              <div className="w-16 h-16 rounded-full bg-destructive/15 flex items-center justify-center">
                <X size={32} className="text-destructive" />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">
                  Payment Failed
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  The transaction could not be processed. Please try again.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setState("idle")}
                data-ocid="payment_gateway.retry_button"
              >
                Retry
              </Button>
              <button
                type="button"
                className="text-sm text-muted-foreground hover:underline"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          )}

          {state === "idle" && (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              data-ocid="payment_gateway.tabs"
            >
              <TabsList className="grid grid-cols-3 w-full mb-5">
                <TabsTrigger
                  value="card"
                  className="gap-1.5 text-xs"
                  data-ocid="payment_gateway.card.tab"
                >
                  <CreditCard size={14} /> Card
                </TabsTrigger>
                <TabsTrigger
                  value="upi"
                  className="gap-1.5 text-xs"
                  data-ocid="payment_gateway.upi.tab"
                >
                  <Smartphone size={14} /> UPI ID
                </TabsTrigger>
                <TabsTrigger
                  value="qr"
                  className="gap-1.5 text-xs"
                  data-ocid="payment_gateway.qr.tab"
                >
                  <QrCode size={14} /> UPI QR
                </TabsTrigger>
              </TabsList>

              {/* Card / Net Banking */}
              <TabsContent value="card" className="space-y-4 mt-0">
                {/* Bank logos row */}
                <div className="flex gap-2 flex-wrap">
                  {["VISA", "Mastercard", "RuPay", "Net Banking"].map((b) => (
                    <span
                      key={b}
                      className="text-xs font-semibold px-2 py-1 rounded-md border border-border bg-muted text-muted-foreground"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(formatCardNumber(e.target.value))
                    }
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="font-mono tracking-widest"
                    data-ocid="payment_gateway.card_number.input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="card-expiry">Expiry (MM/YY)</Label>
                    <Input
                      id="card-expiry"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="font-mono"
                      data-ocid="payment_gateway.expiry.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="card-cvv">CVV</Label>
                    <Input
                      id="card-cvv"
                      type="password"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                      }
                      placeholder="•••"
                      maxLength={3}
                      className="font-mono"
                      data-ocid="payment_gateway.cvv.input"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="card-name">Cardholder Name</Label>
                  <Input
                    id="card-name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="As on card"
                    data-ocid="payment_gateway.card_name.input"
                  />
                </div>

                <Button
                  className="w-full font-semibold"
                  onClick={handlePay}
                  data-ocid="payment_gateway.pay_button"
                >
                  Pay ₹{amount.toLocaleString("en-IN")}
                </Button>
              </TabsContent>

              {/* UPI ID */}
              <TabsContent value="upi" className="space-y-4 mt-0">
                <div className="space-y-1">
                  <Label htmlFor="upi-id">UPI ID</Label>
                  <Input
                    id="upi-id"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@bank"
                    data-ocid="payment_gateway.upi_id.input"
                  />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Quick select bank:
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {UPI_SUFFIXES.map((suffix) => (
                      <button
                        key={suffix}
                        type="button"
                        onClick={() => appendUpiSuffix(suffix)}
                        className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted hover:bg-secondary hover:border-primary transition-colors font-mono font-medium"
                        data-ocid="payment_gateway.upi_suffix.button"
                      >
                        {suffix}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-xs text-blue-700 dark:text-blue-300">
                  💡 Enter your UPI ID and click Pay. You will receive a payment
                  request on your UPI app.
                </div>

                <Button
                  className="w-full font-semibold"
                  onClick={handlePay}
                  data-ocid="payment_gateway.pay_button"
                >
                  Pay ₹{amount.toLocaleString("en-IN")}
                </Button>
              </TabsContent>

              {/* UPI QR */}
              <TabsContent value="qr" className="space-y-4 mt-0">
                <div className="flex flex-col items-center gap-4 py-2">
                  <MockQRCode />

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">
                      Pay to UPI ID
                    </p>
                    <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                      <span className="font-mono font-semibold text-sm text-foreground">
                        {UPI_DISPLAY_ID}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        data-ocid="payment_gateway.copy_upi.button"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Open any UPI app and scan the QR code
                    <br />
                    <span className="font-medium">
                      Amount: ₹{amount.toLocaleString("en-IN")}
                    </span>
                  </p>
                </div>

                <Button
                  className="w-full font-semibold"
                  onClick={handlePay}
                  data-ocid="payment_gateway.pay_button"
                >
                  I have paid ₹{amount.toLocaleString("en-IN")}
                </Button>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
