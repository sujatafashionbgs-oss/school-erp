import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type QuestionType = "mcq" | "text";

interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options?: [string, string, string, string];
  correct?: "A" | "B" | "C" | "D";
}

interface Exam {
  id: number;
  title: string;
  subject: string;
  className: string;
  duration: number; // minutes
  questions: Question[];
}

const MOCK_EXAMS: Exam[] = [
  {
    id: 1,
    title: "Mathematics Unit Test",
    subject: "Mathematics",
    className: "Class 9-A",
    duration: 30,
    questions: [
      {
        id: 1,
        type: "mcq",
        text: "What is the value of x in 2x + 4 = 10?",
        options: ["2", "3", "4", "5"],
        correct: "B",
      },
      {
        id: 2,
        type: "mcq",
        text: "Which of the following is a prime number?",
        options: ["9", "15", "17", "21"],
        correct: "C",
      },
      {
        id: 3,
        type: "mcq",
        text: "The area of a circle with radius 7 cm is?",
        options: ["154 cm²", "176 cm²", "144 cm²", "196 cm²"],
        correct: "A",
      },
      {
        id: 4,
        type: "text",
        text: "Explain the Pythagorean theorem with an example.",
      },
    ],
  },
  {
    id: 2,
    title: "Science Quiz",
    subject: "Science",
    className: "Class 9-A",
    duration: 20,
    questions: [
      {
        id: 1,
        type: "mcq",
        text: "Newton's First Law is also known as?",
        options: [
          "Law of Gravity",
          "Law of Inertia",
          "Law of Motion",
          "Law of Force",
        ],
        correct: "B",
      },
      {
        id: 2,
        type: "mcq",
        text: "The chemical symbol for water is?",
        options: ["CO₂", "NaCl", "H₂O", "O₂"],
        correct: "C",
      },
      {
        id: 3,
        type: "text",
        text: "Describe the process of photosynthesis in your own words.",
      },
    ],
  },
];

type View = "list" | "attempt" | "results";

