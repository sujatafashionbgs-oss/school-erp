import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Edit,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type EventType = "exam" | "sports" | "cultural" | "meeting" | "holiday";
type AudienceType = "all" | "class-wise" | "staff-only";

interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: EventType;
  description: string;
  audience: AudienceType;
}

const initialEvents: SchoolEvent[] = [
  {
    id: "e1",
    title: "Annual Sports Day",
    date: "2024-12-05",
    time: "9:00 AM",
    type: "sports",
    description: "Inter-school sports competition",
    audience: "all",
  },
  {
    id: "e2",
    title: "PTM Class 10",
    date: "2024-12-10",
    time: "10:00 AM",
    type: "meeting",
    description: "Parent-teacher meeting for Class 10",
    audience: "class-wise",
  },
  {
    id: "e3",
    title: "Christmas Holiday",
    date: "2024-12-25",
    time: "",
    type: "holiday",
    description: "School closed for Christmas",
    audience: "all",
  },
  {
    id: "e4",
    title: "Winter Break",
    date: "2024-12-28",
    time: "",
    type: "holiday",
    description: "Winter vacation begins",
    audience: "all",
  },
  {
    id: "e5",
    title: "Science Exhibition",
    date: "2024-12-15",
    time: "11:00 AM",
    type: "cultural",
    description: "Annual science project exhibition",
    audience: "all",
  },
  {
    id: "e6",
    title: "Unit Test",
    date: "2024-12-08",
    time: "8:30 AM",
    type: "exam",
    description: "Class 9-10 Unit Test",
    audience: "class-wise",
  },
  {
    id: "e7",
    title: "Staff Meeting",
    date: "2024-12-03",
    time: "4:00 PM",
    type: "meeting",
    description: "Monthly staff review",
    audience: "staff-only",
  },
  {
    id: "e8",
    title: "Republic Day Practice",
    date: "2025-01-20",
    time: "7:30 AM",
    type: "cultural",
    description: "Rehearsal for Republic Day function",
    audience: "all",
  },
  {
    id: "e9",
    title: "Exam Term 2",
    date: "2025-01-15",
    time: "8:30 AM",
    type: "exam",
    description: "Term 2 final exams begin",
    audience: "all",
  },
  {
    id: "e10",
    title: "New Year Holiday",
    date: "2025-01-01",
    time: "",
    type: "holiday",
    description: "New Year's Day — school closed",
    audience: "all",
  },
];

const TYPE_COLORS: Record<EventType, string> = {
  exam: "bg-red-500",
  sports: "bg-green-500",
  cultural: "bg-purple-500",
  meeting: "bg-blue-500",
  holiday: "bg-orange-500",
};

