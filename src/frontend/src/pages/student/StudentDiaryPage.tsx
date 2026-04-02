import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "Hindi",
  "Social Studies",
  "Computer",
];

interface DiaryEntry {
  notes: string;
  teacherRemark: string;
  homework: string;
}

type DiaryData = Record<string, Record<string, DiaryEntry>>;

// Mock data: dateKey -> subject -> entry
const mockDiaryData: DiaryData = {
  "2026-03-28": {
    Mathematics: {
      notes: "Revised Chapter 4 — Quadratic Equations. Solved 10 problems.",
      teacherRemark: "Good effort. Practice more word problems.",
      homework: "Ex 4.3 Q1-Q5",
    },
    Science: {
      notes: "Learned about Newton's Laws of Motion.",
      teacherRemark: "Excellent participation in class.",
      homework: "Draw a diagram of force and friction",
    },
    English: {
      notes: "Read Chapter 6 of the prose.",
      teacherRemark: "No remarks",
      homework: "Write a 100-word summary",
    },
    Hindi: {
      notes: "",
      teacherRemark: "No remarks for this date",
      homework: "",
    },
    "Social Studies": {
      notes: "Map work — rivers of India.",
      teacherRemark: "Complete the river worksheet.",
      homework: "Label rivers on blank map",
    },
    Computer: {
      notes: "Practiced Python loops and conditionals.",
      teacherRemark: "No remarks for this date",
      homework: "",
    },
  },
  "2026-03-29": {
    Mathematics: {
      notes: "Worked on factorisation.",
      teacherRemark: "No remarks for this date",
      homework: "",
    },
    Science: {
      notes: "Physics experiment — inclined plane.",
      teacherRemark: "Good lab work today.",
      homework: "Write experiment report",
    },
    English: {
      notes: "Grammar — Active and Passive Voice.",
      teacherRemark: "No remarks for this date",
      homework: "Ex 2.4 all questions",
    },
    Hindi: {
      notes: "Poem recitation practice.",
      teacherRemark: "Memorise verses 5–8.",
      homework: "Recitation practice at home",
    },
    "Social Studies": {
      notes: "",
      teacherRemark: "No remarks for this date",
      homework: "",
    },
    Computer: {
      notes: "HTML forms and input elements.",
      teacherRemark: "No remarks for this date",
      homework: "Build a simple HTML form",
    },
  },
  "2026-03-31": {
    Mathematics: {
      notes: "",
      teacherRemark: "Complete worksheet submitted.",
      homework: "",
    },
    Science: {
      notes: "Chemical bonding — ionic and covalent.",
      teacherRemark: "Read chapter 4 before next class.",
      homework: "Study notes Q1-Q8",
    },
    English: {
      notes: "Essay writing technique.",
      teacherRemark: "Very good essay structure!",
      homework: "",
    },
    Hindi: {
      notes: "",
      teacherRemark: "No remarks for this date",
      homework: "",
    },
    "Social Studies": {
      notes: "Democracy and types of government.",
      teacherRemark: "No remarks for this date",
      homework: "",
    },
    Computer: {
      notes: "CSS styling basics.",
      teacherRemark: "No remarks for this date",
      homework: "Style the HTML form from yesterday",
    },
  },
  "2026-04-01": {
    Mathematics: {
      notes: "Solved practice test paper.",
      teacherRemark: "78/100 in test. Improve speed.",
      homework: "",
    },
    Science: {
      notes: "",
      teacherRemark: "No remarks for this date",
      homework: "",
    },
    English: {
      notes: "Reading comprehension exercise.",
      teacherRemark: "No remarks for this date",
      homework: "",
    },
    Hindi: {
      notes: "Essay on प्रकृति.",
      teacherRemark: "Well written!",
      homework: "",
    },
    "Social Studies": {
      notes: "Revision of Chapter 3.",
      teacherRemark: "No remarks for this date",
      homework: "",
    },
    Computer: {
      notes: "JavaScript variables and functions.",
      teacherRemark: "No remarks for this date",
      homework: "Write a JS calculator",
    },
  },
  "2026-04-02": {
    Mathematics: {
      notes: "Started Chapter 5 — Arithmetic Progressions.",
      teacherRemark: "No remarks for this date",
      homework: "Ex 5.1 Q1-Q3",
    },
    Science: {
      notes: "Periodic table revision.",
      teacherRemark: "Memorise first 30 elements.",
      homework: "Element flashcards",
    },
    English: {
      notes: "Poem — 'The Road Not Taken'.",
      teacherRemark: "Wonderful analysis of the poem.",
      homework: "",
    },
    Hindi: {
      notes: "",
      teacherRemark: "No remarks for this date",
      homework: "",
    },
    "Social Studies": {
      notes: "",
      teacherRemark: "No remarks for this date",
      homework: "",
    },
    Computer: {
      notes: "Completed CSS project.",
      teacherRemark: "Submitted on time. Good work!",
      homework: "",
    },
  },
};

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function StudentDiaryPage() {
  const today = new Date().toISOString().split("T")[0];
  const [currentDate, setCurrentDate] = useState("2026-04-02");
  const [notes, setNotes] = useState<Record<string, string>>({});

  const isToday = currentDate === today;
  const isFuture = currentDate > today;
  const dayData = mockDiaryData[currentDate] ?? {};

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getNoteKey = (subject: string) => `${currentDate}::${subject}`;

  const handleSave = (subject: string) => {
    toast.success(`Notes saved for ${subject}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen size={24} /> My Diary
        </h1>
        <p className="text-muted-foreground text-sm">
          Your personal daily diary — notes, teacher remarks, and homework
        </p>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-card border rounded-xl px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentDate((d) => addDays(d, -1))}
          data-ocid="diary.prev.button"
        >
          <ChevronLeft size={18} />
        </Button>
        <div className="text-center">
          <p className="font-semibold">{formatDate(currentDate)}</p>
          {isToday && (
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs">
              Today
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentDate((d) => addDays(d, 1))}
          disabled={isFuture}
          data-ocid="diary.next.button"
        >
          <ChevronRight size={18} />
        </Button>
      </div>

      <Tabs defaultValue="Mathematics">
        <TabsList className="flex-wrap h-auto gap-1">
          {SUBJECTS.map((sub) => (
            <TabsTrigger
              key={sub}
              value={sub}
              className="text-xs"
              data-ocid="diary.subject.tab"
            >
              {sub}
            </TabsTrigger>
          ))}
        </TabsList>

        {SUBJECTS.map((sub) => {
          const entry: DiaryEntry = dayData[sub] ?? {
            notes: "",
            teacherRemark: "No remarks for this date",
            homework: "",
          };
          const noteKey = getNoteKey(sub);
          const currentNote = notes[noteKey] ?? entry.notes;

          return (
            <TabsContent key={sub} value={sub} className="mt-4 space-y-4">
              {/* My Notes */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">
                    📝 My Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Textarea
                    placeholder={`Write your notes for ${sub}...`}
                    value={currentNote}
                    onChange={(e) =>
                      setNotes((prev) => ({
                        ...prev,
                        [noteKey]: e.target.value,
                      }))
                    }
                    className="min-h-24"
                    data-ocid="diary.notes.textarea"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSave(sub)}
                    data-ocid="diary.save.button"
                  >
                    <Save size={13} className="mr-1" /> Save Notes
                  </Button>
                </CardContent>
              </Card>

              {/* Teacher Remarks */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">
                    🏫 Teacher Remarks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {entry.teacherRemark &&
                  entry.teacherRemark !== "No remarks for this date" ? (
                    <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2">
                      <p className="text-sm">{entry.teacherRemark}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No remarks for this date
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Homework */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">
                    📚 Homework
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {entry.homework ? (
                    <div className="bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-800 rounded-lg px-3 py-2">
                      <p className="text-sm">{entry.homework}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No homework assigned for this date
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
