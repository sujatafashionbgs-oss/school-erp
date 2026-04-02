import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Edit2, ListChecks } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Chapter = {
  id: string;
  name: string;
  totalPeriods: number;
  completedPeriods: number;
};
type Subject = { name: string; chapters: Chapter[] };
type ClassSyllabus = { className: string; subjects: Subject[] };

const initialSyllabus: ClassSyllabus[] = [
  {
    className: "Class 10",
    subjects: [
      {
        name: "Mathematics",
        chapters: [
          {
            id: "c1",
            name: "Real Numbers",
            totalPeriods: 8,
            completedPeriods: 8,
          },
          {
            id: "c2",
            name: "Polynomials",
            totalPeriods: 6,
            completedPeriods: 5,
          },
          {
            id: "c3",
            name: "Linear Equations",
            totalPeriods: 10,
            completedPeriods: 7,
          },
          {
            id: "c4",
            name: "Quadratic Equations",
            totalPeriods: 8,
            completedPeriods: 3,
          },
        ],
      },
      {
        name: "Physics",
        chapters: [
          {
            id: "c5",
            name: "Light – Reflection",
            totalPeriods: 10,
            completedPeriods: 10,
          },
          { id: "c6", name: "Human Eye", totalPeriods: 8, completedPeriods: 6 },
          {
            id: "c7",
            name: "Electricity",
            totalPeriods: 12,
            completedPeriods: 8,
          },
          {
            id: "c8",
            name: "Magnetic Effects",
            totalPeriods: 10,
            completedPeriods: 4,
          },
        ],
      },
      {
        name: "Chemistry",
        chapters: [
          {
            id: "c9",
            name: "Chemical Reactions",
            totalPeriods: 8,
            completedPeriods: 8,
          },
          {
            id: "c10",
            name: "Acids & Bases",
            totalPeriods: 8,
            completedPeriods: 7,
          },
          {
            id: "c11",
            name: "Metals & Non-metals",
            totalPeriods: 10,
            completedPeriods: 5,
          },
          {
            id: "c12",
            name: "Carbon Compounds",
            totalPeriods: 10,
            completedPeriods: 2,
          },
        ],
      },
    ],
  },
  {
    className: "Class 9",
    subjects: [
      {
        name: "Mathematics",
        chapters: [
          {
            id: "c13",
            name: "Number Systems",
            totalPeriods: 8,
            completedPeriods: 8,
          },
          {
            id: "c14",
            name: "Polynomials",
            totalPeriods: 7,
            completedPeriods: 7,
          },
          {
            id: "c15",
            name: "Coordinate Geometry",
            totalPeriods: 6,
            completedPeriods: 4,
          },
          {
            id: "c16",
            name: "Linear Equations",
            totalPeriods: 8,
            completedPeriods: 3,
          },
        ],
      },
      {
        name: "Science",
        chapters: [
          {
            id: "c17",
            name: "Matter in Our Surroundings",
            totalPeriods: 8,
            completedPeriods: 8,
          },
          {
            id: "c18",
            name: "Is Matter Around Us Pure",
            totalPeriods: 8,
            completedPeriods: 6,
          },
          {
            id: "c19",
            name: "Atoms and Molecules",
            totalPeriods: 10,
            completedPeriods: 7,
          },
          {
            id: "c20",
            name: "Structure of Atom",
            totalPeriods: 8,
            completedPeriods: 4,
          },
        ],
      },
    ],
  },
  {
    className: "Class 8",
    subjects: [
      {
        name: "Mathematics",
        chapters: [
          {
            id: "c21",
            name: "Rational Numbers",
            totalPeriods: 7,
            completedPeriods: 7,
          },
          {
            id: "c22",
            name: "Linear Equations",
            totalPeriods: 6,
            completedPeriods: 6,
          },
          {
            id: "c23",
            name: "Squares & Square Roots",
            totalPeriods: 8,
            completedPeriods: 5,
          },
          {
            id: "c24",
            name: "Algebraic Expressions",
            totalPeriods: 8,
            completedPeriods: 3,
          },
        ],
      },
    ],
  },
];

