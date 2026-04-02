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
import { useAuth } from "@/context/AuthContext";
import {
  AlertCircle,
  CalendarX,
  CheckCircle2,
  PlusCircle,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const INITIAL_TEACHER_ASSIGNMENTS = [
  {
    id: 1,
    title: "Quadratic Equations Worksheet",
    subject: "Mathematics",
    className: "Class 9-A",
    dueDate: "2026-03-10",
  },
  {
    id: 2,
    title: "Newton's Laws Lab Report",
    subject: "Science",
    className: "Class 9-B",
    dueDate: "2026-03-20",
  },
  {
    id: 3,
    title: "Essay: Indian Independence",
    subject: "Social Studies",
    className: "Class 10-A",
    dueDate: "2026-04-15",
  },
  {
    id: 4,
    title: "Python Basics Exercise",
    subject: "Computer",
    className: "Class 8-C",
    dueDate: "2026-04-18",
  },
];

const MOCK_STUDENT_ASSIGNMENTS = [
  {
    id: 1,
    title: "Quadratic Equations Worksheet",
    subject: "Mathematics",
    dueDate: "2026-03-10",
    teacher: "Mr. Sharma",
  },
  {
    id: 2,
    title: "Newton's Laws Lab Report",
    subject: "Science",
    dueDate: "2026-03-20",
    teacher: "Ms. Gupta",
  },
  {
    id: 3,
    title: "Essay: Indian Independence",
    subject: "Social Studies",
    dueDate: "2026-04-15",
    teacher: "Mr. Patel",
  },
  {
    id: 4,
    title: "Python Basics Exercise",
    subject: "Computer",
    dueDate: "2026-04-18",
    teacher: "Ms. Singh",
  },
];

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE = 5 * 1024 * 1024;

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Only PDF, JPG, or PNG files are allowed.";
  }
  if (file.size > MAX_SIZE) {
    return "File must be under 5MB.";
  }
  return null;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isPastDeadline(dueDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return today > due;
}

