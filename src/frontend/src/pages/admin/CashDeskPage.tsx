import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { type Student, mockStudents } from "@/data/mockStudents";
import {
  CheckCircle,
  CreditCard,
  Printer,
  Search,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const FEE_HEADS = [
  { id: "tuition", label: "Tuition Fee", amount: 5000 },
  { id: "transport", label: "Transport Fee", amount: 1200 },
  { id: "library", label: "Library Fee", amount: 500 },
  { id: "exam", label: "Exam Fee", amount: 800 },
  { id: "activity", label: "Activity Fee", amount: 600 },
  { id: "fine", label: "Late Fine", amount: 200 },
];

type PaymentMethod = "Cash" | "Cheque" | "Money Order" | "EFTPOS";

interface TxnLog {
  time: string;
  rcpt: string;
  student: string;
  cls: string;
  amount: number;
  method: string;
  feeHeads: string;
}

const initialLog: TxnLog[] = [
  {
    time: "08:45 AM",
    rcpt: "RCP-048291",
    student: "Ananya Nair",
    cls: "VIII-A",
    amount: 4500,
    method: "EFTPOS",
    feeHeads: "Tuition Fee",
  },
  {
    time: "09:20 AM",
    rcpt: "RCP-048292",
    student: "Nikhil Das",
    cls: "VI-C",
    amount: 5500,
    method: "Cash",
    feeHeads: "Tuition + Library",
  },
  {
    time: "10:05 AM",
    rcpt: "RCP-048293",
    student: "Vikram Gupta",
    cls: "X-B",
    amount: 4000,
    method: "Cheque",
    feeHeads: "Exam Fee",
  },
  {
    time: "11:30 AM",
    rcpt: "RCP-048294",
    student: "Sita Rao",
    cls: "VII-C",
    amount: 5800,
    method: "Cash",
    feeHeads: "Tuition Fee",
  },
  {
    time: "02:15 PM",
    rcpt: "RCP-048295",
    student: "Ramesh Bhat",
    cls: "IX-B",
    amount: 6500,
    method: "Money Order",
    feeHeads: "Annual Fee",
  },
];

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}
function todayStr() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}
function genRcpt() {
  return `RCP-${String(Date.now() % 1000000).padStart(6, "0")}`;
}
function timeNow() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function CashDeskPage() {
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [amount, setAmount] = useState("");
  const [checkedFeeHeads, setCheckedFeeHeads] = useState<string[]>(["tuition"]);
  const [payMethod, setPayMethod] = useState<PaymentMethod>("Cash");

  // Cash
  const [tendered, setTendered] = useState("");
  // Cheque
  const [chequeNo, setChequeNo] = useState("");
  const [bankName, setBankName] = useState("");
  const [chequeDate, setChequeDate] = useState("");
  // MO
  const [moNo, setMoNo] = useState("");
  const [issuingBank, setIssuingBank] = useState("");
  // EFTPOS
  const [eftposState, setEftposState] = useState<
    "idle" | "processing" | "success" | "declined"
  >("idle");

  const [notes, setNotes] = useState("");
  const [receiptData, setReceiptData] = useState<{
    rcptNo: string;
    student: Student;
    feeHeads: string[];
    amount: number;
    method: string;
    change: number;
  } | null>(null);
  const [txnLog, setTxnLog] = useState<TxnLog[]>(initialLog);

  const changeDue = Math.max(
    0,
    (Number.parseFloat(tendered) || 0) - (Number.parseFloat(amount) || 0),
  );

  const filteredStudents = mockStudents
    .filter(
      (s) =>
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.admissionNo.toLowerCase().includes(studentSearch.toLowerCase()),
    )
    .slice(0, 8);

  function toggleFeeHead(id: string) {
    setCheckedFeeHeads((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id],
    );
  }

  function startEftpos() {
    setEftposState("processing");
    setTimeout(() => {
      const success = Math.random() > 0.1;
      setEftposState(success ? "success" : "declined");
    }, 2000);
  }

  function processPayment() {
    if (!selectedStudent) {
      toast.error("Please select a student first");
      return;
    }
    const amt = Number.parseFloat(amount);
    if (!amt || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (checkedFeeHeads.length === 0) {
      toast.error("Select at least one fee head");
      return;
    }
    if (payMethod === "EFTPOS" && eftposState !== "success") {
      toast.error("Complete EFTPOS payment first");
      return;
    }

    const rcptNo = genRcpt();
    const feeHeadLabels = FEE_HEADS.filter((f) =>
      checkedFeeHeads.includes(f.id),
    ).map((f) => f.label);

    setReceiptData({
      rcptNo,
      student: selectedStudent,
      feeHeads: feeHeadLabels,
      amount: amt,
      method: payMethod,
      change: payMethod === "Cash" ? changeDue : 0,
    });
    setTxnLog((prev) => [
      {
        time: timeNow(),
        rcpt: rcptNo,
        student: selectedStudent.name,
        cls: `${selectedStudent.className}-${selectedStudent.section}`,
        amount: amt,
        method: payMethod,
        feeHeads: feeHeadLabels.join(", "),
      },
      ...prev,
    ]);

    setAmount("");
    setTendered("");
    setCheckedFeeHeads(["tuition"]);
    setNotes("");
    setEftposState("idle");
    toast.success(`Payment of ${fmt(amt)} processed — ${rcptNo}`);
  }

  function printReceipt() {
    if (!receiptData) return;
    const {
      rcptNo,
      student,
      feeHeads,
      amount: amt,
      method,
      change,
    } = receiptData;
    const newWin = window.open("", "_blank", "width=400,height=600");
    if (!newWin) return;
    newWin.document.write(`<!DOCTYPE html><html><head><title>Receipt</title><style>
      body{font-family:Arial,sans-serif;padding:24px;font-size:13px}
      h2{text-align:center;margin:0}p{margin:4px 0}.divider{border-top:1px dashed #999;margin:8px 0}
      .row{display:flex;justify-content:space-between}.total{font-weight:bold;font-size:15px}
    </style></head><body>
      <h2>SmartSkale School</h2><p style="text-align:center;color:#666">Estd. 2001 | CBSE Affiliated</p>
      <div class="divider"></div>
      <h3 style="text-align:center;letter-spacing:2px">RECEIPT</h3>
      <div class="divider"></div>
      <p><b>Receipt No:</b> ${rcptNo}</p>
      <p><b>Date:</b> ${todayStr()}</p>
      <p><b>Student:</b> ${student.name}</p>
      <p><b>Admission No:</b> ${student.admissionNo}</p>
      <p><b>Class:</b> ${student.className}-${student.section}</p>
      <div class="divider"></div>
      <p><b>Fee Heads:</b></p>
      ${feeHeads.map((h) => `<p style="padding-left:12px">• ${h}</p>`).join("")}
      <div class="divider"></div>
      <div class="row total"><span>Amount Paid</span><span>${fmt(amt)}</span></div>
      <p><b>Payment Method:</b> ${method}</p>
      ${change > 0 ? `<p><b>Change Given:</b> ${fmt(change)}</p>` : ""}
      <p><b>Outstanding Balance:</b> ${fmt(Math.max(0, student.feeDue - amt))}</p>
      <div class="divider"></div>
      <p style="text-align:center;font-size:11px;color:#888">This is a computer-generated receipt.<br>No signature required.</p>
    </body></html>`);
    newWin.document.close();
    newWin.print();
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cash Desk</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Multi-method payment collection — Cash, Cheque, Money Order, EFTPOS
        </p>
      </div>

      {/* POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT — Student Search */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Student Search</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-2.5 text-muted-foreground"
              />
              <Input
                className="pl-8 h-8 text-sm"
                placeholder="Name or admission no..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                data-ocid="cashdesk-search"
              />
            </div>
            {studentSearch && filteredStudents.length > 0 && (
              <div className="border rounded max-h-40 overflow-y-auto">
                {filteredStudents.map((s) => (
                  <div
                    key={s.id}
                    className={`px-3 py-2 text-xs cursor-pointer hover:bg-muted transition-colors ${selectedStudent?.id === s.id ? "bg-primary/10" : ""}`}
                    onClick={() => {
                      setSelectedStudent(s);
                      setStudentSearch("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedStudent(s);
                        setStudentSearch("");
                      }
                    }}
                    data-ocid={`cashdesk-student-${s.id}`}
                  >
                    <div className="font-medium">{s.name}</div>
                    <div className="text-muted-foreground">
                      {s.className}-{s.section} · {s.admissionNo}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {selectedStudent ? (
              <div className="bg-primary/5 border border-primary/20 rounded p-3 space-y-1.5 text-sm">
                <div className="font-bold text-base">
                  {selectedStudent.name}
                </div>
                <div className="text-muted-foreground">
                  {selectedStudent.className}-{selectedStudent.section} ·{" "}
                  {selectedStudent.admissionNo}
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-muted-foreground text-xs">
                    Outstanding Balance
                  </span>
                  <span className="font-bold text-destructive">
                    {fmt(selectedStudent.feeDue)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-7 text-xs mt-1"
                  onClick={() => setSelectedStudent(null)}
                >
                  Clear Selection
                </Button>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground text-sm">
                Search for a student to begin
              </div>
            )}
          </CardContent>
        </Card>

        {/* CENTER — Payment Entry */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Payment Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs">Amount (₹)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="mt-1 text-xl font-bold h-12"
                data-ocid="cashdesk-amount"
              />
            </div>

            <div>
              <Label className="text-xs">Fee Heads</Label>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {FEE_HEADS.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/50"
                  >
                    <Checkbox
                      id={`fh-${f.id}`}
                      checked={checkedFeeHeads.includes(f.id)}
                      onCheckedChange={() => toggleFeeHead(f.id)}
                      data-ocid={`feehead-${f.id}`}
                    />
                    <label
                      htmlFor={`fh-${f.id}`}
                      className="text-xs cursor-pointer"
                    >
                      {f.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment method tabs */}
            <div>
              <Label className="text-xs">Payment Method</Label>
              <div className="flex gap-1 mt-1 flex-wrap">
                {(
                  ["Cash", "Cheque", "Money Order", "EFTPOS"] as PaymentMethod[]
                ).map((m) => (
                  <Button
                    key={m}
                    size="sm"
                    variant={payMethod === m ? "default" : "outline"}
                    className="h-7 text-xs"
                    onClick={() => {
                      setPayMethod(m);
                      setEftposState("idle");
                    }}
                    data-ocid={`method-${m.toLowerCase().replace(" ", "-")}`}
                  >
                    {m}
                  </Button>
                ))}
              </div>
            </div>

            {payMethod === "Cash" && (
              <div>
                <Label className="text-xs">Amount Tendered (₹)</Label>
                <Input
                  type="number"
                  value={tendered}
                  onChange={(e) => setTendered(e.target.value)}
                  placeholder="0"
                  className="mt-1 h-8"
                  data-ocid="tendered-amount"
                />
                {tendered && (
                  <div className="mt-2 flex justify-between bg-muted/40 rounded p-2 text-sm">
                    <span>Change Due</span>
                    <span className="font-bold text-green-600">
                      {fmt(changeDue)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {payMethod === "Cheque" && (
              <div className="space-y-2">
                <Input
                  placeholder="Cheque No"
                  value={chequeNo}
                  onChange={(e) => setChequeNo(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="cheque-no"
                />
                <Input
                  placeholder="Bank Name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="bank-name"
                />
                <Input
                  type="date"
                  value={chequeDate}
                  onChange={(e) => setChequeDate(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="cheque-date"
                />
              </div>
            )}

            {payMethod === "Money Order" && (
              <div className="space-y-2">
                <Input
                  placeholder="MO Number"
                  value={moNo}
                  onChange={(e) => setMoNo(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="mo-number"
                />
                <Input
                  placeholder="Issuing Bank"
                  value={issuingBank}
                  onChange={(e) => setIssuingBank(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="issuing-bank"
                />
              </div>
            )}

            {payMethod === "EFTPOS" && (
              <div className="border-2 border-dashed rounded-lg p-4 text-center space-y-2">
                <CreditCard
                  size={32}
                  className="mx-auto text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">EFTPOS Terminal</p>
                {eftposState === "idle" && (
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={startEftpos}
                    data-ocid="eftpos-tap-btn"
                  >
                    Tap / Insert Card
                  </Button>
                )}
                {eftposState === "processing" && (
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                )}
                {eftposState === "success" && (
                  <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle size={18} /> Payment Approved
                  </div>
                )}
                {eftposState === "declined" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-red-600 text-sm font-medium">
                      <XCircle size={18} /> Card Declined
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => setEftposState("idle")}
                      data-ocid="eftpos-retry-btn"
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            )}

            <Textarea
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-sm h-16"
              data-ocid="cashdesk-notes"
            />

            <Button
              className="w-full"
              onClick={processPayment}
              disabled={!selectedStudent}
              data-ocid="cashdesk-process-btn"
            >
              Process Payment
            </Button>
          </CardContent>
        </Card>

        {/* RIGHT — Receipt Preview */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Receipt Preview</CardTitle>
            {receiptData && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1"
                onClick={printReceipt}
                data-ocid="print-receipt-btn"
              >
                <Printer size={13} /> Print
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {receiptData ? (
              <div className="border rounded-lg p-4 space-y-2 text-sm font-mono">
                <div className="text-center font-sans">
                  <div className="font-bold">SmartSkale School</div>
                  <div className="text-xs text-muted-foreground">
                    CBSE Affiliated
                  </div>
                </div>
                <div className="border-t border-dashed" />
                <div className="text-center font-bold tracking-widest font-sans">
                  RECEIPT
                </div>
                <div className="border-t border-dashed" />
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Receipt No</span>
                    <span>{receiptData.rcptNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date</span>
                    <span>{todayStr()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Student</span>
                    <span>{receiptData.student.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Class</span>
                    <span>
                      {receiptData.student.className}-
                      {receiptData.student.section}
                    </span>
                  </div>
                </div>
                <div className="border-t border-dashed" />
                <div className="text-xs">
                  <div className="font-medium mb-1">Fee Heads:</div>
                  {receiptData.feeHeads.map((h) => (
                    <div key={h} className="pl-2">
                      • {h}
                    </div>
                  ))}
                </div>
                <div className="border-t border-dashed" />
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span>Amount Paid</span>
                    <span>{fmt(receiptData.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Method</span>
                    <span>{receiptData.method}</span>
                  </div>
                  {receiptData.change > 0 && (
                    <div className="flex justify-between">
                      <span>Change Given</span>
                      <span>{fmt(receiptData.change)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Balance After</span>
                    <span>
                      {fmt(
                        Math.max(
                          0,
                          receiptData.student.feeDue - receiptData.amount,
                        ),
                      )}
                    </span>
                  </div>
                </div>
                <div className="border-t border-dashed" />
                <div className="text-center text-xs text-muted-foreground font-sans">
                  Auto-generated receipt
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground text-sm space-y-2">
                <CreditCard size={32} className="mx-auto opacity-30" />
                <p>Select a student and enter amount to see receipt preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transaction Log */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm">
            Today's Cash Desk Transactions
            <Badge variant="outline" className="ml-2 text-xs">
              Total: {fmt(txnLog.reduce((s, t) => s + t.amount, 0))}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Receipt No</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Fee Heads</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {txnLog.map((t, i) => (
                <TableRow
                  key={`${t.rcpt}-${i}`}
                  data-ocid={`cashdesk-log-${t.rcpt}`}
                >
                  <TableCell className="text-sm">{t.time}</TableCell>
                  <TableCell className="font-mono text-xs">{t.rcpt}</TableCell>
                  <TableCell className="font-medium text-sm">
                    {t.student}
                  </TableCell>
                  <TableCell className="text-sm">{t.cls}</TableCell>
                  <TableCell className="text-right font-medium">
                    {fmt(t.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {t.method}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {t.feeHeads}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