function pct(completed: number, total: number) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function SyllabusPage() {
  const [syllabus, setSyllabus] = useState<ClassSyllabus[]>(initialSyllabus);
  const [classFilter, setClassFilter] = useState("all");
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const allChapters = syllabus.flatMap((c) =>
    c.subjects.flatMap((s) => s.chapters),
  );
  const totalPeriods = allChapters.reduce((a, c) => a + c.totalPeriods, 0);
  const totalCompleted = allChapters.reduce(
    (a, c) => a + c.completedPeriods,
    0,
  );
  const overallPct = pct(totalCompleted, totalPeriods);

  const startEdit = (chapterId: string, current: number) => {
    setEditing(chapterId);
    setEditValue(String(current));
  };

  const saveEdit = (chapterId: string, maxPeriods: number) => {
    const val = Math.min(Math.max(0, Number(editValue)), maxPeriods);
    setSyllabus((prev) =>
      prev.map((cls) => ({
        ...cls,
        subjects: cls.subjects.map((subj) => ({
          ...subj,
          chapters: subj.chapters.map((ch) =>
            ch.id === chapterId ? { ...ch, completedPeriods: val } : ch,
          ),
        })),
      })),
    );
    setEditing(null);
    toast.success("Progress updated!");
  };

  return (
    <div className="space-y-6" data-ocid="syllabus.page">
      <div className="flex items-center gap-3">
        <ListChecks className="text-primary" size={24} />
        <h1 className="text-2xl font-bold text-foreground">
          Syllabus Management
        </h1>
      </div>

      {/* Overall coverage */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-base font-semibold text-foreground">
              Overall Syllabus Coverage
            </p>
            <p className="text-sm text-muted-foreground">
              {totalCompleted} / {totalPeriods} periods completed
            </p>
          </div>
          <Badge
            variant={
              overallPct >= 75
                ? "default"
                : overallPct >= 50
                  ? "secondary"
                  : "destructive"
            }
          >
            {overallPct}%
          </Badge>
        </div>
        <Progress value={overallPct} className="h-3" />
        <div className="grid grid-cols-3 gap-3 mt-4">
          {syllabus.map((cls) => {
            const chs = cls.subjects.flatMap((s) => s.chapters);
            const total = chs.reduce((a, c) => a + c.totalPeriods, 0);
            const done = chs.reduce((a, c) => a + c.completedPeriods, 0);
            const p = pct(done, total);
            return (
              <div key={cls.className} className="bg-muted/40 rounded-xl p-3">
                <p className="text-sm font-medium text-foreground">
                  {cls.className}
                </p>
                <p className="text-xs text-muted-foreground">
                  {done}/{total} periods
                </p>
                <Progress value={p} className="h-1.5 mt-1" />
                <p className="text-xs font-semibold text-foreground mt-1">
                  {p}%
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Class filter */}
      <div className="flex items-center gap-3">
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger
            className="w-48"
            data-ocid="syllabus.class_filter.select"
          >
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {syllabus.map((cls) => (
              <SelectItem key={cls.className} value={cls.className}>
                {cls.className}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Accordion tree */}
      <Accordion type="multiple" className="space-y-2">
        {syllabus
          .filter(
            (cls) => classFilter === "all" || cls.className === classFilter,
          )
          .map((cls, ci) => {
            const chs = cls.subjects.flatMap((s) => s.chapters);
            const total = chs.reduce((a, c) => a + c.totalPeriods, 0);
            const done = chs.reduce((a, c) => a + c.completedPeriods, 0);
            return (
              <AccordionItem
                key={cls.className}
                value={cls.className}
                className="bg-card border border-border rounded-2xl px-4"
                data-ocid={`syllabus.item.${ci + 1}`}
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 flex-1 mr-4">
                    <span className="font-semibold text-foreground">
                      {cls.className}
                    </span>
                    <Badge variant="secondary">
                      {pct(done, total)}% complete
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 pb-2">
                    {cls.subjects.map((subj) => {
                      const sDone = subj.chapters.reduce(
                        (a, c) => a + c.completedPeriods,
                        0,
                      );
                      const sTotal = subj.chapters.reduce(
                        (a, c) => a + c.totalPeriods,
                        0,
                      );
                      return (
                        <div key={subj.name}>
                          <div className="flex items-center gap-2 mb-3">
                            <p className="font-semibold text-foreground">
                              {subj.name}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {pct(sDone, sTotal)}%
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {subj.chapters.map((ch) => {
                              const p = pct(
                                ch.completedPeriods,
                                ch.totalPeriods,
                              );
                              return (
                                <div
                                  key={ch.id}
                                  className="flex items-center gap-3 bg-muted/30 rounded-xl p-3"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="text-sm font-medium text-foreground">
                                        {ch.name}
                                      </p>
                                      {p === 100 && (
                                        <Check
                                          size={14}
                                          className="text-green-500"
                                        />
                                      )}
                                    </div>
                                    <Progress value={p} className="h-1.5" />
                                  </div>
                                  <div className="text-right shrink-0 w-24">
                                    {editing === ch.id ? (
                                      <div className="flex items-center gap-1">
                                        <Input
                                          type="number"
                                          min={0}
                                          max={ch.totalPeriods}
                                          value={editValue}
                                          onChange={(e) =>
                                            setEditValue(e.target.value)
                                          }
                                          className="h-7 w-14 text-xs"
                                        />
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-7 w-7"
                                          onClick={() =>
                                            saveEdit(ch.id, ch.totalPeriods)
                                          }
                                        >
                                          <Check size={12} />
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1 justify-end">
                                        <span className="text-xs text-muted-foreground">
                                          {ch.completedPeriods}/
                                          {ch.totalPeriods}
                                        </span>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-6 w-6"
                                          onClick={() =>
                                            startEdit(
                                              ch.id,
                                              ch.completedPeriods,
                                            )
                                          }
                                          data-ocid="syllabus.edit_button"
                                        >
                                          <Edit2 size={11} />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
      </Accordion>
    </div>
  );
}
