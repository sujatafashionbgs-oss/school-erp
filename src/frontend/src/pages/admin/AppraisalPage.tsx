import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  APPRAISAL_CRITERIA,
  type Appraisal,
  mockAppraisals,
} from "@/data/mockAppraisals";
import {
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function getGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  return "C";
}

function gradeBadgeColor(grade?: string) {
  if (grade === "A+")
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  if (grade === "A")
    return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  if (grade === "B+")
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
  if (grade === "B")
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
  return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
}

function statusBadgeVariant(status: Appraisal["status"]) {
  if (status === "Completed") return "default";
  if (status === "Pending Manager Review") return "secondary";
  return "outline";
}

export function AppraisalPage() {
  const [appraisals, setAppraisals] = useState<Appraisal[]>(mockAppraisals);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selected, setSelected] = useState<Appraisal | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState("");

  const completed = appraisals.filter((a) => a.status === "Completed").length;
  const pendingSelf = appraisals.filter(
    (a) => a.status === "Pending Self Review",
  ).length;
  const pendingManager = appraisals.filter(
    (a) => a.status === "Pending Manager Review",
  ).length;

  function openReview(appraisal: Appraisal) {
    setSelected(appraisal);
    const init: Record<string, number> = {};
    for (const c of APPRAISAL_CRITERIA) {
      init[c.id] = appraisal.selfScores[c.id] ?? 10;
    }
    setScores(init);
    setComments("");
    setReviewOpen(true);
  }

  function submitReview() {
    if (!selected) return;
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const grade = getGrade(total);
    setAppraisals((prev) =>
      prev.map((a) =>
        a.id === selected.id
          ? {
              ...a,
              managerScores: scores,
              status: "Completed",
              overallGrade: grade,
              comments,
            }
          : a,
      ),
    );
    toast.success(`Review submitted. Grade: ${grade} (${total}/100)`);
    setReviewOpen(false);
  }

  function exportCSV() {
    const rows = [
      ["Name", "Designation", "Status", "Overall Score", "Grade", "Comments"],
      ...appraisals.map((a) => {
        const total = Object.values(a.managerScores).reduce((s, v) => s + v, 0);
        return [
          a.staffName,
          a.designation,
          a.status,
          a.status === "Completed" ? total : "",
          a.overallGrade ?? "",
          a.comments,
        ];
      }),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "staff_appraisals.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <style>
        {"@media print { .no-print { display: none !important; } }"}
      </style>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Staff Appraisal
          </h1>
          <p className="text-sm text-muted-foreground">
            Annual performance review for all teaching and non-teaching staff
          </p>
        </div>
        <div className="flex gap-2 no-print">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Download size={16} className="mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <FileSpreadsheet size={16} className="mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Staff",
            value: 45,
            icon: Users,
            color: "text-blue-600",
          },
          {
            label: "Completed",
            value: completed,
            icon: CheckCircle2,
            color: "text-green-600",
          },
          {
            label: "Pending Self Review",
            value: pendingSelf,
            icon: Clock,
            color: "text-amber-600",
          },
          {
            label: "Pending Manager Review",
            value: pendingManager,
            icon: Star,
            color: "text-purple-600",
          },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                </div>
                <s.icon size={28} className={s.color} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appraisal Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead className="no-print">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appraisals.map((apr, idx) => {
                const total = Object.values(apr.managerScores).reduce(
                  (s, v) => s + v,
                  0,
                );
                return (
                  <TableRow
                    key={apr.id}
                    data-ocid={`appraisal.item.${idx + 1}`}
                  >
                    <TableCell className="font-medium">
                      {apr.staffName}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {apr.designation}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(apr.status)}>
                        {apr.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {apr.status === "Completed" ? (
                        <div className="flex items-center gap-2">
                          <Progress value={total} className="w-20 h-2" />
                          <span className="text-sm font-medium">
                            {total}/100
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {apr.overallGrade && (
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${gradeBadgeColor(apr.overallGrade)}`}
                        >
                          {apr.overallGrade}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="no-print">
                      {apr.status === "Pending Manager Review" && (
                        <Button
                          size="sm"
                          onClick={() => openReview(apr)}
                          data-ocid={`appraisal.review.button.${idx + 1}`}
                        >
                          Start Review
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="appraisal.dialog"
        >
          <DialogHeader>
            <DialogTitle>Manager Review — {selected?.staffName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            {APPRAISAL_CRITERIA.map((c) => (
              <div key={c.id} className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm font-medium">{c.criterion}</Label>
                  <span className="text-sm font-bold text-primary">
                    {scores[c.id] ?? 10} / {c.maxScore}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={c.maxScore}
                  step={1}
                  value={[scores[c.id] ?? 10]}
                  onValueChange={([val]) =>
                    setScores((prev) => ({ ...prev, [c.id]: val }))
                  }
                />
                {selected?.selfScores[c.id] !== undefined && (
                  <p className="text-xs text-muted-foreground">
                    Self score: {selected.selfScores[c.id]}
                  </p>
                )}
              </div>
            ))}
            <div className="space-y-2">
              <Label>Comments</Label>
              <Textarea
                placeholder="Overall review comments..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                data-ocid="appraisal.comments.textarea"
              />
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">
                Total Score:{" "}
                <span className="text-primary font-bold">
                  {Object.values(scores).reduce((a, b) => a + b, 0)}/100
                </span>
                {" — Grade: "}
                <span
                  className={`font-bold ${gradeBadgeColor(getGrade(Object.values(scores).reduce((a, b) => a + b, 0)))}`}
                >
                  {getGrade(Object.values(scores).reduce((a, b) => a + b, 0))}
                </span>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewOpen(false)}
              data-ocid="appraisal.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={submitReview} data-ocid="appraisal.submit_button">
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
