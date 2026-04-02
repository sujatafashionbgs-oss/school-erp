import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AreaChart,
  BarChart2,
  BookOpen,
  Brain,
  GraduationCap,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  AreaChart as ReAreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

// ── Mock Data ──────────────────────────────────────────────────────────────────

const classScores = [
  { class: "Class 6", avg: 71 },
  { class: "Class 7", avg: 68 },
  { class: "Class 8", avg: 62 },
  { class: "Class 9", avg: 75 },
  { class: "Class 10", avg: 78 },
];

const subjectRadar = [
  { subject: "Math", score: 72 },
  { subject: "Science", score: 78 },
  { subject: "English", score: 82 },
  { subject: "Hindi", score: 75 },
  { subject: "Social Sci", score: 70 },
];

const topPerformers = [
  { name: "Aarav Sharma", class: "10", score: 96, trend: "↑" },
  { name: "Priya Patel", class: "9", score: 94, trend: "↑" },
  { name: "Rohit Kumar", class: "10", score: 92, trend: "↑" },
  { name: "Ananya Singh", class: "8", score: 91, trend: "↑" },
  { name: "Dev Sharma", class: "9", score: 90, trend: "↔" },
];

const atRiskStudents = [
  { name: "Rahul Yadav", class: "8", score: 34, alert: "🔴 Low" },
  { name: "Meena Devi", class: "6", score: 38, alert: "🔴 Low" },
  { name: "Suresh Kumar", class: "7", score: 41, alert: "⚠️ Risk" },
  { name: "Kavita Singh", class: "8", score: 43, alert: "⚠️ Risk" },
  { name: "Amit Patel", class: "9", score: 45, alert: "⚠️ Risk" },
];

const attendanceTrend = [
  { month: "Apr", students: 88, staff: 95 },
  { month: "May", students: 87, staff: 94 },
  { month: "Jun", students: 85, staff: 92 },
  { month: "Jul", students: 86, staff: 93 },
  { month: "Aug", students: 89, staff: 96 },
  { month: "Sep", students: 90, staff: 97 },
  { month: "Oct", students: 87, staff: 94 },
  { month: "Nov", students: 85, staff: 93 },
];

const WEEKS = [
  "W1",
  "W2",
  "W3",
  "W4",
  "W5",
  "W6",
  "W7",
  "W8",
  "W9",
  "W10",
  "W11",
  "W12",
];
type HeatColor = "green" | "amber" | "red";
const heatmapData: {
  cls: string;
  cells: { week: string; color: HeatColor }[];
}[] = [
  {
    cls: "Class 6",
    cells: [
      "green",
      "green",
      "amber",
      "green",
      "green",
      "amber",
      "green",
      "red",
      "green",
      "green",
      "amber",
      "green",
    ].map((c, i) => ({ week: WEEKS[i], color: c as HeatColor })),
  },
  {
    cls: "Class 7",
    cells: [
      "green",
      "amber",
      "green",
      "amber",
      "green",
      "green",
      "amber",
      "green",
      "green",
      "amber",
      "green",
      "green",
    ].map((c, i) => ({ week: WEEKS[i], color: c as HeatColor })),
  },
  {
    cls: "Class 8",
    cells: [
      "amber",
      "green",
      "red",
      "green",
      "amber",
      "green",
      "green",
      "amber",
      "red",
      "green",
      "green",
      "amber",
    ].map((c, i) => ({ week: WEEKS[i], color: c as HeatColor })),
  },
  {
    cls: "Class 9",
    cells: [
      "green",
      "green",
      "amber",
      "green",
      "green",
      "green",
      "amber",
      "green",
      "green",
      "green",
      "amber",
      "green",
    ].map((c, i) => ({ week: WEEKS[i], color: c as HeatColor })),
  },
  {
    cls: "Class 10",
    cells: [
      "green",
      "amber",
      "green",
      "green",
      "red",
      "green",
      "green",
      "amber",
      "green",
      "green",
      "green",
      "amber",
    ].map((c, i) => ({ week: WEEKS[i], color: c as HeatColor })),
  },
];

