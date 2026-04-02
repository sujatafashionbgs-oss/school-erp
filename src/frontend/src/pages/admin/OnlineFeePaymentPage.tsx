import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  Clock,
  Copy,
  Download,
  IndianRupee,
  QrCode,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const mockOutstanding = [
  {
    id: "1",
    name: "Aarav Sharma",
    cls: "X-A",
    admNo: "2024-1001",
    feeType: "Tuition + Transport",
    amount: 12500,
    dueDate: "2026-03-31",
    status: "Overdue",
  },
  {
    id: "2",
    name: "Priya Verma",
    cls: "IX-B",
    admNo: "2024-1002",
    feeType: "Tuition",
    amount: 9800,
    dueDate: "2026-04-15",
    status: "Pending",
  },
  {
    id: "3",
    name: "Rohan Kumar",
    cls: "VIII-A",
    admNo: "2024-1003",
    feeType: "Tuition + Library",
    amount: 8600,
    dueDate: "2026-04-30",
    status: "Pending",
  },
  {
    id: "4",
    name: "Sneha Patel",
    cls: "VII-C",
    admNo: "2024-1004",
    feeType: "Tuition + Sports",
    amount: 7200,
    dueDate: "2026-03-25",
    status: "Overdue",
  },
  {
    id: "5",
    name: "Arjun Singh",
    cls: "XI-A",
    admNo: "2024-1005",
    feeType: "Tuition",
    amount: 14000,
    dueDate: "2026-04-10",
    status: "Pending",
  },
  {
    id: "6",
    name: "Meera Joshi",
    cls: "VI-B",
    admNo: "2024-1006",
    feeType: "Tuition + Transport",
    amount: 6900,
    dueDate: "2026-04-20",
    status: "Paid",
  },
  {
    id: "7",
    name: "Kabir Nair",
    cls: "XII-B",
    admNo: "2024-1007",
    feeType: "Tuition + Exam",
    amount: 15500,
    dueDate: "2026-04-05",
    status: "Overdue",
  },
  {
    id: "8",
    name: "Tanvi Gupta",
    cls: "V-A",
    admNo: "2024-1008",
    feeType: "Tuition",
    amount: 5800,
    dueDate: "2026-04-25",
    status: "Pending",
  },
  {
    id: "9",
    name: "Dev Mehta",
    cls: "X-B",
    admNo: "2024-1009",
    feeType: "Tuition + Library",
    amount: 11200,
    dueDate: "2026-03-28",
    status: "Overdue",
  },
  {
    id: "10",
    name: "Ananya Roy",
    cls: "IX-A",
    admNo: "2024-1010",
    feeType: "Tuition + Sports",
    amount: 10400,
    dueDate: "2026-04-18",
    status: "Paid",
  },
];

const mockTransactions = [
  {
    id: "TXN001",
    student: "Aarav Sharma",
    amount: 12500,
    mode: "UPI",
    date: "2026-03-15",
    status: "Success",
  },
  {
    id: "TXN002",
    student: "Meera Joshi",
    amount: 6900,
    mode: "Card",
    date: "2026-03-14",
    status: "Success",
  },
  {
    id: "TXN003",
    student: "Kabir Nair",
    amount: 15500,
    mode: "NetBanking",
    date: "2026-03-13",
    status: "Pending",
  },
  {
    id: "TXN004",
    student: "Ananya Roy",
    amount: 10400,
    mode: "UPI",
    date: "2026-03-12",
    status: "Success",
  },
  {
    id: "TXN005",
    student: "Priya Verma",
    amount: 9800,
    mode: "Card",
    date: "2026-03-11",
    status: "Failed",
  },
  {
    id: "TXN006",
    student: "Rohan Kumar",
    amount: 8600,
    mode: "UPI",
    date: "2026-03-10",
    status: "Success",
  },
  {
    id: "TXN007",
    student: "Dev Mehta",
    amount: 11200,
    mode: "NetBanking",
    date: "2026-03-09",
    status: "Pending",
  },
  {
    id: "TXN008",
    student: "Sneha Patel",
    amount: 7200,
    mode: "Card",
    date: "2026-03-08",
    status: "Failed",
  },
  {
    id: "TXN009",
    student: "Arjun Singh",
    amount: 14000,
    mode: "UPI",
    date: "2026-03-07",
    status: "Success",
  },
  {
    id: "TXN010",
    student: "Tanvi Gupta",
    amount: 5800,
    mode: "UPI",
    date: "2026-03-06",
    status: "Success",
  },
  {
    id: "TXN011",
    student: "Aarav Sharma",
    amount: 3500,
    mode: "Card",
    date: "2026-03-05",
    status: "Success",
  },
  {
    id: "TXN012",
    student: "Meera Joshi",
    amount: 2200,
    mode: "NetBanking",
    date: "2026-03-04",
    status: "Failed",
  },
  {
    id: "TXN013",
    student: "Kabir Nair",
    amount: 6000,
    mode: "UPI",
    date: "2026-03-03",
    status: "Success",
  },
  {
    id: "TXN014",
    student: "Priya Verma",
    amount: 4900,
    mode: "Card",
    date: "2026-03-02",
    status: "Pending",
  },
  {
    id: "TXN015",
    student: "Rohan Kumar",
    amount: 8600,
    mode: "UPI",
    date: "2026-03-01",
    status: "Success",
  },
];