export function StudentOnlineExamPage() {
  const [view, setView] = useState<View>("list");
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [attemptedExams, setAttemptedExams] = useState<number[]>([]);

  const startExam = (exam: Exam) => {
    setActiveExam(exam);
    setAnswers({});
    setTimeLeft(exam.duration * 60);
    setView("attempt");
  };

  const submitExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (activeExam) setAttemptedExams((prev) => [...prev, activeExam.id]);
    setView("results");
  };

  useEffect(() => {
    if (view !== "attempt") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (activeExam) setAttemptedExams((prev) => [...prev, activeExam.id]);
          setView("results");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [view, activeExam]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ----- LIST VIEW -----
  if (view === "list") {
    return (
      <div className="space-y-5 max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground">Online Exams</h1>
        <div className="space-y-3">
          {MOCK_EXAMS.map((exam) => {
            const attempted = attemptedExams.includes(exam.id);
            return (
              <Card key={exam.id}>
                <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5">
                  <div>
                    <p className="font-semibold text-foreground">
                      {exam.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {exam.subject} · {exam.className} ·{" "}
                      {exam.questions.length} questions
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge
                        variant="outline"
                        className="text-xs flex items-center gap-1"
                      >
                        <Clock className="h-3 w-3" /> {exam.duration} min
                      </Badge>
                      {attempted && (
                        <Badge className="bg-green-500/20 text-green-700 border-green-500/30 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Attempted
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant={attempted ? "outline" : "default"}
                    size="sm"
                    onClick={() => startExam(exam)}
                  >
                    {attempted ? "Retake" : "Start Exam"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // ----- ATTEMPT VIEW -----
  if (view === "attempt" && activeExam) {
    const urgentTime = timeLeft < 60;
    return (
      <div className="space-y-5 max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {activeExam.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {activeExam.subject} · {activeExam.className}
            </p>
          </div>
          <div
            className={`flex items-center gap-2 font-mono text-lg font-bold px-4 py-2 rounded-xl border ${
              urgentTime
                ? "text-destructive bg-destructive/10 border-destructive/30"
                : "text-foreground bg-card border-border"
            }`}
          >
            <Clock className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="space-y-4">
          {activeExam.questions.map((q, qi) => (
            <Card key={q.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Q{qi + 1}. {q.text}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {q.type === "mcq" && q.options ? (
                  <div className="space-y-2">
                    {(["A", "B", "C", "D"] as const).map((opt, oi) => (
                      <label
                        key={opt}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                          answers[q.id] === opt
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-secondary/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={opt}
                          checked={answers[q.id] === opt}
                          onChange={() =>
                            setAnswers((prev) => ({ ...prev, [q.id]: opt }))
                          }
                          className="accent-primary"
                        />
                        <span className="text-xs font-bold text-muted-foreground w-5">
                          {opt}.
                        </span>
                        <span className="text-sm text-foreground">
                          {q.options![oi]}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <Textarea
                    placeholder="Write your answer here..."
                    value={answers[q.id] || ""}
                    onChange={(e) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [q.id]: e.target.value,
                      }))
                    }
                    rows={4}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Button onClick={submitExam} className="w-full sm:w-auto">
          Submit Exam
        </Button>
      </div>
    );
  }

  // ----- RESULTS VIEW -----
  if (view === "results" && activeExam) {
    const mcqQs = activeExam.questions.filter((q) => q.type === "mcq");
    const correct = mcqQs.filter((q) => answers[q.id] === q.correct).length;
    const totalMcq = mcqQs.length;
    const pct = totalMcq > 0 ? Math.round((correct / totalMcq) * 100) : 0;
    const grade =
      pct >= 90
        ? "A+"
        : pct >= 80
          ? "A"
          : pct >= 70
            ? "B"
            : pct >= 60
              ? "C"
              : "D";

    return (
      <div className="space-y-5 max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground">Exam Results</h1>

        {/* Score card */}
        <Card>
          <CardContent className="pt-5 flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center">
              <p className="text-5xl font-bold text-primary">{grade}</p>
              <p className="text-xs text-muted-foreground mt-1">Grade</p>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-xl font-bold text-foreground">
                {correct} / {totalMcq} MCQ correct
              </p>
              <p className="text-sm text-muted-foreground">
                {pct}% score on MCQ questions
              </p>
              {activeExam.questions.some((q) => q.type === "text") && (
                <p className="text-xs text-muted-foreground">
                  Text answers pending teacher review
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question breakdown */}
        <div className="space-y-3">
          {activeExam.questions.map((q, qi) => {
            const userAnswer = answers[q.id] || "—";
            const isCorrect =
              q.type === "mcq" ? userAnswer === q.correct : null;
            return (
              <Card key={q.id}>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-start gap-2">
                    {q.type === "mcq" ? (
                      isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      )
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm font-medium text-foreground">
                      Q{qi + 1}. {q.text}
                    </p>
                  </div>
                  {q.type === "mcq" ? (
                    <div className="flex gap-4 text-xs ml-6">
                      <span
                        className={
                          isCorrect ? "text-green-600" : "text-destructive"
                        }
                      >
                        Your answer: <strong>{userAnswer}</strong>
                      </span>
                      {!isCorrect && (
                        <span className="text-green-600">
                          Correct: <strong>{q.correct}</strong>
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="ml-6">
                      <p className="text-xs text-muted-foreground">
                        Your answer:
                      </p>
                      <p className="text-sm text-foreground bg-secondary/30 rounded-lg p-2 mt-1">
                        {answers[q.id] || (
                          <em className="text-muted-foreground">No answer</em>
                        )}
                      </p>
                      <Badge variant="outline" className="text-xs mt-2">
                        Pending review
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Button variant="outline" onClick={() => setView("list")}>
          Back to Exams
        </Button>
      </div>
    );
  }

  return null;
}