const belowThresholdStudents = [
  { name: "Rahul Yadav", class: "8", pct: "62%", lastAbsent: "15 Nov" },
  { name: "Meena Devi", class: "6", pct: "65%", lastAbsent: "14 Nov" },
  { name: "Suresh Kumar", class: "7", pct: "68%", lastAbsent: "12 Nov" },
  { name: "Kavita Singh", class: "8", pct: "70%", lastAbsent: "10 Nov" },
  { name: "Deepak Verma", class: "9", pct: "72%", lastAbsent: "8 Nov" },
];

const feeCollection = [
  { month: "Apr", amount: 180000 },
  { month: "May", amount: 220000 },
  { month: "Jun", amount: 195000 },
  { month: "Jul", amount: 240000 },
  { month: "Aug", amount: 280000 },
  { month: "Sep", amount: 260000 },
  { month: "Oct", amount: 310000 },
  { month: "Nov", amount: 295000 },
];

const feePieData = [
  { name: "Collected", value: 18400000 },
  { name: "Pending", value: 3200000 },
];

const teacherAttendance = [
  { name: "Mr. Amit Verma", pct: 96 },
  { name: "Mrs. Sunita Devi", pct: 88 },
  { name: "Mr. Raj Kapoor", pct: 92 },
  { name: "Mrs. Pooja Sharma", pct: 94 },
  { name: "Mr. Sanjay Kumar", pct: 85 },
  { name: "Mrs. Anita Gupta", pct: 91 },
  { name: "Mr. Vikram Singh", pct: 89 },
  { name: "Mrs. Kavita Joshi", pct: 93 },
];

const teacherSyllabus = [
  { name: "Mr. Amit Verma", pct: 88 },
  { name: "Mrs. Sunita Devi", pct: 68 },
  { name: "Mr. Raj Kapoor", pct: 82 },
  { name: "Mrs. Pooja Sharma", pct: 91 },
  { name: "Mr. Sanjay Kumar", pct: 55 },
  { name: "Mrs. Anita Gupta", pct: 79 },
  { name: "Mr. Vikram Singh", pct: 74 },
  { name: "Mrs. Kavita Joshi", pct: 85 },
];

function syllabusColor(pct: number) {
  if (pct > 80) return "#22c55e";
  if (pct >= 60) return "#f59e0b";
  return "#ef4444";
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  sub,
  color,
}: {
  title: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <Card className="flex-1 min-w-[140px]">
      <CardContent className="pt-5 pb-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
          {title}
        </p>
        <p className={`text-2xl font-bold ${color ?? "text-foreground"}`}>
          {value}
        </p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  );
}

// ── AI Insight Card ───────────────────────────────────────────────────────────

function InsightCard({
  children,
  color,
}: {
  children: React.ReactNode;
  color: "amber" | "blue" | "green";
}) {
  const borderMap = {
    amber: "border-amber-400 bg-amber-50 dark:bg-amber-950/30",
    blue: "border-blue-400 bg-blue-50 dark:bg-blue-950/30",
    green: "border-green-400 bg-green-50 dark:bg-green-950/30",
  };
  return (
    <div
      className={`rounded-xl border-l-4 p-4 text-sm leading-relaxed ${borderMap[color]}`}
    >
      {children}
    </div>
  );
}

// ── Section Heading ───────────────────────────────────────────────────────────