export function OnlineFeePaymentPage() {
  const [search, setSearch] = useState("");
  const [gateway, setGateway] = useState("razorpay");
  const [qrStudent, setQrStudent] = useState<string | null>(null);
  const [txnTab, setTxnTab] = useState("all");

  const filtered = mockOutstanding.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admNo.includes(search),
  );

  const filteredTxn = mockTransactions.filter((t) => {
    if (txnTab === "all") return true;
    return t.status.toLowerCase() === txnTab;
  });

  const statusBadge = (s: string) => {
    if (s === "Paid")
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
          Paid
        </Badge>
      );
    if (s === "Overdue")
      return (
        <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
          Overdue
        </Badge>
      );
    return (
      <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
        Pending
      </Badge>
    );
  };

  const txnBadge = (s: string) => {
    if (s === "Success")
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 gap-1">
          <CheckCircle size={11} />
          Success
        </Badge>
      );
    if (s === "Failed")
      return (
        <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 gap-1">
          <XCircle size={11} />
          Failed
        </Badge>
      );
    return (
      <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 gap-1">
        <Clock size={11} />
        Pending
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Online Fee Payment Portal</h1>
          <p className="text-muted-foreground text-sm">
            Manage student fee payments, generate links and QR codes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Gateway:</span>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="gateway"
              value="razorpay"
              checked={gateway === "razorpay"}
              onChange={() => setGateway("razorpay")}
            />
            <span className="text-sm font-semibold text-blue-600">
              Razorpay
            </span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="gateway"
              value="payu"
              checked={gateway === "payu"}
              onChange={() => setGateway("payu")}
            />
            <span className="text-sm font-semibold text-orange-600">PayU</span>
          </label>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Outstanding",
            value: "₹4,82,000",
            icon: <IndianRupee size={18} />,
            color: "text-red-500",
          },
          {
            label: "Collected Today",
            value: "₹23,400",
            icon: <CheckCircle size={18} />,
            color: "text-green-500",
          },
          {
            label: "Pending Students",
            value: "89",
            icon: <Users size={18} />,
            color: "text-yellow-500",
          },
          {
            label: "Success Rate",
            value: "91%",
            icon: <CheckCircle size={18} />,
            color: "text-blue-500",
          },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Outstanding table */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-muted-foreground" />
            <Input
              placeholder="Search by student name or admission number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
              data-ocid="fee_payment.search_input"
            />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Adm. No</TableHead>
                  <TableHead>Fee Type</TableHead>
                  <TableHead>Amount Due</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>{row.cls}</TableCell>
                    <TableCell>{row.admNo}</TableCell>
                    <TableCell>{row.feeType}</TableCell>
                    <TableCell>₹{row.amount.toLocaleString()}</TableCell>
                    <TableCell>{row.dueDate}</TableCell>
                    <TableCell>{statusBadge(row.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          data-ocid="fee_payment.copy_link.button"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `https://pay.school.edu/fee?student=${row.admNo}`,
                            );
                            toast.success(
                              `Payment link copied for ${row.name}`,
                            );
                          }}
                        >
                          <Copy size={12} className="mr-1" /> Link
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          data-ocid="fee_payment.qr.button"
                          onClick={() => setQrStudent(row.name)}
                        >
                          <QrCode size={12} className="mr-1" /> QR
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="font-semibold">Payment History</h2>
          <Tabs value={txnTab} onValueChange={setTxnTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="success">Success</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>
            <TabsContent value={txnTab} className="mt-3">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTxn.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-mono text-xs">
                          {t.id}
                        </TableCell>
                        <TableCell>{t.student}</TableCell>
                        <TableCell>₹{t.amount.toLocaleString()}</TableCell>
                        <TableCell>{t.mode}</TableCell>
                        <TableCell>{t.date}</TableCell>
                        <TableCell>{txnBadge(t.status)}</TableCell>
                        <TableCell>
                          {t.status === "Success" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs"
                              data-ocid="fee_payment.receipt.button"
                              onClick={() =>
                                toast.success("Generating receipt...")
                              }
                            >
                              <Download size={12} className="mr-1" /> Receipt
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* QR Dialog */}
      <Dialog open={!!qrStudent} onOpenChange={() => setQrStudent(null)}>
        <DialogContent data-ocid="fee_payment.qr.dialog">
          <DialogHeader>
            <DialogTitle>Payment QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-48 h-48 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-xl flex items-center justify-center border-4 border-blue-300 dark:border-blue-600">
              <div className="text-center">
                <QrCode
                  size={48}
                  className="mx-auto text-blue-600 dark:text-blue-400"
                />
                <p className="text-xs font-medium mt-2 text-blue-700 dark:text-blue-300">
                  QR Code for
                </p>
                <p className="text-sm font-bold text-blue-800 dark:text-blue-200">
                  {qrStudent}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Scan this QR to pay fees via UPI or any payment app
            </p>
            <Button
              onClick={() => toast.success("QR Code downloaded")}
              data-ocid="fee_payment.download_qr.button"
            >
              <Download size={14} className="mr-2" /> Download QR
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
