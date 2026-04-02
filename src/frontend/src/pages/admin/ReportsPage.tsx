import { ExportButtons } from "@/components/ExportButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockStaff } from "@/data/mockStaff";
import { mockStudents } from "@/data/mockStudents";
import {
  BarChart2,
  Bus,
  CalendarDays,
  GraduationCap,
  IndianRupee,
  Receipt,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

function seedRand(str: string, i: number, date = ""): number {
  let h = 0;
  for (const c of str + i + date) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

const PAY_MODES = ["Cash", "Online", "Cheque", "UPI"];
const FEE_NAMES = [
  "Aarav Sharma",
  "Priya Patel",
  "Rohit Kumar",
  "Ananya Singh",
  "Kabir Mehta",
  "Sneha Rao",
  "Dev Gupta",
  "Meera Nair",
];
const FEE_CLASSES = [
  "VI-A",
  "VII-B",
  "VIII-C",
  "IX-A",
  "X-B",
  "XI-A",
  "XII-B",
  "V-C",
];
const EXPENSE_CATS = [
  "Stationery",
  "Maintenance",
  "Utilities",
  "Salaries",
  "Events",
  "Transport",
];
const EXPENSE_DESC = [
  "Notebooks and pens for library",
  "AC repair in admin block",
  "Electricity bill payment",
  "Part salary advance - staff",
  "Annual day decoration",
  "Bus fuel reimbursement",
];
const EXPENSE_BY = [
  "Raju Sharma",
  "Admin Office",
  "Accounts Dept",
  "Principal",
  "Event Team",
  "Transport Mgr",
];
const MONTHS = [
  "April 2026",
  "May 2026",
  "June 2026",
  "July 2026",
  "August 2026",
  "September 2026",
  "October 2026",
  "November 2026",
  "December 2026",
  "January 2027",
  "February 2027",
  "March 2027",
];
const CLASSES_LIST = ["V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

function genDailyFeeRows(date: string) {
  return Array.from({ length: 8 }, (_, i) => ({
    "Student Name": FEE_NAMES[i],
    Class: FEE_CLASSES[i],
    Amount: (seedRand(date, i, date) % 8000) + 2000,
    "Payment Mode": PAY_MODES[seedRand(date, i + 10, date) % 4],
    "Receipt No": `RCT-${date.replace(/-/g, "")}-${(seedRand(date, i, date) % 900) + 100}`,
  }));
}

function genDailyExpenseRows(date: string) {
  return Array.from({ length: 6 }, (_, i) => ({
    Category: EXPENSE_CATS[i],
    Amount: (seedRand(date, i + 20, date) % 15000) + 500,
    Description: EXPENSE_DESC[i],
    "Entered By": EXPENSE_BY[i],
  }));
}

interface SectionProps {
  title: string;
  exportTitle: string;
  exportData: Record<string, unknown>[];
  controls?: React.ReactNode;
  children: React.ReactNode;
}

function ReportSection({
  title,
  exportTitle,
  exportData,
  controls,
  children,
}: SectionProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-semibold text-foreground text-base">{title}</h3>
          {controls}
        </div>
        <ExportButtons title={exportTitle} data={exportData} />
      </div>
      {children}
    </div>
  );
}

interface DataTableProps {
  headers: string[];
  rows: (string | number | React.ReactNode)[][];
}

function DataTable({ headers, rows }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/30">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-3 py-2 font-medium text-muted-foreground text-xs uppercase tracking-wide whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const rowKey =
              row
                .map((c) =>
                  typeof c === "string" || typeof c === "number"
                    ? String(c).slice(0, 8)
                    : "",
                )
                .join("-") || String(idx);
            return (
              <tr key={rowKey} className={idx % 2 === 0 ? "" : "bg-muted/20"}>
                {headers.map((h, ci) => (
                  <td
                    key={`${rowKey}-${h}`}
                    className="px-3 py-2 text-foreground"
                  >
                    {row[ci]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function OverviewTab() {
  const classBreakdown = CLASSES_LIST.map((c) => ({
    class: c,
    count: mockStudents.filter((s) => s.className === c).length,
  }));
  const feeStats = {
    collected: mockStudents.filter((s) => s.feeDue === 0).length,
    pending: mockStudents.filter((s) => s.feeDue > 0).length,
    totalDue: mockStudents.reduce((a, s) => a + s.feeDue, 0),
  };
  const overviewData = classBreakdown.map((c) => ({
    Class: `Class ${c.class}`,
    "Student Count": c.count,
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ExportButtons title="School_Overview" data={overviewData} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Students",
            value: mockStudents.length,
            icon: <GraduationCap size={18} />,
            color: "text-blue-600",
          },
          {
            label: "Total Staff",
            value: mockStaff.length,
            icon: <Users size={18} />,
            color: "text-purple-600",
          },
          {
            label: "Fee Cleared",
            value: feeStats.collected,
            icon: <IndianRupee size={18} />,
            color: "text-green-600",
          },
          {
            label: "Fee Pending",
            value: feeStats.pending,
            icon: <Receipt size={18} />,
            color: "text-red-500",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-1"
          >
            <div className={`${s.color} mb-1`}>{s.icon}</div>
            <div className="text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap size={16} className="text-primary" />
            <h2 className="font-semibold text-sm">Students by Class</h2>
          </div>
          <div className="space-y-2">
            {classBreakdown
              .filter((c) => c.count > 0)
              .map((c) => (
                <div key={c.class} className="flex items-center gap-3">
                  <span className="text-xs w-12 text-muted-foreground">
                    Class {c.class}
                  </span>
                  <div className="flex-1 h-2 bg-secondary rounded-full">
                    <div
                      className="h-2 bg-primary rounded-full"
                      style={{
                        width: `${(c.count / mockStudents.length) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium w-4">{c.count}</span>
                </div>
              ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 size={16} className="text-primary" />
            <h2 className="font-semibold text-sm">Fee Summary</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fees Cleared</span>
              <span className="font-semibold text-green-600">
                {feeStats.collected}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pending</span>
              <span className="font-semibold text-destructive">
                {feeStats.pending}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Due</span>
              <span className="font-semibold text-destructive">
                Rs.{feeStats.totalDue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-primary" />
            <h2 className="font-semibold text-sm">Attendance Overview</h2>
          </div>
          <div className="space-y-2">
            {classBreakdown
              .filter((c) => c.count > 0)
              .map((c) => {
                const cs = mockStudents.filter((s) => s.className === c.class);
                const avg =
                  cs.reduce((a, s) => a + s.attendance, 0) / cs.length;
                return (
                  <div key={c.class} className="flex items-center gap-3">
                    <span className="text-xs w-12 text-muted-foreground">
                      Class {c.class}
                    </span>
                    <div className="flex-1 h-2 bg-secondary rounded-full">
                      <div
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: `${avg}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium w-10">
                      {avg.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Users size={16} className="text-primary" />
          <h2 className="font-semibold text-sm">Gender Distribution</h2>
        </div>
        <div className="flex gap-8">
          {[
            {
              label: "Male",
              count: mockStudents.filter((s) => s.gender === "Male").length,
              color: "bg-blue-500",
            },
            {
              label: "Female",
              count: mockStudents.filter((s) => s.gender === "Female").length,
              color: "bg-pink-500",
            },
          ].map((g) => (
            <div key={g.label} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${g.color}`} />
              <span className="text-sm text-muted-foreground">{g.label}</span>
              <span className="text-sm font-bold text-foreground">
                {g.count}
              </span>
              <span className="text-xs text-muted-foreground">
                ({((g.count / mockStudents.length) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeeReportsTab() {
  const today = new Date().toISOString().split("T")[0];
  const [dailyDate, setDailyDate] = useState(today);
  const [summaryMonth, setSummaryMonth] = useState(MONTHS[7]);
  const [feeClassFilter, setFeeClassFilter] = useState("all");
  const dailyRows = genDailyFeeRows(dailyDate).filter((row) => {
    if (feeClassFilter === "all") return true;
    return row.Class.startsWith(feeClassFilter);
  });
  const summaryRows = CLASSES_LIST.map((c, i) => {
    const total = (seedRand(summaryMonth, i) % 50000) + 80000;
    const collected = Math.round(
      total * (0.7 + (seedRand(summaryMonth, i + 5) % 25) / 100),
    );
    return {
      Class: `Class ${c}`,
      "Total Students": (seedRand(summaryMonth, i) % 20) + 30,
      "Fees Collected": collected,
      Pending: total - collected,
      "Collection %": `${((collected / total) * 100).toFixed(1)}%`,
    };
  });
  const defaulters = [
    {
      "Student Name": "Rahul Verma",
      Class: "IX-A",
      "Admission No": "2024-0112",
      "Total Due": 18500,
      "Last Payment": "12-Oct-2025",
      "Days Overdue": 142,
    },
    {
      "Student Name": "Preethi Das",
      Class: "X-B",
      "Admission No": "2023-0478",
      "Total Due": 24200,
      "Last Payment": "05-Sep-2025",
      "Days Overdue": 179,
    },
    {
      "Student Name": "Arun Nair",
      Class: "VIII-C",
      "Admission No": "2024-0231",
      "Total Due": 9800,
      "Last Payment": "20-Nov-2025",
      "Days Overdue": 103,
    },
    {
      "Student Name": "Sana Qureshi",
      Class: "VII-A",
      "Admission No": "2025-0067",
      "Total Due": 6500,
      "Last Payment": "01-Dec-2025",
      "Days Overdue": 91,
    },
    {
      "Student Name": "Deepak Tiwari",
      Class: "XI-B",
      "Admission No": "2022-0356",
      "Total Due": 31000,
      "Last Payment": "15-Aug-2025",
      "Days Overdue": 200,
    },
    {
      "Student Name": "Kavitha Reddy",
      Class: "VI-B",
      "Admission No": "2025-0143",
      "Total Due": 7200,
      "Last Payment": "10-Oct-2025",
      "Days Overdue": 144,
    },
    {
      "Student Name": "Nikhil Joshi",
      Class: "XII-A",
      "Admission No": "2021-0089",
      "Total Due": 42000,
      "Last Payment": "22-Jul-2025",
      "Days Overdue": 224,
    },
    {
      "Student Name": "Pooja Mishra",
      Class: "V-C",
      "Admission No": "2025-0221",
      "Total Due": 5500,
      "Last Payment": "18-Nov-2025",
      "Days Overdue": 105,
    },
    {
      "Student Name": "Arjun Pillai",
      Class: "IX-C",
      "Admission No": "2024-0399",
      "Total Due": 16800,
      "Last Payment": "03-Sep-2025",
      "Days Overdue": 181,
    },
    {
      "Student Name": "Simran Kaur",
      Class: "X-A",
      "Admission No": "2023-0512",
      "Total Due": 21500,
      "Last Payment": "28-Aug-2025",
      "Days Overdue": 187,
    },
  ];
  const categoryRows = [
    {
      Category: "Tuition Fee",
      "Total Applicable": 2340,
      Collected: 1980000,
      Pending: 340200,
    },
    {
      Category: "Transport Fee",
      "Total Applicable": 890,
      Collected: 712000,
      Pending: 89000,
    },
    {
      Category: "Library Fee",
      "Total Applicable": 2340,
      Collected: 186400,
      Pending: 23400,
    },
    {
      Category: "Sports Fee",
      "Total Applicable": 2340,
      Collected: 210600,
      Pending: 37400,
    },
    {
      Category: "Lab Fee",
      "Total Applicable": 1200,
      Collected: 96000,
      Pending: 24000,
    },
  ];
  return (
    <div className="space-y-6">
      <ReportSection
        title="Daily Fee Collection"
        exportTitle="Daily_Fee_Collection"
        exportData={dailyRows as unknown as Record<string, unknown>[]}
        controls={
          <>
            <input
              type="date"
              value={dailyDate}
              onChange={(e) => setDailyDate(e.target.value)}
              className="border border-border rounded-lg px-3 py-1.5 text-sm bg-background text-foreground"
              data-ocid="reports.fee.daily_date"
            />
            <select
              value={feeClassFilter}
              onChange={(e) => {
                setFeeClassFilter(e.target.value);
              }}
              className="border border-border rounded-lg px-3 py-1.5 text-sm bg-background text-foreground"
              data-ocid="reports.fee.class_filter.select"
            >
              <option value="all">All Classes</option>
              {["V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"].map((c) => (
                <option key={c} value={c}>
                  Class {c}
                </option>
              ))}
            </select>
          </>
        }
      >
        <DataTable
          headers={[
            "Student Name",
            "Class",
            "Amount (Rs)",
            "Payment Mode",
            "Receipt No",
          ]}
          rows={dailyRows.map((r) => [
            r["Student Name"],
            r.Class,
            `Rs.${r.Amount.toLocaleString()}`,
            r["Payment Mode"],
            r["Receipt No"],
          ])}
        />
      </ReportSection>
      <ReportSection
        title="Monthly Fee Summary"
        exportTitle="Monthly_Fee_Summary"
        exportData={summaryRows as unknown as Record<string, unknown>[]}
        controls={
          <select
            value={summaryMonth}
            onChange={(e) => setSummaryMonth(e.target.value)}
            className="border border-border rounded-lg px-3 py-1.5 text-sm bg-background text-foreground"
            data-ocid="reports.fee.summary_month"
          >
            {MONTHS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        }
      >
        <DataTable
          headers={[
            "Class",
            "Total Students",
            "Fees Collected (Rs)",
            "Pending (Rs)",
            "Collection %",
          ]}
          rows={summaryRows.map((r) => [
            r.Class,
            r["Total Students"],
            `Rs.${r["Fees Collected"].toLocaleString()}`,
            `Rs.${r.Pending.toLocaleString()}`,
            r["Collection %"],
          ])}
        />
      </ReportSection>
      <ReportSection
        title="Fee Defaulters List"
        exportTitle="Fee_Defaulters"
        exportData={defaulters as unknown as Record<string, unknown>[]}
      >
        <DataTable
          headers={[
            "Student Name",
            "Class",
            "Admission No",
            "Total Due (Rs)",
            "Last Payment",
            "Days Overdue",
          ]}
          rows={defaulters.map((r) => [
            r["Student Name"],
            r.Class,
            r["Admission No"],
            `Rs.${r["Total Due"].toLocaleString()}`,
            r["Last Payment"],
            <span key={r["Admission No"]} className="text-red-500 font-medium">
              {r["Days Overdue"]} days
            </span>,
          ])}
        />
      </ReportSection>
      <ReportSection
        title="Fee Category Wise Report"
        exportTitle="Fee_Category_Report"
        exportData={categoryRows as unknown as Record<string, unknown>[]}
      >
        <DataTable
          headers={[
            "Category",
            "Total Applicable",
            "Collected (Rs)",
            "Pending (Rs)",
          ]}
          rows={categoryRows.map((r) => [
            r.Category,
            r["Total Applicable"],
            `Rs.${r.Collected.toLocaleString()}`,
            `Rs.${r.Pending.toLocaleString()}`,
          ])}
        />
      </ReportSection>
    </div>
  );
}

function ExpenseReportsTab() {
  const today = new Date().toISOString().split("T")[0];
  const [dailyDate, setDailyDate] = useState(today);
  const dailyRows = genDailyExpenseRows(dailyDate);
  const monthlyRows = MONTHS.slice(0, 8).map((m, i) => ({
    Month: m,
    "Total Expenses": (seedRand(m, i) % 80000) + 120000,
    "Top Category": EXPENSE_CATS[seedRand(m, i + 3) % 6],
    "vs Last Month":
      i === 0
        ? "N/A"
        : `${seedRand(m, i + 8) % 2 === 0 ? "+" : "-"}${(seedRand(m, i + 9) % 20) + 2}%`,
  }));
  const catAnalysis = EXPENSE_CATS.map((cat, ci) => {
    const vals = [0, 1, 2, 3].map(
      (mi) => (seedRand(cat, ci + mi * 3) % 20000) + 5000,
    );
    return {
      Category: cat,
      Apr: vals[0],
      May: vals[1],
      Jun: vals[2],
      Jul: vals[3],
      "Grand Total": vals.reduce((a, b) => a + b, 0),
    };
  });
  return (
    <div className="space-y-6">
      <ReportSection
        title="Daily Expense Report"
        exportTitle="Daily_Expense_Report"
        exportData={dailyRows as unknown as Record<string, unknown>[]}
        controls={
          <input
            type="date"
            value={dailyDate}
            onChange={(e) => setDailyDate(e.target.value)}
            className="border border-border rounded-lg px-3 py-1.5 text-sm bg-background text-foreground"
            data-ocid="reports.expense.daily_date"
          />
        }
      >
        <DataTable
          headers={["Category", "Amount (Rs)", "Description", "Entered By"]}
          rows={dailyRows.map((r) => [
            r.Category,
            `Rs.${r.Amount.toLocaleString()}`,
            r.Description,
            r["Entered By"],
          ])}
        />
      </ReportSection>
      <ReportSection
        title="Monthly Expense Summary"
        exportTitle="Monthly_Expense_Summary"
        exportData={monthlyRows as unknown as Record<string, unknown>[]}
      >
        <DataTable
          headers={[
            "Month",
            "Total Expenses (Rs)",
            "Top Category",
            "vs Last Month",
          ]}
          rows={monthlyRows.map((r) => [
            r.Month,
            `Rs.${r["Total Expenses"].toLocaleString()}`,
            r["Top Category"],
            r["vs Last Month"],
          ])}
        />
      </ReportSection>
      <ReportSection
        title="Expense Category Analysis"
        exportTitle="Expense_Category_Analysis"
        exportData={catAnalysis as unknown as Record<string, unknown>[]}
      >
        <DataTable
          headers={[
            "Category",
            "Apr (Rs)",
            "May (Rs)",
            "Jun (Rs)",
            "Jul (Rs)",
            "Grand Total (Rs)",
          ]}
          rows={[
            ...catAnalysis.map((r) => [
              r.Category,
              `Rs.${r.Apr.toLocaleString()}`,
              `Rs.${r.May.toLocaleString()}`,
              `Rs.${r.Jun.toLocaleString()}`,
              `Rs.${r.Jul.toLocaleString()}`,
              `Rs.${r["Grand Total"].toLocaleString()}`,
            ]),
            [
              <strong key="l">Grand Total</strong>,
              <strong key="a">
                Rs.{catAnalysis.reduce((a, r) => a + r.Apr, 0).toLocaleString()}
              </strong>,
              <strong key="m">
                Rs.{catAnalysis.reduce((a, r) => a + r.May, 0).toLocaleString()}
              </strong>,
              <strong key="j">
                Rs.{catAnalysis.reduce((a, r) => a + r.Jun, 0).toLocaleString()}
              </strong>,
              <strong key="jl">
                Rs.{catAnalysis.reduce((a, r) => a + r.Jul, 0).toLocaleString()}
              </strong>,
              <strong key="g">
                Rs.
                {catAnalysis
                  .reduce((a, r) => a + r["Grand Total"], 0)
                  .toLocaleString()}
              </strong>,
            ],
          ]}
        />
      </ReportSection>
    </div>
  );
}

function AttendanceReportsTab() {
  const [attMonth, setAttMonth] = useState(MONTHS[7]);
  const [studentSearch, setStudentSearch] = useState("");
  const [attClassFilter, setAttClassFilter] = useState("all");
  const classAttRows = CLASSES_LIST.filter(
    (c) => attClassFilter === "all" || c === attClassFilter,
  )
    .map((c) => {
      const students = mockStudents.filter((s) => s.className === c);
      if (students.length === 0) return null;
      const present = Math.round(students.length * 0.87);
      const absent = Math.round(students.length * 0.08);
      return {
        Class: `Class ${c}`,
        Section: "A",
        "Total Students": students.length,
        Present: present,
        Absent: absent,
        Late: Math.max(0, students.length - present - absent),
        "Attendance %": `${((present / students.length) * 100).toFixed(1)}%`,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);
  const monthlyAttRows = CLASSES_LIST.map((c, i) => ({
    Class: `Class ${c}`,
    "Working Days": 24,
    "Avg Present %": `${80 + (seedRand(attMonth, i) % 18)}%`,
    "Avg Absent %": `${2 + (seedRand(attMonth, i + 4) % 10)}%`,
  }));
  const matchedStudent = mockStudents.find(
    (s) =>
      studentSearch.length > 1 &&
      s.name.toLowerCase().includes(studentSearch.toLowerCase()),
  );
  const studentAttRows = matchedStudent
    ? Array.from({ length: 10 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return {
          Date: d.toLocaleDateString("en-IN"),
          Status: [
            "Present",
            "Present",
            "Present",
            "Absent",
            "Late",
            "Present",
            "Present",
            "Present",
            "Absent",
            "Present",
          ][i],
        };
      })
    : [];
  const staffAttRows = mockStaff.slice(0, 10).map((s) => ({
    "Staff Name": s.name,
    Designation: s.designation,
    "Present Days": 22,
    "Absent Days": 2,
    "Leave Days": 0,
    "%": "91.7%",
  }));
  return (
    <div className="space-y-6">
      <ReportSection
        title="Class-wise Attendance Today"
        exportTitle="Classwise_Attendance"
        exportData={classAttRows as unknown as Record<string, unknown>[]}
      >
        <DataTable
          headers={[
            "Class",
            "Section",
            "Total Students",
            "Present",
            "Absent",
            "Late",
            "Attendance %",
          ]}
          rows={classAttRows.map((r) => [
            r.Class,
            r.Section,
            r["Total Students"],
            r.Present,
            r.Absent,
            r.Late,
            r["Attendance %"],
          ])}
        />
      </ReportSection>
      <ReportSection
        title="Monthly Attendance Summary"
        exportTitle="Monthly_Attendance"
        exportData={monthlyAttRows as unknown as Record<string, unknown>[]}
        controls={
          <select
            value={attMonth}
            onChange={(e) => setAttMonth(e.target.value)}
            className="border border-border rounded-lg px-3 py-1.5 text-sm bg-background text-foreground"
            data-ocid="reports.attendance.month_select"
          >
            {MONTHS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        }
      >
        <DataTable
          headers={["Class", "Working Days", "Avg Present %", "Avg Absent %"]}
          rows={monthlyAttRows.map((r) => [
            r.Class,
            r["Working Days"],
            r["Avg Present %"],
            r["Avg Absent %"],
          ])}
        />
      </ReportSection>
      <div className="flex gap-3 flex-wrap items-center mb-3">
        <select
          value={attClassFilter}
          onChange={(e) => {
            setAttClassFilter(e.target.value);
          }}
          className="border border-border rounded-lg px-3 py-1.5 text-sm bg-background text-foreground"
          data-ocid="reports.attendance.class_filter.select"
        >
          <option value="all">All Classes</option>
          {CLASSES_LIST.map((c) => (
            <option key={c} value={c}>
              Class {c}
            </option>
          ))}
        </select>
      </div>
      <ReportSection
        title="Student-wise Attendance"
        exportTitle="Studentwise_Attendance"
        exportData={studentAttRows as unknown as Record<string, unknown>[]}
        controls={
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-2.5 text-muted-foreground"
            />
            <Input
              placeholder="Search student name..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="pl-8 h-8 text-sm w-52"
              data-ocid="reports.attendance.student_search"
            />
          </div>
        }
      >
        {!matchedStudent ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Type a student name to view attendance records.
          </p>
        ) : (
          <>
            <p className="text-sm font-medium">
              Showing:{" "}
              <span className="text-primary">{matchedStudent.name}</span> —{" "}
              {matchedStudent.className}
            </p>
            <DataTable
              headers={["Date", "Status"]}
              rows={studentAttRows.map((r) => [
                r.Date,
                <span
                  key={r.Date}
                  className={
                    r.Status === "Present"
                      ? "text-green-600 font-medium"
                      : r.Status === "Absent"
                        ? "text-red-500 font-medium"
                        : "text-amber-600 font-medium"
                  }
                >
                  {r.Status}
                </span>,
              ])}
            />
          </>
        )}
      </ReportSection>
      <ReportSection
        title="Staff Attendance Report"
        exportTitle="Staff_Attendance"
        exportData={staffAttRows as unknown as Record<string, unknown>[]}
      >
        <DataTable
          headers={[
            "Staff Name",
            "Designation",
            "Present Days",
            "Absent Days",
            "Leave Days",
            "%",
          ]}
          rows={staffAttRows.map((r) => [
            r["Staff Name"],
            r.Designation,
            r["Present Days"],
            r["Absent Days"],
            r["Leave Days"],
            r["%"],
          ])}
        />
      </ReportSection>
    </div>
  );
}

function AcademicReportsTab() {
  const examResultRows = CLASSES_LIST.map((c, i) => {
    const total = (seedRand(c, i) % 20) + 30;
    const pass = Math.round(total * (0.8 + (seedRand(c, i + 5) % 18) / 100));
    return {
      Class: `Class ${c}`,
      "Total Students": total,
      Pass: pass,
      Fail: total - pass,
      "Pass %": `${((pass / total) * 100).toFixed(1)}%`,
      "Avg Score": `${65 + (seedRand(c, i + 2) % 28)}%`,
    };
  });
  const toppersRows = [
    {
      Rank: 1,
      "Student Name": "Aarav Sharma",
      Class: "X-A",
      Section: "A",
      Score: 96,
      Grade: "A+",
    },
    {
      Rank: 2,
      "Student Name": "Ananya Singh",
      Class: "XII-B",
      Section: "B",
      Score: 94,
      Grade: "A+",
    },
    {
      Rank: 3,
      "Student Name": "Kabir Mehta",
      Class: "IX-A",
      Section: "A",
      Score: 92,
      Grade: "A+",
    },
    {
      Rank: 4,
      "Student Name": "Priya Patel",
      Class: "XI-A",
      Section: "A",
      Score: 91,
      Grade: "A+",
    },
    {
      Rank: 5,
      "Student Name": "Sneha Rao",
      Class: "X-B",
      Section: "B",
      Score: 90,
      Grade: "A+",
    },
    {
      Rank: 6,
      "Student Name": "Dev Gupta",
      Class: "VIII-C",
      Section: "C",
      Score: 89,
      Grade: "A",
    },
    {
      Rank: 7,
      "Student Name": "Meera Nair",
      Class: "VII-A",
      Section: "A",
      Score: 88,
      Grade: "A",
    },
    {
      Rank: 8,
      "Student Name": "Rohit Kumar",
      Class: "XII-A",
      Section: "A",
      Score: 87,
      Grade: "A",
    },
  ];
  const subjectRows = [
    {
      Subject: "Mathematics",
      "Class Avg": "72%",
      "School Avg": "74%",
      "Pass %": "88%",
      "Top Score": 98,
    },
    {
      Subject: "Science",
      "Class Avg": "78%",
      "School Avg": "76%",
      "Pass %": "91%",
      "Top Score": 96,
    },
    {
      Subject: "English",
      "Class Avg": "81%",
      "School Avg": "80%",
      "Pass %": "94%",
      "Top Score": 100,
    },
    {
      Subject: "Hindi",
      "Class Avg": "76%",
      "School Avg": "77%",
      "Pass %": "92%",
      "Top Score": 99,
    },
    {
      Subject: "Social Studies",
      "Class Avg": "74%",
      "School Avg": "73%",
      "Pass %": "90%",
      "Top Score": 97,
    },
  ];
  return (
    <div className="space-y-6">
      <ReportSection
        title="Exam Results Summary"
        exportTitle="Exam_Results_Summary"
        exportData={examResultRows as unknown as Record<string, unknown>[]}
      >
        <DataTable
          headers={[
            "Class",
            "Total Students",
            "Pass",
            "Fail",
            "Pass %",
            "Avg Score",
          ]}
          rows={examResultRows.map((r) => [
            r.Class,
            r["Total Students"],
            r.Pass,
            r.Fail,
            r["Pass %"],
            r["Avg Score"],
          ])}
        />
      </ReportSection>
      <ReportSection
        title="Class Toppers"
        exportTitle="Class_Toppers"
        exportData={toppersRows as unknown as Record<string, unknown>[]}
      >
        <DataTable
          headers={[
            "Rank",
            "Student Name",
            "Class",
            "Section",
            "Score",
            "Grade",
          ]}
          rows={toppersRows.map((r) => [
            <span key={r.Rank} className="font-bold text-primary">
              #{r.Rank}
            </span>,
            r["Student Name"],
            r.Class,
            r.Section,
            <span key={`s${r.Rank}`} className="font-semibold text-green-600">
              {r.Score}/100
            </span>,
            <span key={`g${r.Rank}`} className="font-bold text-amber-600">
              {r.Grade}
            </span>,
          ])}
        />
      </ReportSection>
      <ReportSection
        title="Subject-wise Performance"
        exportTitle="Subject_Performance"
        exportData={subjectRows as unknown as Record<string, unknown>[]}
      >
        <DataTable
          headers={[
            "Subject",
            "Class Avg",
            "School Avg",
            "Pass %",
            "Top Score",
          ]}
          rows={subjectRows.map((r) => [
            r.Subject,
            r["Class Avg"],
            r["School Avg"],
            r["Pass %"],
            r["Top Score"],
          ])}
        />
      </ReportSection>
    </div>
  );
}

function StaffReportsTab() {
  const departments = [
    "Teaching",
    "Administrative",
    "Support",
    "Library",
    "Lab",
    "Sports",
  ];
  const deptRows = departments.map((d, i) => ({
    Department: d,
    "Total Staff": (seedRand(d, i) % 15) + 5,
    Active: (seedRand(d, i + 1) % 12) + 4,
    "On Leave": seedRand(d, i + 2) % 3,
    Inactive: seedRand(d, i + 3) % 2,
  }));
  const staffAttRows = mockStaff.slice(0, 12).map((s, i) => ({
    Name: s.name,
    Designation: s.designation,
    "Days Present": 20 + (seedRand(s.name, i) % 4),
    "Days Absent": seedRand(s.name, i + 1) % 3,
    "%": `${87 + (seedRand(s.name, i + 2) % 12)}%`,
  }));
  return (
    <div className="space-y-6">
      <ReportSection
        title="Staff Directory Summary"
        exportTitle="Staff_Directory"
        exportData={deptRows as unknown as Record<string, unknown>[]}
      >
        <DataTable
          headers={[
            "Department",
            "Total Staff",
            "Active",
            "On Leave",
            "Inactive",
          ]}
          rows={deptRows.map((r) => [
            r.Department,
            r["Total Staff"],
            r.Active,
            r["On Leave"],
            r.Inactive,
          ])}
        />
      </ReportSection>
      <ReportSection
        title="Staff Attendance This Month"
        exportTitle="Staff_Attendance_Monthly"
        exportData={staffAttRows as unknown as Record<string, unknown>[]}
      >
        <DataTable
          headers={["Name", "Designation", "Days Present", "Days Absent", "%"]}
          rows={staffAttRows.map((r) => [
            r.Name,
            r.Designation,
            r["Days Present"],
            r["Days Absent"],
            r["%"],
          ])}
        />
      </ReportSection>
    </div>
  );
}

function TransportReportsTab() {
  const routeRows = [
    {
      "Route No": "RT-01",
      "Route Name": "Sector 12 - School",
      Driver: "Raju Singh",
      "Vehicle No": "DL 4C 2345",
      "Total Students": 42,
    },
    {
      "Route No": "RT-02",
      "Route Name": "Gandhi Nagar - School",
      Driver: "Mohd Salim",
      "Vehicle No": "DL 7B 8910",
      "Total Students": 38,
    },
    {
      "Route No": "RT-03",
      "Route Name": "Patel Colony - School",
      Driver: "Suresh Kumar",
      "Vehicle No": "DL 2A 1123",
      "Total Students": 55,
    },
    {
      "Route No": "RT-04",
      "Route Name": "Green Park - School",
      Driver: "Anand Sharma",
      "Vehicle No": "DL 9F 3344",
      "Total Students": 29,
    },
    {
      "Route No": "RT-05",
      "Route Name": "Old City - School",
      Driver: "Ramesh Yadav",
      "Vehicle No": "DL 5D 6677",
      "Total Students": 48,
    },
  ];
  const feeRows = routeRows.map((r) => {
    const fee = 1800;
    const col = Math.round(r["Total Students"] * fee * 0.88);
    return {
      Route: r["Route Name"],
      "Fee Per Student": fee,
      "Students Enrolled": r["Total Students"],
      Collected: col,
      Pending: r["Total Students"] * fee - col,
    };
  });
  return (
    <div className="space-y-6">
      <ReportSection
        title="Route-wise Student Count"
        exportTitle="Transport_Routes"
        exportData={routeRows as unknown as Record<string, unknown>[]}
      >
        <DataTable
          headers={[
            "Route No",
            "Route Name",
            "Driver",
            "Vehicle No",
            "Total Students",
          ]}
          rows={routeRows.map((r) => [
            r["Route No"],
            r["Route Name"],
            r.Driver,
            r["Vehicle No"],
            r["Total Students"],
          ])}
        />
      </ReportSection>
      <ReportSection
        title="Transport Fee Collection"
        exportTitle="Transport_Fee_Collection"
        exportData={feeRows as unknown as Record<string, unknown>[]}
      >
        <DataTable
          headers={[
            "Route",
            "Fee Per Student (Rs)",
            "Students Enrolled",
            "Collected (Rs)",
            "Pending (Rs)",
          ]}
          rows={feeRows.map((r) => [
            r.Route,
            `Rs.${r["Fee Per Student"].toLocaleString()}`,
            r["Students Enrolled"],
            `Rs.${r.Collected.toLocaleString()}`,
            `Rs.${r.Pending.toLocaleString()}`,
          ])}
        />
      </ReportSection>
    </div>
  );
}

const REPORT_TABS = [
  { id: "overview", label: "Overview", icon: <BarChart2 size={14} /> },
  { id: "fee", label: "Fee Reports", icon: <IndianRupee size={14} /> },
  {
    id: "attendance",
    label: "Attendance Reports",
    icon: <CalendarDays size={14} />,
  },
  {
    id: "academic",
    label: "Academic Reports",
    icon: <GraduationCap size={14} />,
  },
  { id: "expense", label: "Expense Reports", icon: <Receipt size={14} /> },
  { id: "staff", label: "Staff Reports", icon: <Users size={14} /> },
  { id: "transport", label: "Transport Reports", icon: <Bus size={14} /> },
];

export function ReportsPage() {
  const [globalSearch, setGlobalSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  return (
    <div className="space-y-6" data-ocid="reports.page">
      <style>
        {"@media print { header, nav, aside { display: none !important; } }"}
      </style>
      <div className="flex items-center gap-3">
        <BarChart2 size={22} className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports Hub</h1>
          <p className="text-sm text-muted-foreground">
            School-wide analytics and downloadable reports
          </p>
        </div>
      </div>
      <div
        className="flex flex-wrap gap-3 p-4 bg-card rounded-xl border border-border"
        data-ocid="reports.filter.panel"
      >
        <div className="flex-1 min-w-48 relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search reports, students, staff..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="h-9 pl-9"
            data-ocid="reports.search_input"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            From:
          </span>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-9 w-36"
            data-ocid="reports.date_from.input"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            To:
          </span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-9 w-36"
            data-ocid="reports.date_to.input"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setGlobalSearch("");
            setDateFrom("");
            setDateTo("");
          }}
          data-ocid="reports.filter.button"
        >
          Clear
        </Button>
      </div>
      <Tabs defaultValue="overview" data-ocid="reports.tabs">
        <div className="overflow-x-auto">
          <TabsList className="flex-nowrap inline-flex h-auto p-1 gap-1 bg-muted/50 rounded-xl">
            {REPORT_TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 whitespace-nowrap rounded-lg"
                data-ocid={`reports.${tab.id}.tab`}
              >
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="overview" className="mt-4">
          <OverviewTab />
        </TabsContent>
        <TabsContent value="fee" className="mt-4">
          <FeeReportsTab />
        </TabsContent>
        <TabsContent value="attendance" className="mt-4">
          <AttendanceReportsTab />
        </TabsContent>
        <TabsContent value="academic" className="mt-4">
          <AcademicReportsTab />
        </TabsContent>
        <TabsContent value="expense" className="mt-4">
          <ExpenseReportsTab />
        </TabsContent>
        <TabsContent value="staff" className="mt-4">
          <StaffReportsTab />
        </TabsContent>
        <TabsContent value="transport" className="mt-4">
          <TransportReportsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
