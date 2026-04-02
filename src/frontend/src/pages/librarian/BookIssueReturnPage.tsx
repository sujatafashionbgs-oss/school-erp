import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface IssuedRecord {
  id: string;
  studentName: string;
  admissionNo: string;
  bookTitle: string;
  issueDate: string;
  dueDate: string;
  status: "Issued" | "Overdue";
}

const initialIssued: IssuedRecord[] = [
  {
    id: "r1",
    studentName: "Aarav Sharma",
    admissionNo: "2024-1045",
    bookTitle: "Physics for Class XII",
    issueDate: "2024-11-01",
    dueDate: "2024-11-15",
    status: "Overdue",
  },
  {
    id: "r2",
    studentName: "Priya Singh",
    admissionNo: "2024-1046",
    bookTitle: "English Grammar",
    issueDate: "2024-11-05",
    dueDate: "2024-11-19",
    status: "Issued",
  },
  {
    id: "r3",
    studentName: "Rohan Kumar",
    admissionNo: "2024-1047",
    bookTitle: "India: A History",
    issueDate: "2024-10-28",
    dueDate: "2024-11-11",
    status: "Overdue",
  },
  {
    id: "r4",
    studentName: "Ananya Verma",
    admissionNo: "2024-1048",
    bookTitle: "Biology NCERT XI",
    issueDate: "2024-11-08",
    dueDate: "2024-11-22",
    status: "Issued",
  },
  {
    id: "r5",
    studentName: "Mohammed Arif",
    admissionNo: "2024-1049",
    bookTitle: "Mathematics Textbook X",
    issueDate: "2024-11-10",
    dueDate: "2024-11-24",
    status: "Issued",
  },
  {
    id: "r6",
    studentName: "Sneha Jha",
    admissionNo: "2024-1050",
    bookTitle: "Wings of Fire",
    issueDate: "2024-11-12",
    dueDate: "2024-11-26",
    status: "Issued",
  },
  {
    id: "r7",
    studentName: "Ravi Prakash",
    admissionNo: "2024-1051",
    bookTitle: "Algebra and Trigonometry",
    issueDate: "2024-10-25",
    dueDate: "2024-11-08",
    status: "Overdue",
  },
  {
    id: "r8",
    studentName: "Kajal Kumari",
    admissionNo: "2024-1052",
    bookTitle: "Chemistry Part I",
    issueDate: "2024-11-13",
    dueDate: "2024-11-27",
    status: "Issued",
  },
];

export function BookIssueReturnPage() {
  const [issued, setIssued] = useState<IssuedRecord[]>(initialIssued);
  const [admNo, setAdmNo] = useState("");
  const [bookTitle, setBookTitle] = useState("");

  const handleIssue = () => {
    if (!admNo || !bookTitle) {
      toast.error("Please fill in both fields");
      return;
    }
    const newRecord: IssuedRecord = {
      id: `r${Date.now()}`,
      studentName: "Student",
      admissionNo: admNo,
      bookTitle,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      status: "Issued",
    };
    setIssued((prev) => [newRecord, ...prev]);
    setAdmNo("");
    setBookTitle("");
    toast.success(`Book "${bookTitle}" issued to ${admNo}`);
  };

  const handleReturn = (id: string, bookTitle: string) => {
    setIssued((prev) => prev.filter((r) => r.id !== id));
    toast.success(`"${bookTitle}" returned successfully`);
  };

  return (
    <div className="space-y-6" data-ocid="book-issue-return.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Issue & Return</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage book issue and return transactions
        </p>
      </div>

      <Tabs defaultValue="issue">
        <TabsList data-ocid="book-issue-return.tab">
          <TabsTrigger value="issue">Issue Book</TabsTrigger>
          <TabsTrigger value="return">Return Book</TabsTrigger>
        </TabsList>

        <TabsContent value="issue" className="mt-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Issue a Book</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Admission Number</Label>
                <Input
                  placeholder="e.g. 2024-1045"
                  value={admNo}
                  onChange={(e) => setAdmNo(e.target.value)}
                  data-ocid="book-issue-return.input"
                />
              </div>
              <div>
                <Label>Book Title</Label>
                <Input
                  placeholder="e.g. Physics for Class XII"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  data-ocid="book-issue-return.input"
                />
              </div>
              <Button
                className="w-full"
                onClick={handleIssue}
                data-ocid="book-issue-return.submit_button"
              >
                Issue Book
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="return" className="mt-4">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  {[
                    "Student",
                    "Adm. No",
                    "Book Title",
                    "Issue Date",
                    "Due Date",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-muted-foreground font-medium whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {issued.map((r, idx) => (
                  <tr
                    key={r.id}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                    data-ocid={`book-issue-return.item.${idx + 1}`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {r.studentName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {r.admissionNo}
                    </td>
                    <td className="px-4 py-3 text-foreground">{r.bookTitle}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {r.issueDate}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {r.dueDate}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          r.status === "Overdue" ? "destructive" : "secondary"
                        }
                      >
                        {r.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReturn(r.id, r.bookTitle)}
                        data-ocid={`book-issue-return.secondary_button.${idx + 1}`}
                      >
                        Return
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