function SectionHeading({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function AIAnalyticsDashboard({
  navigate: _navigate,
}: {
  navigate: (p: string) => void;
}) {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-10">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Brain size={20} className="text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            AI Analytics Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Powered by AI — Real-time insights for smarter decisions
          </p>
        </div>
      </div>

      {/* ── SECTION 1: Academic Performance ─────────────────────── */}
      <section>
        <SectionHeading
          icon={<GraduationCap size={18} />}
          title="Academic Performance"
        />

        {/* Stat Cards */}
        <div className="flex flex-wrap gap-4 mb-6">
          <StatCard title="School Average Score" value="74%" />
          <StatCard title="Pass Rate" value="91%" color="text-green-600" />
          <StatCard
            title="Top Scorer"
            value="96%"
            sub="Aarav Sharma"
            color="text-blue-600"
          />
          <StatCard title="Students at Risk" value="23" color="text-red-600" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Class-wise Average Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={classScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="class" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar
                    dataKey="avg"
                    name="Avg Marks"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Radar Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Subject-wise School Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={subjectRadar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.35}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* AI Insight */}
        <InsightCard color="amber">
          ⚠️ <strong>Class 8</strong> shows 18% lower performance in Mathematics
          vs last term. Recommend: Additional remedial classes for{" "}
          <strong>34 students</strong>.
        </InsightCard>

        {/* Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Top Performers */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                🏆 Top 5 Performers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPerformers.map((s, i) => (
                    <TableRow
                      key={s.name}
                      data-ocid={`academic.top_performer.item.${i + 1}`}
                    >
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.class}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{s.score}%</Badge>
                      </TableCell>
                      <TableCell
                        className={
                          s.trend === "↑"
                            ? "text-green-600 font-bold"
                            : "text-muted-foreground"
                        }
                      >
                        {s.trend}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* At-Risk Students */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                🚨 At-Risk Students
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Alert</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {atRiskStudents.map((s, i) => (
                    <TableRow
                      key={s.name}
                      data-ocid={`academic.at_risk.item.${i + 1}`}
                    >
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.class}</TableCell>
                      <TableCell className="text-red-600 font-semibold">
                        {s.score}
                      </TableCell>
                      <TableCell className="text-xs">{s.alert}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── SECTION 2: Attendance Analytics ─────────────────────── */}
      <section>
        <SectionHeading
          icon={<Users size={18} />}
          title="Attendance Analytics"
        />

        {/* Stat Cards */}
        <div className="flex flex-wrap gap-4 mb-6">
          <StatCard
            title="Overall Attendance"
            value="87.3%"
            color="text-green-600"
          />
          <StatCard
            title="Below 75% Students"
            value="47"
            color="text-amber-600"
          />
          <StatCard
            title="Perfect Attendance"
            value="312"
            color="text-blue-600"
          />
          <StatCard title="Today Present" value="1,847" />
        </div>

        {/* Line Chart */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Attendance Trend (Apr–Nov)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="students"
                  name="Students %"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="staff"
                  name="Staff %"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Heatmap */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Heatmap — Weeks × Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[560px]">
                {/* Column headers */}
                <div className="flex items-center gap-1 mb-1 pl-20">
                  {WEEKS.map((w) => (
                    <div
                      key={w}
                      className="flex-1 text-center text-xs text-muted-foreground"
                    >
                      {w}
                    </div>
                  ))}
                </div>
                {heatmapData.map((row) => (
                  <div key={row.cls} className="flex items-center gap-1 mb-1">
                    <div className="w-20 text-xs font-medium text-muted-foreground shrink-0">
                      {row.cls}
                    </div>
                    {row.cells.map((cell) => (
                      <div
                        key={`${row.cls}-${cell.week}`}
                        title={`${row.cls} ${cell.week}: ${cell.color === "green" ? "High" : cell.color === "amber" ? "Medium" : "Low"}`}
                        className={`flex-1 h-7 rounded ${
                          cell.color === "green"
                            ? "bg-green-200 dark:bg-green-800"
                            : cell.color === "amber"
                              ? "bg-amber-200 dark:bg-amber-700"
                              : "bg-red-200 dark:bg-red-800"
                        }`}
                      />
                    ))}
                  </div>
                ))}
                {/* Legend */}
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-green-300 inline-block" />
                    High (≥90%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-amber-300 inline-block" />
                    Medium (75–89%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-red-300 inline-block" />
                    Low (&lt;75%)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Insight */}
        <InsightCard color="blue">
          📊 <strong>47 students</strong> are below 75% attendance threshold.
          Auto-SMS reminders sent to parents.
        </InsightCard>

        {/* Below threshold table */}
        <Card className="mt-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Students Below 75% Attendance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Attendance%</TableHead>
                  <TableHead>Last Absent</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {belowThresholdStudents.map((s, i) => (
                  <TableRow
                    key={s.name}
                    data-ocid={`attendance.below_threshold.item.${i + 1}`}
                  >
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.class}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">{s.pct}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {s.lastAbsent}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        data-ocid={`attendance.send_reminder.button.${i + 1}`}
                        onClick={() =>
                          toast.success(
                            `SMS reminder sent to ${s.name}'s parent`,
                          )
                        }
                      >
                        Send Reminder
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* ── SECTION 3: Fee Analytics ──────────────────────────────── */}
      <section>
        <SectionHeading icon={<Wallet size={18} />} title="Fee Analytics" />

        {/* Stat Cards */}
        <div className="flex flex-wrap gap-4 mb-6">
          <StatCard
            title="Total Collected"
            value="₹18.4L"
            color="text-green-600"
          />
          <StatCard title="Pending" value="₹3.2L" color="text-red-600" />
          <StatCard title="Collection Rate" value="85.2%" />
          <StatCard title="Defaulters" value="89" color="text-amber-600" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Area Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Fee Collection Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <ReAreaChart data={feeCollection}>
                  <defs>
                    <linearGradient id="feeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(v: number) => [
                      `₹${(v / 1000).toFixed(0)}K`,
                      "Amount",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    name="Fee Collected"
                    stroke="#6366f1"
                    fill="url(#feeGrad)"
                    strokeWidth={2}
                  />
                </ReAreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Donut Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Collected vs Pending
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={feePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => `₹${(v / 100000).toFixed(1)}L`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* AI Insight */}
        <InsightCard color="blue">
          💡 Fee collection is <strong>12% below target</strong> for this
          quarter. <strong>89 students</strong> are defaulters. Top defaulter
          class: <strong>Class 9 (₹82,000 pending)</strong>
        </InsightCard>
      </section>

      {/* ── SECTION 4: Teacher Performance ───────────────────────── */}
      <section>
        <SectionHeading
          icon={<BookOpen size={18} />}
          title="Teacher Performance"
        />

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Teacher Attendance */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Teacher Attendance %
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={teacherAttendance}
                  layout="vertical"
                  margin={{ left: 10, right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    domain={[70, 100]}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={130}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="pct"
                    name="Attendance %"
                    fill="#6366f1"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Syllabus Completion */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Syllabus Completion %
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={teacherSyllabus}
                  layout="vertical"
                  margin={{ left: 10, right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={130}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar dataKey="pct" name="Completion %" radius={[0, 4, 4, 0]}>
                    {teacherSyllabus.map((entry) => (
                      <Cell key={entry.name} fill={syllabusColor(entry.pct)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Legend for Syllabus */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" />
            &gt;80% On Track
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
            60–80% Moderate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" />
            &lt;60% Behind
          </span>
        </div>

        {/* AI Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InsightCard color="green">
            📈 <strong>Mr. Amit Verma's</strong> class shows 22% improvement in
            Science results. Share teaching methodology.
          </InsightCard>
          <InsightCard color="amber">
            ⚠️ <strong>Mrs. Sunita Devi</strong> has 68% syllabus coverage. At
            current pace, 3 chapters may remain uncovered.
          </InsightCard>
          <InsightCard color="blue">
            🎯 <strong>Class 10-A</strong> has highest exam scores. PTM
            recommended to maintain momentum.
          </InsightCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