function FileUploadField({ id, label }: { id: string; label: string }) {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) {
      setError(err);
      setFileName(null);
      e.target.value = "";
    } else {
      setError(null);
      setFileName(file.name);
    }
  };

  return (
    <div className="space-y-1" data-ocid="assignment.upload_button">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleChange}
        className="cursor-pointer w-full text-foreground"
      />
      {fileName && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-green-500" />
          {fileName}
        </p>
      )}
      {error && (
        <div
          className="flex items-start gap-2 w-full bg-destructive/10 border border-destructive/30 text-destructive rounded-md px-3 py-2 text-sm"
          data-ocid="assignment.error_state"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

type Assignment = {
  id: number;
  title: string;
  subject: string;
  className: string;
  dueDate: string;
};

function TeacherView() {
  const [showForm, setShowForm] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>(
    INITIAL_TEACHER_ASSIGNMENTS,
  );
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [className, setClassName] = useState("");
  const [dueDate, setDueDate] = useState("");

  const resetForm = () => {
    setTitle("");
    setSubject("");
    setClassName("");
    setDueDate("");
  };

  const handleCreate = () => {
    if (!title || !subject || !className || !dueDate) {
      toast.error("Please fill all required fields");
      return;
    }
    const newAssignment: Assignment = {
      id: Date.now(),
      title,
      subject,
      className,
      dueDate,
    };
    setAssignments((prev) => [newAssignment, ...prev]);
    toast.success("Assignment created successfully!");
    setShowForm(false);
    resetForm();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Assignments</h1>
        <Button
          onClick={() => {
            setShowForm((v) => !v);
            resetForm();
          }}
          data-ocid="assignment.primary_button"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {showForm && (
        <Card data-ocid="assignment.panel">
          <CardHeader>
            <CardTitle className="text-base">New Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="assignment-title">Title</Label>
              <Input
                id="assignment-title"
                placeholder="Assignment title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                data-ocid="assignment.input"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="assignment-subject">Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger
                    id="assignment-subject"
                    data-ocid="assignment.select"
                  >
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Mathematics",
                      "Science",
                      "Hindi",
                      "English",
                      "Social Studies",
                      "Computer",
                      "PE",
                      "Art",
                    ].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="assignment-class">Class</Label>
                <Select value={className} onValueChange={setClassName}>
                  <SelectTrigger
                    id="assignment-class"
                    data-ocid="assignment.select"
                  >
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Class 8-A",
                      "Class 8-B",
                      "Class 9-A",
                      "Class 9-B",
                      "Class 10-A",
                      "Class 10-B",
                    ].map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="assignment-due">Due Date</Label>
              <Input
                id="assignment-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                data-ocid="assignment.input"
              />
            </div>
            <FileUploadField
              id="assignment-attachment"
              label="Attachment (optional)"
            />
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleCreate}
                data-ocid="assignment.submit_button"
              >
                Create
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                data-ocid="assignment.cancel_button"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {assignments.map((a, i) => (
          <Card key={a.id} data-ocid={`assignment.item.${i + 1}`}>
            <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4">
              <div>
                <p className="font-medium text-foreground">{a.title}</p>
                <p className="text-sm text-muted-foreground">
                  {a.subject} · {a.className}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    isPastDeadline(a.dueDate) ? "destructive" : "outline"
                  }
                  className="text-xs"
                >
                  {isPastDeadline(a.dueDate) ? "Closed" : `Due ${a.dueDate}`}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StudentView() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<number, string>>({});

  const handleFile = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) {
      setErrors((prev) => ({ ...prev, [id]: err }));
      e.target.value = "";
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-foreground">My Assignments</h1>
      <div className="space-y-3">
        {MOCK_STUDENT_ASSIGNMENTS.map((a, i) => {
          const past = isPastDeadline(a.dueDate);
          const isSubmitted = submitted.includes(a.id);

          return (
            <Card key={a.id} data-ocid={`assignment.item.${i + 1}`}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground">{a.title}</p>
                      {isSubmitted && (
                        <Badge
                          className="bg-green-500/20 text-green-700 border-green-500/30 text-xs"
                          data-ocid="assignment.success_state"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Submitted
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {a.subject} · {a.teacher} · Due {a.dueDate}
                    </p>
                  </div>

                  {isSubmitted ? null : past ? (
                    <div
                      className="flex items-center gap-1.5 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-1.5"
                      data-ocid="assignment.deadline_passed"
                    >
                      <CalendarX className="h-4 w-4 shrink-0" />
                      <span>Deadline passed on {formatDate(a.dueDate)}</span>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setExpanded(expanded === a.id ? null : a.id)
                      }
                      data-ocid={`assignment.button.${i + 1}`}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Submit
                    </Button>
                  )}
                </div>

                {expanded === a.id && !isSubmitted && !past && (
                  <div className="border-t border-border pt-3 space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor={`file-submit-${a.id}`}>
                        Upload File (PDF, JPG, PNG · max 5MB)
                      </Label>
                      <Input
                        id={`file-submit-${a.id}`}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFile(a.id, e)}
                        className="cursor-pointer w-full"
                        data-ocid="assignment.upload_button"
                      />
                      {errors[a.id] && (
                        <div
                          className="flex items-start gap-2 w-full bg-destructive/10 border border-destructive/30 text-destructive rounded-md px-3 py-2 text-sm"
                          data-ocid="assignment.error_state"
                        >
                          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                          <span>{errors[a.id]}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={!!errors[a.id]}
                        onClick={() => {
                          setSubmitted((prev) => [...prev, a.id]);
                          setExpanded(null);
                        }}
                        data-ocid="assignment.submit_button"
                      >
                        Confirm Submit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setExpanded(null)}
                        data-ocid="assignment.cancel_button"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function AssignmentsPage({
  navigate: _navigate,
}: { navigate: (to: string) => void }) {
  const { user } = useAuth();
  if (user?.role === "teacher") return <TeacherView />;
  return <StudentView />;
}
