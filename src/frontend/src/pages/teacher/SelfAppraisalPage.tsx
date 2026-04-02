import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  APPRAISAL_CRITERIA,
  type Appraisal,
  mockAppraisals,
} from "@/data/mockAppraisals";
import { CheckCircle2, Clock, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SelfAppraisalPage() {
  const initial =
    mockAppraisals.find((a) => a.status === "Pending Self Review") ||
    mockAppraisals[0];
  const [appraisal, setAppraisal] = useState<Appraisal>(initial);
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const s: Record<string, number> = {};
    for (const c of APPRAISAL_CRITERIA) {
      s[c.id] = 10;
    }
    return s;
  });
  const [comments, setComments] = useState("");

  function submitSelf() {
    setAppraisal((prev) => ({
      ...prev,
      selfScores: scores,
      status: "Pending Manager Review",
    }));
    toast.success("Self appraisal submitted for manager review.");
  }

  if (appraisal.status === "Pending Self Review") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Appraisal — Self Review</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Academic Year {appraisal.year} · Rate yourself honestly on each
            criterion
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance Criteria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {APPRAISAL_CRITERIA.map((c) => (
              <div key={c.id} className="space-y-2">
                <div className="flex justify-between">
                  <Label className="font-medium">{c.criterion}</Label>
                  <span className="text-sm font-bold text-primary">
                    {scores[c.id]} / {c.maxScore}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={c.maxScore}
                  step={1}
                  value={[scores[c.id]]}
                  onValueChange={([val]) =>
                    setScores((prev) => ({ ...prev, [c.id]: val }))
                  }
                />
                <p className="text-xs text-muted-foreground">{c.category}</p>
              </div>
            ))}
            <div className="space-y-2">
              <Label>Additional Comments</Label>
              <Textarea
                placeholder="Add any comments about your performance..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
              />
            </div>
            <div className="p-3 bg-muted rounded-lg flex justify-between items-center">
              <span className="text-sm font-medium">Total Self Score</span>
              <span className="text-xl font-bold text-primary">
                {Object.values(scores).reduce((a, b) => a + b, 0)}/100
              </span>
            </div>
          </CardContent>
        </Card>
        <Button
          onClick={submitSelf}
          className="w-full"
          data-ocid="appraisal.submit_button"
        >
          Submit Self Appraisal
        </Button>
      </div>
    );
  }

  if (appraisal.status === "Pending Manager Review") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">My Appraisal</h1>
        <Card className="border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-4 py-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock size={32} className="text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Self Review Submitted</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Your appraisal is now awaiting manager review
                </p>
              </div>
              <div className="w-full max-w-xs space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-white" />
                  </div>
                  <span className="text-sm">Self review completed</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
                    <Clock size={12} className="text-white" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Manager review — Pending
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                    <Star size={12} className="text-muted-foreground" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Final grade — Not yet assigned
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Your Self Scores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {APPRAISAL_CRITERIA.map((c) => (
              <div key={c.id} className="flex items-center gap-3">
                <span className="text-sm w-48">{c.criterion}</span>
                <Progress
                  value={((appraisal.selfScores[c.id] ?? 0) / c.maxScore) * 100}
                  className="flex-1 h-2"
                />
                <span className="text-sm font-medium w-12 text-right">
                  {appraisal.selfScores[c.id] ?? 0}/{c.maxScore}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Completed
  const total = Object.values(appraisal.managerScores).reduce(
    (a, b) => a + b,
    0,
  );
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Appraisal — Results</h1>
      <Card className="border-green-200 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <p className="text-3xl font-bold text-primary">{total}/100</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Grade</p>
              <Badge className="text-2xl px-4 py-2 mt-1">
                {appraisal.overallGrade}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Detailed Scores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {APPRAISAL_CRITERIA.map((c) => (
            <div key={c.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{c.criterion}</span>
                <span className="text-muted-foreground">
                  Self: {appraisal.selfScores[c.id] ?? 0} · Manager:{" "}
                  {appraisal.managerScores[c.id] ?? 0}
                </span>
              </div>
              <Progress
                value={
                  ((appraisal.managerScores[c.id] ?? 0) / c.maxScore) * 100
                }
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>
      {appraisal.comments && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Manager Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {appraisal.comments}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
