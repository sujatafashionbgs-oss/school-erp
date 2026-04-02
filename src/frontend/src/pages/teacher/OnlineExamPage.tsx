import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CLASSES, SECTIONS } from "@/data/classConfig";
import { Clock, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type QuestionType = "mcq" | "text";

interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options: [string, string, string, string];
  correct: "A" | "B" | "C" | "D";
}

interface Exam {
  id: number;
  title: string;
  subject: string;
  className: string;
  duration: number;
  questions: Question[];
}

const SUBJECTS = [
  "Mathematics",
  "Science",
  "Hindi",
  "English",
  "Social Studies",
  "Computer",
  "PE",
];

function emptyQuestion(id: number): Question {
  return { id, type: "mcq", text: "", options: ["", "", "", ""], correct: "A" };
}

export function OnlineExamPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [className, setClassName] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [duration, setDuration] = useState("");
  const [questions, setQuestions] = useState<Question[]>([emptyQuestion(1)]);
  const [nextQId, setNextQId] = useState(2);

  const addQuestion = () => {
    setQuestions((prev) => [...prev, emptyQuestion(nextQId)]);
    setNextQId((n) => n + 1);
  };

  const removeQuestion = (id: number) => {
    if (questions.length === 1) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: number, patch: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    );
  };

  const updateOption = (qId: number, idx: number, val: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        const opts = [...q.options] as [string, string, string, string];
        opts[idx] = val;
        return { ...q, options: opts };
      }),
    );
  };

  const handleCreate = () => {
    if (!title.trim() || !subject || !className || !duration) {
      toast.error("Please fill in all exam details.");
      return;
    }
    if (questions.some((q) => !q.text.trim())) {
      toast.error("All questions must have text.");
      return;
    }
    const exam: Exam = {
      id: Date.now(),
      title,
      subject,
      className,
      duration: Number(duration),
      questions,
    };
    setExams((prev) => [exam, ...prev]);
    setTitle("");
    setSubject("");
    setClassName("");
    setSectionName("");
    setDuration("");
    setQuestions([emptyQuestion(nextQId)]);
    setNextQId((n) => n + 1);
    toast.success("Exam created successfully!");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground">Online Exams</h1>

      {/* Create Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create New Exam</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Exam Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <Label>Exam Title</Label>
              <Input
                placeholder="e.g. Mid-Term Mathematics Exam"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Class</Label>
              <Select
                value={className}
                onValueChange={(v) => {
                  setClassName(v);
                  setSectionName("");
                }}
              >
                <SelectTrigger data-ocid="online_exam.class.select">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {CLASSES.map((c) => (
                    <SelectItem key={c} value={c}>
                      Class {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Section</Label>
              <Select
                value={sectionName}
                onValueChange={setSectionName}
                disabled={!className}
              >
                <SelectTrigger data-ocid="online_exam.section.select">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {(className === "XI" || className === "XII"
                    ? [...SECTIONS, "Science", "Commerce", "Arts"]
                    : SECTIONS
                  ).map((s) => (
                    <SelectItem key={s} value={s}>
                      Section {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                min="5"
                max="180"
                placeholder="e.g. 60"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-foreground text-sm">Questions</p>
              <Button size="sm" variant="outline" onClick={addQuestion}>
                <PlusCircle className="h-4 w-4 mr-1" /> Add Question
              </Button>
            </div>

            {questions.map((q, qi) => (
              <div
                key={q.id}
                className="border border-border rounded-xl p-4 space-y-3 bg-secondary/20"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Q{qi + 1}
                  </p>
                  <div className="flex items-center gap-2 flex-1">
                    <Select
                      value={q.type}
                      onValueChange={(v) =>
                        updateQuestion(q.id, { type: v as QuestionType })
                      }
                    >
                      <SelectTrigger className="w-28 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mcq">MCQ</SelectItem>
                        <SelectItem value="text">Text/Essay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeQuestion(q.id)}
                    disabled={questions.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-1">
                  <Input
                    placeholder="Question text"
                    value={q.text}
                    onChange={(e) =>
                      updateQuestion(q.id, { text: e.target.value })
                    }
                  />
                </div>

                {q.type === "mcq" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(["A", "B", "C", "D"] as const).map((opt, oi) => (
                      <div key={opt} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground w-5">
                          {opt}.
                        </span>
                        <Input
                          className="h-8 text-sm"
                          placeholder={`Option ${opt}`}
                          value={q.options[oi]}
                          onChange={(e) =>
                            updateOption(q.id, oi, e.target.value)
                          }
                        />
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={q.correct === opt}
                          onChange={() =>
                            updateQuestion(q.id, { correct: opt })
                          }
                          title={`Mark ${opt} as correct`}
                          className="cursor-pointer accent-primary"
                        />
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground col-span-2">
                      Select the radio button next to the correct answer.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button onClick={handleCreate} className="w-full sm:w-auto">
            Create Exam
          </Button>
        </CardContent>
      </Card>

      {/* Exam List */}
      {exams.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground">Created Exams</h2>
          {exams.map((e) => (
            <Card key={e.id}>
              <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4">
                <div>
                  <p className="font-medium text-foreground">{e.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {e.subject} · {e.className} · {e.questions.length} questions
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs flex items-center gap-1"
                  >
                    <Clock className="h-3 w-3" /> {e.duration} min
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
