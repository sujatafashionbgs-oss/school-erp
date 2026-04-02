import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CLASSES as CLASSES_LIST } from "@/data/classConfig";
import { type TeacherWorkload, mockWorkload } from "@/data/mockWorkload";
import { Download, FileSpreadsheet, Pencil } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

function barColor(pct: number) {
  if (pct > 90) return "#ef4444";
  if (pct >= 70) return "#f59e0b";
  return "#22c55e";
}

function WorkloadBadge({ pct }: { pct: number }) {
  if (pct > 90)
    return (
      <Badge className="bg-red-100 text-red-700 border-red-300">
        Overloaded
      </Badge>
    );
  if (pct < 50)
    return (
      <Badge className="bg-amber-100 text-amber-700 border-amber-300">
        Under-utilized
      </Badge>
    );
  return null;
}

function WorkloadBar({ pct }: { pct: number }) {
  const color =
    pct > 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-green-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className={`${color} h-2.5 rounded-full transition-all`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className="text-sm font-medium w-10 text-right">{pct}%</span>
    </div>
  );
}

export function WorkloadPage() {
  const [data, setData] = useState<TeacherWorkload[]>(mockWorkload);
  const [editTarget, setEditTarget] = useState<TeacherWorkload | null>(null);
  const [editPeriods, setEditPeriods] = useState("");
  const [editDuties, setEditDuties] = useState("");
  const [editClasses, setEditClasses] = useState<string[]>([]);

  const totalTeachers = 45;
  const avgWorkload = 74;
  const overloaded = data.filter((t) => t.workloadPct > 90).length;
  const underUtilized = data.filter((t) => t.workloadPct < 50).length;

  function openEdit(t: TeacherWorkload) {
    setEditTarget(t);
    setEditPeriods(String(t.periodsPerWeek));
    setEditDuties(t.extraDuties.join(", "));
    setEditClasses([...t.classes]);
  }

  function saveEdit() {
    if (!editTarget) return;
    const periods = Number.parseInt(editPeriods);
    if (Number.isNaN(periods) || periods < 0) {
      toast.error("Enter a valid number of periods");
      return;
    }
    const duties = editDuties
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);
    const pct = Math.round((periods / editTarget.maxPeriodsAllowed) * 100);
    setData((prev) =>
      prev.map((t) =>
        t.staffId === editTarget.staffId
          ? {
              ...t,
              periodsPerWeek: periods,
              extraDuties: duties,
              classes: editClasses,
              workloadPct: pct,
            }
          : t,
      ),
    );
    setEditTarget(null);
    toast.success("Workload updated successfully");
  }

  function toggleClass(cls: string) {
    setEditClasses((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls],
    );
  }

  const chartData = data.map((t) => ({
    name: `${t.name.split(" ")[0]} ${t.name.split(" ").slice(-1)[0]}`,
    pct: t.workloadPct,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Teacher Workload Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Monitor and manage teacher workload distribution
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info("Exporting Excel...")}
          >
            <FileSpreadsheet size={16} className="mr-1" /> Export Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Download size={16} className="mr-1" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Total Teachers
          </p>
          <p className="text-3xl font-bold mt-1">{totalTeachers}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Avg Workload
          </p>
          <p className="text-3xl font-bold mt-1 text-blue-600">
            {avgWorkload}%
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Overloaded
          </p>
          <p className="text-3xl font-bold mt-1 text-red-600">{overloaded}</p>
          <p className="text-xs text-red-500 mt-1">&gt;90% workload</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Under-utilized
          </p>
          <p className="text-3xl font-bold mt-1 text-amber-600">
            {underUtilized}
          </p>
          <p className="text-xs text-amber-500 mt-1">&lt;50% workload</p>
        </div>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="text-base font-semibold mb-4">
          Workload Distribution by Teacher
        </h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 10, right: 30, top: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 120]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fontSize: 12 }}
            />
            <Tooltip formatter={(v: number) => [`${v}%`, "Workload"]} />
            <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={barColor(entry.pct)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />{" "}
            Normal (&lt;70%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />{" "}
            Heavy (70–90%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />{" "}
            Overloaded (&gt;90%)
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {[
                  "Name",
                  "Subjects",
                  "Classes",
                  "Periods/Wk",
                  "Max Periods",
                  "Workload %",
                  "Extra Duties",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-medium text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((t) => (
                <tr
                  key={t.staffId}
                  className="border-t hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.designation}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {t.subjects.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {t.classes.join(", ")}
                  </td>
                  <td className="px-4 py-3 text-center font-medium">
                    {t.periodsPerWeek}
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">
                    {t.maxPeriodsAllowed}
                  </td>
                  <td className="px-4 py-3 min-w-[160px]">
                    <WorkloadBar pct={t.workloadPct} />
                    <div className="mt-1">
                      <WorkloadBadge pct={t.workloadPct} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[160px]">
                    {t.extraDuties.length > 0 ? (
                      t.extraDuties.join(", ")
                    ) : (
                      <span className="italic">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(t)}
                    >
                      <Pencil size={14} className="mr-1" /> Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={() => setEditTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Workload — {editTarget?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="periods">Periods per Week</Label>
              <Input
                id="periods"
                type="number"
                min={0}
                max={50}
                value={editPeriods}
                onChange={(e) => setEditPeriods(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Max allowed: {editTarget?.maxPeriodsAllowed}
              </p>
            </div>
            <div>
              <Label>Classes Assigned</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {CLASSES_LIST.map((cls) => (
                  <div
                    key={cls}
                    className="flex items-center gap-1 text-sm cursor-pointer"
                    onClick={() => toggleClass(cls)}
                    onKeyDown={(e) => e.key === "Enter" && toggleClass(cls)}
                  >
                    <Checkbox
                      checked={editClasses.includes(cls)}
                      onCheckedChange={() => toggleClass(cls)}
                    />
                    {cls}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="duties">Extra Duties (comma-separated)</Label>
              <Input
                id="duties"
                value={editDuties}
                onChange={(e) => setEditDuties(e.target.value)}
                placeholder="e.g. Sports Incharge, Lab Duty"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