const TYPE_BADGE: Record<EventType, string> = {
  exam: "bg-red-500/15 text-red-600",
  sports: "bg-green-500/15 text-green-600",
  cultural: "bg-purple-500/15 text-purple-600",
  meeting: "bg-blue-500/15 text-blue-600",
  holiday: "bg-orange-500/15 text-orange-600",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const emptyForm: Omit<SchoolEvent, "id"> = {
  title: "",
  date: "",
  time: "",
  type: "meeting",
  description: "",
  audience: "all",
};

export function EventsPage() {
  const [events, setEvents] = useState<SchoolEvent[]>(initialEvents);
  const [calMonth, setCalMonth] = useState(11); // December = 11
  const [calYear, setCalYear] = useState(2024);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<SchoolEvent | null>(null);
  const [form, setForm] = useState<Omit<SchoolEvent, "id">>(emptyForm);

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDow = new Date(calYear, calMonth, 1).getDay();

  const eventsForDate = (dateStr: string) =>
    events.filter((e) => e.date === dateStr);

  const formatDate = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const upcomingEvents = [...events]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 10);

  const openAdd = () => {
    setEditEvent(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (ev: SchoolEvent) => {
    setEditEvent(ev);
    setForm({
      title: ev.title,
      date: ev.date,
      time: ev.time,
      type: ev.type,
      description: ev.description,
      audience: ev.audience,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    toast.success("Event deleted");
  };

  const handleSubmit = () => {
    if (!form.title || !form.date) {
      toast.error("Title and date are required");
      return;
    }
    if (editEvent) {
      setEvents((prev) =>
        prev.map((e) => (e.id === editEvent.id ? { ...e, ...form } : e)),
      );
      toast.success("Event updated");
    } else {
      setEvents((prev) => [...prev, { id: `e${Date.now()}`, ...form }]);
      toast.success("Event added");
    }
    setDialogOpen(false);
  };

  const selectedEvents = selectedDate ? eventsForDate(selectedDate) : [];

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else setCalMonth((m) => m - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else setCalMonth((m) => m + 1);
    setSelectedDate(null);
  };

  return (
    <div className="space-y-6" data-ocid="events.page">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays size={22} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            Events &amp; Calendar
          </h1>
        </div>
        <Button onClick={openAdd} data-ocid="events.add_button">
          <Plus size={16} className="mr-2" /> Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                data-ocid="events.pagination_prev"
              >
                <ChevronLeft size={18} />
              </button>
              <h2 className="font-semibold text-foreground">
                {MONTHS[calMonth]} {calYear}
              </h2>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                data-ocid="events.pagination_next"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="text-center text-xs font-semibold text-muted-foreground py-1"
                >
                  {d}
                </div>
              ))}
            </div>
            {/* Day cells */}
            <div className="grid grid-cols-7 gap-0.5">
              {[...Array(firstDow).keys()].map((dow) => (
                <div key={`empty-${calYear}-${calMonth}-${dow}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = formatDate(calYear, calMonth, day);
                const dayEvents = eventsForDate(dateStr);
                const isSelected = selectedDate === dateStr;
                const today = new Date();
                const isToday =
                  today.getFullYear() === calYear &&
                  today.getMonth() === calMonth &&
                  today.getDate() === day;
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                    className={`relative flex flex-col items-center p-1.5 rounded-lg min-h-[44px] transition-colors text-sm ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : isToday
                          ? "bg-primary/10 text-primary font-semibold"
                          : "hover:bg-accent"
                    }`}
                    data-ocid={`events.calendar.item.${day}`}
                  >
                    <span>{day}</span>
                    <div className="flex gap-0.5 flex-wrap justify-center mt-0.5">
                      {dayEvents.slice(0, 3).map((ev) => (
                        <span
                          key={ev.id}
                          className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-primary-foreground" : TYPE_COLORS[ev.type]}`}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Type legend */}
          <div className="flex flex-wrap gap-3">
            {(Object.entries(TYPE_BADGE) as [EventType, string][]).map(
              ([type, cls]) => (
                <span
                  key={type}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${cls} capitalize`}
                >
                  {type}
                </span>
              ),
            )}
          </div>

          {/* Selected date events */}
          {selectedDate && (
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-sm font-semibold text-foreground mb-3">
                Events on{" "}
                {new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
                  "en-IN",
                  { day: "numeric", month: "long", year: "numeric" },
                )}
              </p>
              {selectedEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No events on this date.
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30"
                    >
                      <span
                        className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${TYPE_COLORS[ev.type]}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {ev.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {ev.time && `${ev.time} · `}
                          {ev.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Upcoming events list */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-foreground mb-4">
              Upcoming Events
            </h3>
            <div className="space-y-3" data-ocid="events.list">
              {upcomingEvents.map((ev, i) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-xl bg-secondary/30 space-y-2"
                  data-ocid={`events.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_BADGE[ev.type]} capitalize shrink-0`}
                      >
                        {ev.type}
                      </span>
                      <p className="text-sm font-medium text-foreground truncate">
                        {ev.title}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEdit(ev)}
                        className="p-1 rounded-md hover:bg-accent transition-colors"
                        data-ocid={`events.edit_button.${i + 1}`}
                      >
                        <Edit size={13} className="text-muted-foreground" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(ev.id)}
                        className="p-1 rounded-md hover:bg-destructive/10 transition-colors"
                        data-ocid={`events.delete_button.${i + 1}`}
                      >
                        <Trash2 size={13} className="text-destructive" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {new Date(`${ev.date}T00:00:00`).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "short" },
                      )}
                    </span>
                    {ev.time && <span>· {ev.time}</span>}
                    <span className="ml-auto text-xs bg-secondary px-2 py-0.5 rounded-full capitalize">
                      {ev.audience}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-ocid="events.dialog">
          <DialogHeader>
            <DialogTitle>{editEvent ? "Edit Event" : "Add Event"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Event title"
                data-ocid="events.title.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                  data-ocid="events.date.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Time</Label>
                <Input
                  value={form.time}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, time: e.target.value }))
                  }
                  placeholder="e.g. 9:00 AM"
                  data-ocid="events.time.input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, type: v as EventType }))
                  }
                >
                  <SelectTrigger data-ocid="events.type.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exam">Exam</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="holiday">Holiday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Audience</Label>
                <Select
                  value={form.audience}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, audience: v as AudienceType }))
                  }
                >
                  <SelectTrigger data-ocid="events.audience.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="class-wise">Class-wise</SelectItem>
                    <SelectItem value="staff-only">Staff Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
                data-ocid="events.description.textarea"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="events.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} data-ocid="events.submit_button">
              {editEvent ? "Update" : "Add Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
