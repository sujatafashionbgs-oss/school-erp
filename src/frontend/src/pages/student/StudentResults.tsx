import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { mockStudents } from "@/data/mockStudents";
import { useLoadingData } from "@/hooks/useLoadingData";
import { FileText } from "lucide-react";

export function StudentResults() {
  const { user } = useAuth();
  const { loading } = useLoadingData(null);

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const student =
    mockStudents.find((s) => s.admissionNo === user?.admissionNo) ||
    mockStudents[0];

  const results = [
    {
      exam: "Unit Test 1",
      math: 22,
      science: 23,
      hindi: 20,
      english: 21,
      ss: 19,
    },
    {
      exam: "Half Yearly",
      math: 87,
      science: 92,
      hindi: 78,
      english: 85,
      ss: 80,
    },
  ];

  return (
    <div className="space-y-5" data-ocid="student_results.page">
      <h1 className="text-2xl font-bold text-foreground">My Results</h1>
      <div className="bg-card border border-border rounded-2xl p-5">
        <p className="text-sm text-muted-foreground mb-4">
          {student.name} · Class {student.className}-{student.section}
        </p>
        {results.map((r, i) => (
          <div
            key={r.exam}
            className="mb-6"
            data-ocid={`student_results.item.${i + 1}`}
          >
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <FileText size={14} className="text-primary" />
              {r.exam}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                {
                  sub: "Math",
                  marks: r.math,
                  max: r.exam.includes("Test") ? 25 : 100,
                },
                {
                  sub: "Science",
                  marks: r.science,
                  max: r.exam.includes("Test") ? 25 : 100,
                },
                {
                  sub: "Hindi",
                  marks: r.hindi,
                  max: r.exam.includes("Test") ? 25 : 100,
                },
                {
                  sub: "English",
                  marks: r.english,
                  max: r.exam.includes("Test") ? 25 : 100,
                },
                {
                  sub: "S.St.",
                  marks: r.ss,
                  max: r.exam.includes("Test") ? 25 : 100,
                },
              ].map((s) => (
                <div
                  key={s.sub}
                  className="bg-secondary/50 rounded-xl p-3 text-center"
                >
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                  <p className="text-lg font-bold text-foreground">{s.marks}</p>
                  <p className="text-xs text-muted-foreground">/{s.max}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
