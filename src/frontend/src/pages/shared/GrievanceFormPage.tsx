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
import { Textarea } from "@/components/ui/textarea";
import type { Grievance } from "@/data/mockGrievances";
import { CheckCircle2, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  Open: "bg-red-100 text-red-700",
  "Under Review": "bg-amber-100 text-amber-700",
  Resolved: "bg-green-100 text-green-700",
  Closed: "bg-gray-100 text-gray-700",
};

export function GrievanceFormPage() {
  const [category, setCategory] = useState<Grievance["category"]>("Academic");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Grievance["priority"]>("Medium");
  const [submitted, setSubmitted] = useState<{
    ticketNo: string;
    status: string;
  } | null>(null);

  const [trackInput, setTrackInput] = useState("");
  const [tracked, setTracked] = useState<Grievance | null>(null);
  const [trackNotFound, setTrackNotFound] = useState(false);

  const [localGrievances, setLocalGrievances] = useState<Grievance[]>([]);

  function submitGrievance() {
    if (!subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (!description.trim()) {
      toast.error("Please describe your grievance");
      return;
    }
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
    const seq = String(Math.floor(Math.random() * 900) + 100);
    const ticketNo = `GRV-${dateStr}-${seq}`;
    const newG: Grievance = {
      id: `g${Date.now()}`,
      ticketNo,
      submittedBy: "You",
      role: "Student",
      category,
      subject,
      description,
      submittedDate: now.toISOString().split("T")[0],
      status: "Open",
      priority,
    };
    setLocalGrievances((prev) => [...prev, newG]);
    setSubmitted({ ticketNo, status: "Open" });
    toast.success(`Grievance submitted! Ticket: ${ticketNo}`);
    setSubject("");
    setDescription("");
  }

  function trackGrievance() {
    const found = localGrievances.find((g) => g.ticketNo === trackInput.trim());
    if (found) {
      setTracked(found);
      setTrackNotFound(false);
    } else {
      setTracked(null);
      setTrackNotFound(true);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Submit a Grievance</h1>
        <p className="text-sm text-muted-foreground">
          Report issues, concerns, or complaints for resolution
        </p>
      </div>

      {submitted ? (
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-3 py-4">
              <CheckCircle2 size={48} className="text-green-500" />
              <h2 className="text-lg font-semibold">
                Grievance Submitted Successfully
              </h2>
              <p className="text-sm text-muted-foreground">
                Your ticket number is:
              </p>
              <code className="text-base font-bold bg-muted px-4 py-2 rounded">
                {submitted.ticketNo}
              </code>
              <p className="text-xs text-muted-foreground">
                Save this ticket number to track the status of your grievance
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSubmitted(null)}
              >
                Submit Another
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Grievance Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Category</Label>
                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v as Grievance["category"])}
                >
                  <SelectTrigger data-ocid="grievance.category.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      [
                        "Academic",
                        "Infrastructure",
                        "Administrative",
                        "Behavioral",
                        "Other",
                      ] as const
                    ).map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Priority</Label>
                <Select
                  value={priority}
                  onValueChange={(v) => setPriority(v as Grievance["priority"])}
                >
                  <SelectTrigger data-ocid="grievance.priority.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Subject</Label>
              <Input
                placeholder="Brief subject line..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                data-ocid="grievance.subject.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe your grievance in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                data-ocid="grievance.description.textarea"
              />
            </div>
            <Button
              className="w-full"
              onClick={submitGrievance}
              data-ocid="grievance.submit_button"
            >
              Submit Grievance
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Track grievance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Track My Grievance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Enter ticket number (e.g. GRV-20260101-001)"
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
              data-ocid="grievance.track.input"
            />
            <Button
              variant="outline"
              onClick={trackGrievance}
              data-ocid="grievance.track.button"
            >
              <Search size={16} />
            </Button>
          </div>
          {tracked && (
            <div className="p-3 border rounded-lg space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs">{tracked.ticketNo}</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[tracked.status]}`}
                >
                  {tracked.status}
                </span>
              </div>
              <p className="text-sm font-medium">{tracked.subject}</p>
              <p className="text-xs text-muted-foreground">
                Submitted: {tracked.submittedDate}
              </p>
              {tracked.assignedTo && (
                <p className="text-xs text-muted-foreground">
                  Assigned to: {tracked.assignedTo}
                </p>
              )}
            </div>
          )}
          {trackNotFound && (
            <p className="text-sm text-destructive">
              Ticket not found. Only tickets submitted in this session can be
              tracked here.
            </p>
          )}
          <div className="hidden">
            <Badge>unused</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
