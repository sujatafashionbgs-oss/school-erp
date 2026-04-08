import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Download,
  FileText,
  IndianRupee,
  Printer,
  Users,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

// ─── Number to words ─────────────────────────────────────────────────────────
function numberToWords(n: number): string {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  if (n === 0) return "Zero";
  if (n < 20) return ones[n];
  if (n < 100)
    return `${tens[Math.floor(n / 10)]}${n % 10 ? ` ${ones[n % 10]}` : ""}`;
  if (n < 1000)
    return `${ones[Math.floor(n / 100)]} Hundred${n % 100 ? ` ${numberToWords(n % 100)}` : ""}`;
  if (n < 100000)
    return `${numberToWords(Math.floor(n / 1000))} Thousand${n % 1000 ? ` ${numberToWords(n % 1000)}` : ""}`;
  return `${numberToWords(Math.floor(n / 100000))} Lakh${n % 100000 ? ` ${numberToWords(n % 100000)}` : ""}`;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const ACADEMIC_MONTHS = [
  "April 2024",
  "May 2024",
  "June 2024",
  "July 2024",
  "August 2024",
  "September 2024",
  "October 2024",
  "November 2024",
  "December 2024",
  "January 2025",
  "February 2025",
  "March 2025",
];

const BASE_PAYSLIPS = [
  {
    id: "p1",
    name: "Dr. Anand Kumar",
    designation: "Principal",
    department: "Administration",
    empId: "EMP-001",
    bankAcc: "XXXX XXXX 3421",
    basic: 55000,
    hra: 22000,
    da: 5500,
    transport: 2000,
    special: 3000,
    esi: false,
    tds: 4200,
    pt: 200,
    status: "Paid" as const,
  },
  {
    id: "p2",
    name: "Mrs. Priya Sharma",
    designation: "Senior Teacher",
    department: "Mathematics",
    empId: "EMP-002",
    bankAcc: "XXXX XXXX 7812",
    basic: 38000,
    hra: 15200,
    da: 3800,
    transport: 1600,
    special: 2000,
    esi: false,
    tds: 2400,
    pt: 200,
    status: "Paid" as const,
  },
  {
    id: "p3",
    name: "Mr. Rajesh Verma",
    designation: "Teacher",
    department: "Science",
    empId: "EMP-003",
    bankAcc: "XXXX XXXX 5567",
    basic: 28000,
    hra: 11200,
    da: 2800,
    transport: 1200,
    special: 1500,
    esi: true,
    tds: 1200,
    pt: 200,
    status: "Paid" as const,
  },
  {
    id: "p4",
    name: "Ms. Sunita Jha",
    designation: "Teacher",
    department: "Hindi",
    empId: "EMP-004",
    bankAcc: "XXXX XXXX 9034",
    basic: 26000,
    hra: 10400,
    da: 2600,
    transport: 1200,
    special: 1200,
    esi: true,
    tds: 900,
    pt: 200,
    status: "Paid" as const,
  },
  {
    id: "p5",
    name: "Mr. Deepak Singh",
    designation: "Lab Assistant",
    department: "Science",
    empId: "EMP-005",
    bankAcc: "XXXX XXXX 1122",
    basic: 18000,
    hra: 7200,
    da: 1800,
    transport: 1000,
    special: 800,
    esi: true,
    tds: 0,
    pt: 200,
    status: "Paid" as const,
  },
  {
    id: "p6",
    name: "Mrs. Kavita Rai",
    designation: "Librarian",
    department: "Library",
    empId: "EMP-006",
    bankAcc: "XXXX XXXX 4456",
    basic: 22000,
    hra: 8800,
    da: 2200,
    transport: 1000,
    special: 1000,
    esi: true,
    tds: 200,
    pt: 200,
    status: "Paid" as const,
  },
  {
    id: "p7",
    name: "Mr. Suresh Yadav",
    designation: "Accountant",
    department: "Accounts",
    empId: "EMP-007",
    bankAcc: "XXXX XXXX 6678",
    basic: 30000,
    hra: 12000,
    da: 3000,
    transport: 1200,
    special: 1500,
    esi: false,
    tds: 1800,
    pt: 200,
    status: "Pending" as const,
  },
  {
    id: "p8",
    name: "Ms. Renu Mishra",
    designation: "Clerk",
    department: "Administration",
    empId: "EMP-008",
    bankAcc: "XXXX XXXX 2290",
    basic: 15000,
    hra: 6000,
    da: 1500,
    transport: 800,
    special: 700,
    esi: true,
    tds: 0,
    pt: 200,
    status: "Pending" as const,
  },
];

type Payslip = (typeof BASE_PAYSLIPS)[0];

function computeSalary(p: Payslip) {
  const grossPay = p.basic + p.hra + p.da + p.transport + p.special;
  const pf = Math.round(p.basic * 0.12);
  const esi = p.esi ? Math.round(grossPay * 0.0175) : 0;
  const totalDeductions = pf + esi + p.tds + p.pt;
  const netPay = grossPay - totalDeductions;
  return { grossPay, pf, esi, totalDeductions, netPay };
}

// ─── Salary Slip Dialog ───────────────────────────────────────────────────────
function SalarySlipDialog({
  slip,
  month,
  open,
  onClose,
}: {
  slip: Payslip | null;
  month: string;
  open: boolean;
  onClose: () => void;
}) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!slip) return null;
  const { grossPay, pf, esi, totalDeductions, netPay } = computeSalary(slip);

  const handlePrint = () => {
    const content = printRef.current?.innerHTML ?? "";
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>Salary Slip - ${slip.name}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 12px; padding: 20px; color: #000; }
        h1 { font-size: 18px; margin: 0; }
        h2 { font-size: 14px; margin: 4px 0 0; letter-spacing: 4px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
        th { background: #f3f4f6; font-weight: 600; }
        .net-pay { font-size: 20px; font-weight: 800; }
        .header-bar { background: #1e40af; color: white; padding: 16px 20px; border-radius: 8px 8px 0 0; }
        .seal { border: 2px dashed #ccc; border-radius: 50%; width: 72px; height: 72px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #999; }
        @media print { body { padding: 0; } }
      </style></head><body>${content}</body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const schoolName = (() => {
    try {
      return (
        localStorage.getItem("erp_settings_schoolName") ||
        "SmartSkale Public School"
      );
    } catch {
      return "SmartSkale Public School";
    }
  })();
  const schoolAddress = (() => {
    try {
      return (
        localStorage.getItem("erp_settings_address") ||
        "Gandhi Nagar, Patna, Bihar - 800001"
      );
    } catch {
      return "Gandhi Nagar, Patna, Bihar - 800001";
    }
  })();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Salary Slip — {slip.name} ({month})
          </DialogTitle>
        </DialogHeader>

        {/* Action buttons */}
        <div className="flex gap-2 mb-4">
          <Button
            size="sm"
            onClick={handlePrint}
            data-ocid="salary_slip.print.button"
          >
            <Printer size={14} className="mr-1" /> Print
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info("PDF download feature coming soon")}
            data-ocid="salary_slip.download_pdf.button"
          >
            <Download size={14} className="mr-1" /> Download PDF
          </Button>
        </div>

        {/* Printable Slip */}
        <div
          ref={printRef}
          className="border border-border rounded-xl overflow-hidden text-sm"
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-xl font-bold shrink-0">
              {schoolName.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold">{schoolName}</p>
              <p className="text-xs opacity-80">{schoolAddress}</p>
            </div>
            <div className="text-right">
              <p className="text-xs tracking-widest font-semibold uppercase opacity-90">
                SALARY SLIP
              </p>
              <p className="text-sm font-bold mt-0.5">{month}</p>
            </div>
          </div>

          <div className="p-5 space-y-5 bg-background">
            {/* Employee Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-muted/40 rounded-lg text-xs">
              <div>
                <span className="text-muted-foreground">Employee Name</span>
                <p className="font-semibold text-foreground mt-0.5">
                  {slip.name}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Designation</span>
                <p className="font-semibold text-foreground mt-0.5">
                  {slip.designation}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Department</span>
                <p className="font-semibold text-foreground mt-0.5">
                  {slip.department}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Employee ID</span>
                <p className="font-semibold text-foreground mt-0.5">
                  {slip.empId}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Bank Account</span>
                <p className="font-semibold text-foreground mt-0.5">
                  {slip.bankAcc}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Pay Period</span>
                <p className="font-semibold text-foreground mt-0.5">{month}</p>
              </div>
            </div>

            {/* Earnings & Deductions side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Earnings */}
              <div>
                <p className="font-semibold text-foreground mb-2">Earnings</p>
                <table className="w-full text-xs border border-border rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-green-500/10">
                      <th className="p-2 text-left font-medium">Component</th>
                      <th className="p-2 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "Basic Salary", amt: slip.basic },
                      { label: "HRA", amt: slip.hra },
                      { label: "DA", amt: slip.da },
                      { label: "Transport Allowance", amt: slip.transport },
                      { label: "Special Allowance", amt: slip.special },
                    ].map((row) => (
                      <tr key={row.label} className="border-t border-border">
                        <td className="p-2 text-foreground">{row.label}</td>
                        <td className="p-2 text-right text-foreground">
                          ₹{row.amt.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-green-500 bg-green-500/5 font-semibold">
                      <td className="p-2 text-foreground">Gross Pay</td>
                      <td className="p-2 text-right text-green-700 dark:text-green-400">
                        ₹{grossPay.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Deductions */}
              <div>
                <p className="font-semibold text-foreground mb-2">Deductions</p>
                <table className="w-full text-xs border border-border rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-red-500/10">
                      <th className="p-2 text-left font-medium">Component</th>
                      <th className="p-2 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "PF (12%)", amt: pf },
                      ...(esi > 0 ? [{ label: "ESI (1.75%)", amt: esi }] : []),
                      { label: "TDS", amt: slip.tds },
                      { label: "Professional Tax", amt: slip.pt },
                    ].map((row) => (
                      <tr key={row.label} className="border-t border-border">
                        <td className="p-2 text-foreground">{row.label}</td>
                        <td className="p-2 text-right text-foreground">
                          ₹{row.amt.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-red-500 bg-red-500/5 font-semibold">
                      <td className="p-2 text-foreground">Total Deductions</td>
                      <td className="p-2 text-right text-red-600 dark:text-red-400">
                        ₹{totalDeductions.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Net Pay */}
            <div className="bg-primary/5 border border-primary/30 rounded-xl p-4 text-center space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                Net Pay
              </p>
              <p className="text-3xl font-extrabold text-primary">
                ₹{netPay.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground italic">
                Rupees {numberToWords(netPay)} Only
              </p>
            </div>

            {/* Seal + Signatory */}
            <div className="flex items-end justify-between pt-2">
              <div className="flex flex-col items-center gap-1">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-border flex items-center justify-center">
                  <span className="text-xs text-muted-foreground text-center leading-tight px-1">
                    School Seal
                  </span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="border-t border-foreground/40 pt-1 w-40">
                  <p className="text-xs text-muted-foreground">
                    Authorized Signatory
                  </p>
                  <p className="text-xs font-medium text-foreground">
                    Principal / HR Manager
                  </p>
                  <p className="text-xs text-muted-foreground">{schoolName}</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground border-t border-border pt-3">
              This is a computer-generated salary slip and does not require a
              physical signature.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function SalaryPage() {
  const [selectedMonth, setSelectedMonth] = useState("November 2024");
  const [slipOpen, setSlipOpen] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState<Payslip | null>(null);

  const payslips = BASE_PAYSLIPS.map((p) => ({ ...p, month: selectedMonth }));

  const totalPayroll = payslips.reduce(
    (s, p) => s + computeSalary(p).netPay,
    0,
  );
  const paid = payslips.filter((p) => p.status === "Paid").length;
  const pending = payslips.filter((p) => p.status === "Pending").length;

  const handleOpenSlip = (p: Payslip) => {
    setSelectedSlip(p);
    setSlipOpen(true);
  };

  const handleGenerateAll = () =>
    toast.success(`All payslips for ${selectedMonth} generated and sent`);

  return (
    <div className="space-y-6" data-ocid="salary.page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Salary & Payslips
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {selectedMonth} payroll summary
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48" data-ocid="salary.month.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACADEMIC_MONTHS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleGenerateAll} data-ocid="salary.primary_button">
            <FileText className="w-4 h-4 mr-2" />
            Generate All Payslips
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Payroll",
            value: `₹${(totalPayroll / 1000).toFixed(0)}K`,
            icon: IndianRupee,
            color: "text-blue-500",
          },
          { label: "Paid", value: paid, icon: Users, color: "text-green-500" },
          {
            label: "Pending",
            value: pending,
            icon: Clock,
            color: "text-orange-500",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="p-2 rounded-xl bg-muted">
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="bg-muted/50">
              {[
                "Staff Name",
                "Designation",
                "Month",
                "Basic",
                "HRA",
                "Gross Pay",
                "Deductions",
                "Net Pay",
                "Status",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-muted-foreground font-medium whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payslips.map((p, idx) => {
              const { grossPay, totalDeductions, netPay } = computeSalary(p);
              return (
                <tr
                  key={p.id}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                  data-ocid={`salary.item.${idx + 1}`}
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.designation}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {selectedMonth}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    ₹{p.basic.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    ₹{p.hra.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-green-600 font-medium">
                    ₹{grossPay.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-red-500">
                    -₹{totalDeductions.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-semibold text-foreground">
                    ₹{netPay.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={p.status === "Paid" ? "default" : "secondary"}
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenSlip(p)}
                      data-ocid={`salary.generate_slip.${idx + 1}`}
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      Generate Slip
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Salary Slip Dialog */}
      <SalarySlipDialog
        slip={selectedSlip}
        month={selectedMonth}
        open={slipOpen}
        onClose={() => setSlipOpen(false)}
      />
    </div>
  );
}
