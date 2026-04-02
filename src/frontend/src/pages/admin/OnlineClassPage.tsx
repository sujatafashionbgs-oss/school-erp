import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CLASSES as CLASS_LIST,
  SECTIONS as SECTION_LIST,
} from "@/data/classConfig";
import { ExternalLink, Monitor, Plus, Users, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ClassStatus = "Upcoming" | "Live" | "Completed";

interface OnlineClass {
  id: string;
  title: string;
  teacher: string;
  class: string;
  date: string;
  time: string;
  duration: string;
  platform: string;
  link: string;
  status: ClassStatus;
}

const initialClasses: OnlineClass[] = [
  {
    id: "oc1",
    title: "Mathematics - Chapter 5 Fractions",
    teacher: "Amit Kumar",
    class: "VIII-A",
    date: "2026-04-05",
    time: "10:00 AM",
    duration: "45 min",
    platform: "Google Meet",
    link: "https://meet.google.com/abc-def-ghi",
    status: "Upcoming",
  },
  {
    id: "oc2",
    title: "English Grammar - Tenses",
    teacher: "Priya Singh",
    class: "VII-B",
    date: "2026-04-02",
    time: "09:00 AM",
    duration: "45 min",
    platform: "Zoom",
    link: "https://zoom.us/j/123456",
    status: "Completed",
  },
  {
    id: "oc3",
    title: "Science - Photosynthesis",
    teacher: "Ravi Gupta",
    class: "VI-C",
    date: "2026-04-02",
    time: "11:00 AM",
    duration: "40 min",
    platform: "Google Meet",
    link: "https://meet.google.com/xyz-uvw-rst",
    status: "Completed",
  },
  {
    id: "oc4",
    title: "History - Mughal Empire",
    teacher: "Sunita Rao",
    class: "IX-A",
    date: "2026-04-02",
    time: "02:00 PM",
    duration: "45 min",
    platform: "MS Teams",
    link: "https://teams.microsoft.com/l/meeting/abc",
    status: "Live",
  },
  {
    id: "oc5",
    title: "Physics - Laws of Motion",
    teacher: "Ravi Gupta",
    class: "XI-Science",
    date: "2026-04-02",
    time: "03:00 PM",
    duration: "50 min",
    platform: "Zoom",
    link: "https://zoom.us/j/789012",
    status: "Live",
  },
];

const MOCK_STUDENT_COUNTS: Record<string, number> = {
  oc4: 28,
  oc5: 31,
};

const PLATFORM_COLORS: Record<string, string> = {
  "Google Meet": "bg-blue-500/10 text-blue-700 border-blue-200",
  Zoom: "bg-indigo-500/10 text-indigo-700 border-indigo-200",
  "MS Teams": "bg-purple-500/10 text-purple-700 border-purple-200",
};

const STATUS_COLORS: Record<ClassStatus, string> = {
  Upcoming: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  Live: "bg-green-500/10 text-green-700 border-green-200 animate-pulse",
  Completed: "bg-secondary text-muted-foreground",
};

const TEACHERS = [
  "Amit Kumar",
  "Priya Singh",
  "Ravi Gupta",
  "Sunita Rao",
  "Manoj Patel",
];
// CLASS_LIST and SECTION_LIST imported from classConfig

const RECORDING_DURATIONS: Record<string, string> = {
  oc2: "44:12",
  oc3: "38:55",
};

interface FormState {
  title: string;
  subject: string;
  class: string;
  section: string;
  teacher: string;
  date: string;
  time: string;
  duration: string;
  platform: string;
  link: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  subject: "",
  class: "",
  section: "",
  teacher: "",
  date: "",
  time: "",
  duration: "",
  platform: "",
  link: "",
};

export function OnlineClassPage() {
  const [classes, setClasses] = useState<OnlineClass[]>(initialClasses);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const liveClasses = classes.filter((c) => c.status === "Live");
  const recordings = classes.filter((c) => c.status === "Completed");

  function handleCreate() {
    if (
      !form.title.trim() ||
      !form.class ||
      !form.teacher ||
      !form.date ||
      !form.time ||
      !form.platform ||
      !form.link.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    const newClass: OnlineClass = {
      id: `oc${Date.now()}`,
      title: form.title,
      teacher: form.teacher,
      class: form.section ? `${form.class}-${form.section}` : form.class,
      date: form.date,
      time: form.time,
      duration: form.duration ? `${form.duration} min` : "45 min",
      platform: form.platform,
      link: form.link,
      status: "Upcoming",
    };
    setClasses((prev) => [newClass, ...prev]);
    setCreateOpen(false);
    setForm(EMPTY_FORM);
    toast.success("Class scheduled successfully");
  }

  function endClass(id: string) {
    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Completed" } : c)),
    );
    toast.success("Class ended");
  }

  return (
    <div className="space-y-5" data-ocid="online_class.page">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground">Online Classes</h1>
        <Button
          onClick={() => setCreateOpen(true)}
          data-ocid="online_class.create.button"
        >
          <Plus size={16} className="mr-2" /> Create Class
        </Button>
      </div>

      <Tabs defaultValue="schedule">
        <TabsList>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="live">
            Live Now
            {liveClasses.length > 0 && (
              <span className="ml-2 bg-green-500 text-white text-xs rounded-full w-4 h-4 inline-flex items-center justify-center">
                {liveClasses.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="recordings">Recordings</TabsTrigger>
        </TabsList>

        {/* SCHEDULE TAB */}
        <TabsContent value="schedule" className="mt-5">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="p-3 text-left font-semibold text-muted-foreground">
                      Title
                    </th>
                    <th className="p-3 text-left font-semibold text-muted-foreground">
                      Teacher
                    </th>
                    <th className="p-3 text-left font-semibold text-muted-foreground">
                      Class
                    </th>
                    <th className="p-3 text-left font-semibold text-muted-foreground">
                      Date & Time
                    </th>
                    <th className="p-3 text-left font-semibold text-muted-foreground">
                      Duration
                    </th>
                    <th className="p-3 text-left font-semibold text-muted-foreground">
                      Platform
                    </th>
                    <th className="p-3 text-center font-semibold text-muted-foreground">
                      Join Link
                    </th>
                    <th className="p-3 text-center font-semibold text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((cls, i) => (
                    <tr
                      key={cls.id}
                      className="border-t border-border hover:bg-secondary/20"
                      data-ocid={`online_class.schedule.row.${i + 1}`}
                    >
                      <td className="p-3 font-medium text-foreground max-w-[200px] truncate">
                        {cls.title}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {cls.teacher}
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">{cls.class}</Badge>
                      </td>
                      <td className="p-3 text-muted-foreground whitespace-nowrap">
                        {cls.date} · {cls.time}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {cls.duration}
                      </td>
                      <td className="p-3">
                        <Badge
                          className={
                            PLATFORM_COLORS[cls.platform] ??
                            "bg-secondary text-foreground"
                          }
                          variant="outline"
                        >
                          {cls.platform}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(cls.link, "_blank")}
                          data-ocid={`online_class.join.${i + 1}`}
                        >
                          <ExternalLink size={13} className="mr-1" /> Join
                        </Button>
                      </td>
                      <td className="p-3 text-center">
                        <Badge className={STATUS_COLORS[cls.status]}>
                          {cls.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* LIVE NOW TAB */}
        <TabsContent value="live" className="mt-5">
          {liveClasses.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground">
              <Monitor size={40} className="mx-auto mb-3 opacity-40" />
              <p className="font-medium">No classes are live right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-card border-2 border-green-500/30 rounded-2xl p-5 space-y-4"
                  data-ocid={`online_class.live.card.${cls.id}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge className="bg-green-500/10 text-green-700 border-green-200 mb-2">
                        🔴 LIVE
                      </Badge>
                      <p className="font-semibold text-foreground text-sm leading-snug">
                        {cls.title}
                      </p>
                    </div>
                    <Badge
                      className={PLATFORM_COLORS[cls.platform] ?? ""}
                      variant="outline"
                    >
                      {cls.platform}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>
                      Teacher:{" "}
                      <span className="font-medium text-foreground">
                        {cls.teacher}
                      </span>
                    </p>
                    <p>
                      Class:{" "}
                      <span className="font-medium text-foreground">
                        {cls.class}
                      </span>
                    </p>
                    <p>
                      Started:{" "}
                      <span className="font-medium text-foreground">
                        {cls.time}
                      </span>{" "}
                      · {cls.duration}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs bg-secondary rounded-full px-2 py-1">
                      <Users size={12} />
                      <span>{MOCK_STUDENT_COUNTS[cls.id] ?? 24} students</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(cls.link, "_blank")}
                      data-ocid={`online_class.live_join.${cls.id}`}
                    >
                      <ExternalLink size={13} className="mr-1" /> Join
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => endClass(cls.id)}
                      data-ocid={`online_class.end.${cls.id}`}
                    >
                      End Class
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* RECORDINGS TAB */}
        <TabsContent value="recordings" className="mt-5">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="p-3 text-left font-semibold text-muted-foreground">
                      Title
                    </th>
                    <th className="p-3 text-left font-semibold text-muted-foreground">
                      Teacher
                    </th>
                    <th className="p-3 text-left font-semibold text-muted-foreground">
                      Class
                    </th>
                    <th className="p-3 text-left font-semibold text-muted-foreground">
                      Date
                    </th>
                    <th className="p-3 text-center font-semibold text-muted-foreground">
                      Duration
                    </th>
                    <th className="p-3 text-left font-semibold text-muted-foreground">
                      Platform
                    </th>
                    <th className="p-3 text-center font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recordings.map((cls, i) => (
                    <tr
                      key={cls.id}
                      className="border-t border-border hover:bg-secondary/20"
                      data-ocid={`online_class.recording.row.${i + 1}`}
                    >
                      <td className="p-3 font-medium text-foreground max-w-[200px] truncate">
                        <div className="flex items-center gap-2">
                          <Video
                            size={14}
                            className="text-muted-foreground shrink-0"
                          />
                          {cls.title}
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {cls.teacher}
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">{cls.class}</Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">{cls.date}</td>
                      <td className="p-3 text-center font-mono text-muted-foreground">
                        {RECORDING_DURATIONS[cls.id] ??
                          `${cls.duration.replace(" min", "")}:00`}
                      </td>
                      <td className="p-3">
                        <Badge
                          className={PLATFORM_COLORS[cls.platform] ?? ""}
                          variant="outline"
                        >
                          {cls.platform}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              toast.success(
                                `Downloading recording: ${cls.title}`,
                              )
                            }
                            data-ocid={`online_class.download.${i + 1}`}
                          >
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const msg = encodeURIComponent(
                                `Recording: ${cls.title}\nDate: ${cls.date}\nDuration: ${RECORDING_DURATIONS[cls.id] ?? cls.duration}\nLink: ${cls.link}`,
                              );
                              window.open(
                                `https://wa.me/?text=${msg}`,
                                "_blank",
                              );
                            }}
                            data-ocid={`online_class.share.${i + 1}`}
                          >
                            Share
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {recordings.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-8 text-center text-muted-foreground"
                      >
                        No recordings yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* CREATE CLASS DIALOG */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Online Class</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Class Title *</Label>
              <Input
                placeholder="e.g. Mathematics - Chapter 5"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                data-ocid="online_class.form.title"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Class *</Label>
                <Select
                  value={form.class}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, class: v, section: "" }))
                  }
                >
                  <SelectTrigger data-ocid="online_class.form.class">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48 overflow-y-auto">
                    {CLASS_LIST.map((c) => (
                      <SelectItem key={c} value={c}>
                        Class {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Section *</Label>
                <Select
                  value={form.section}
                  onValueChange={(v) => setForm((p) => ({ ...p, section: v }))}
                  disabled={!form.class}
                >
                  <SelectTrigger data-ocid="online_class.form.section">
                    <SelectValue placeholder="Section" />
                  </SelectTrigger>
                  <SelectContent>
                    {(form.class === "XI" || form.class === "XII"
                      ? ["A", "B", "Science", "Commerce", "Arts"]
                      : SECTION_LIST
                    ).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Teacher *</Label>
              <Select
                value={form.teacher}
                onValueChange={(v) => setForm((p) => ({ ...p, teacher: v }))}
              >
                <SelectTrigger data-ocid="online_class.form.teacher">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {TEACHERS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, date: e.target.value }))
                  }
                  data-ocid="online_class.form.date"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Start Time *</Label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, time: e.target.value }))
                  }
                  data-ocid="online_class.form.time"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  placeholder="45"
                  value={form.duration}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, duration: e.target.value }))
                  }
                  data-ocid="online_class.form.duration"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Platform *</Label>
                <Select
                  value={form.platform}
                  onValueChange={(v) => setForm((p) => ({ ...p, platform: v }))}
                >
                  <SelectTrigger data-ocid="online_class.form.platform">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Google Meet">Google Meet</SelectItem>
                    <SelectItem value="Zoom">Zoom</SelectItem>
                    <SelectItem value="MS Teams">MS Teams</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Meeting Link *</Label>
              <Input
                placeholder="https://meet.google.com/..."
                value={form.link}
                onChange={(e) =>
                  setForm((p) => ({ ...p, link: e.target.value }))
                }
                data-ocid="online_class.form.link"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleCreate}
                data-ocid="online_class.form.submit"
              >
                Schedule Class
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
