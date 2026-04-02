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
  type AcademicEvent,
  type EventType,
  mockAcademicEvents,
} from "@/data/mockAcademicPlan";
import { ChevronLeft, ChevronRight, Edit2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EVENT_COLORS: Record<
  EventType,
  { bg: string; text: string; dot: string }
> = {
  Exam: {
    bg: "bg-red-500/20",
    text: "text-red-700 dark:text-red-400",
    dot: "bg-red-500",
  },
  Holiday: {
    bg: "bg-green-500/20",
    text: "text-green-700 dark:text-green-400",
    dot: "bg-green-500",
  },
  Event: {
    bg: "bg-blue-500/20",
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  PTM: {
    bg: "bg-purple-500/20",
    text: "text-purple-700 dark:text-purple-400",
    dot: "bg-purple-500",
  },
  Activity: {
    bg: "bg-orange-500/20",
    text: "text-orange-700 dark:text-orange-400",
    dot: "bg-orange-500",
  },
};

const MONTH_NAMES = [
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
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isoDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

type CalendarCell = { key: string; day: number | null; colIndex: number };

export function AcademicPlannerPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [events, setEvents] = useState<AcademicEvent[]>(mockAcademicEvents);
  const [addDialog, setAddDialog] = useState(false);
  const [editEvent, setEditEvent] = useState<AcademicEvent | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<AcademicEvent | null>(
    null,
  );
  const [form, setForm] = useState({
    title: "",
    type: "Event" as EventType,
    date: "",
    endDate: "",
    forClass: "",
    description: "",
    color: "#3b82f6",
  });

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const eventsForDay = (dateStr: string) =>
    events.filter((e) => {
      if (!e.endDate) return e.date === dateStr;
      return dateStr >= e.date && dateStr <= e.endDate;
    });

  const todayStr = isoDate(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const openAdd = () => {
    setEditEvent(null);
    setForm({
      title: "",
      type: "Event",
      date: "",
      endDate: "",
      forClass: "",
      description: "",
      color: "#3b82f6",
    });
    setAddDialog(true);
  };

  const openEdit = (ev: AcademicEvent) => {
    setSelectedEvent(null);
    setEditEvent(ev);
    setForm({
      title: ev.title,
      type: ev.type,
      date: ev.date,
      endDate: ev.endDate || "",
      forClass: ev.forClass || "",
      description: ev.description,
      color: ev.color,
    });
    setAddDialog(true);
  };

  const saveEvent = () => {
    if (!form.title || !form.date) {
      toast.error("Title and date are required");
      return;
    }
    if (editEvent) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editEvent.id
            ? {
                ...e,
                ...form,
                endDate: form.endDate || undefined,
                forClass: form.forClass || undefined,
              }
            : e,
        ),
      );
      toast.success("Event updated");
    } else {
      setEvents((prev) => [
        ...prev,
        {
          id: `ae${Date.now()}`,
          ...form,
          endDate: form.endDate || undefined,
          forClass: form.forClass || undefined,
        },
      ]);
      toast.success("Event added to calendar");
    }
    setAddDialog(false);
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setSelectedEvent(null);
    toast.success("Event deleted");
  };

  // Upcoming events (next 7 days)
  const upcoming = events
    .filter(
      (e) =>
        e.date > todayStr &&
        e.date <=
          isoDate(today.getFullYear(), today.getMonth(), today.getDate() + 7),
    )
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const todayEvents = events.filter((e) => {
    if (!e.endDate) return e.date === todayStr;
    return todayStr >= e.date && todayStr <= e.endDate;
  });

  // Build calendar grid with stable keys
  const cells: CalendarCell[] = [
    ...Array.from({ length: firstDay }, (_, i) => ({
      key: `pad-${i}`,
      day: null as null,
      colIndex: i,
    })),
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      key: `day-${i + 1}`,
      day: i + 1,
      colIndex: (firstDay + i) % 7,
    })),
  ];

  return (
    <div className="space-y-6" data-ocid="academic_planner.page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Academic Planner
          </h1>
          <p className="text-muted-foreground text-sm">
            School-wide event calendar for the academic year
          </p>
        </div>
        <Button onClick={openAdd} data-ocid="academic_planner.add_event.button">
          <Plus size={15} className="mr-2" /> Add Event
        </Button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {(Object.keys(EVENT_COLORS) as EventType[]).map((type) => (
          <div
            key={type}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${EVENT_COLORS[type].bg} ${EVENT_COLORS[type].text}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${EVENT_COLORS[type].dot}`}
            />
            {type}
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Calendar */}
        <div className="flex-1 bg-card border border-border rounded-2xl overflow-hidden">
          {/* Month Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevMonth}
              data-ocid="academic_planner.prev_month.button"
            >
              <ChevronLeft size={18} />
            </Button>
            <h2 className="font-semibold text-foreground text-lg">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextMonth}
              data-ocid="academic_planner.next_month.button"
            >
              <ChevronRight size={18} />
            </Button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {DAY_NAMES.map((d) => (
              <div
                key={d}
                className="py-2 text-center text-xs font-semibold text-muted-foreground"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {cells.map((cell) => {
              if (cell.day === null) {
                return (
                  <div
                    key={cell.key}
                    className="min-h-[80px] border-r border-b border-border/50"
                  />
                );
              }
              const dateStr = isoDate(viewYear, viewMonth, cell.day);
              const dayEvents = eventsForDay(dateStr);
              const isToday = dateStr === todayStr;
              return (
                <div
                  key={cell.key}
                  className={`min-h-[80px] p-1.5 border-r border-b border-border/50 hover:bg-muted/20 transition-colors ${
                    cell.colIndex === 6 ? "border-r-0" : ""
                  }`}
                  data-ocid={`academic_planner.day.${cell.day}`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full mb-1 ${
                      isToday
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {cell.day}
                  </span>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <button
                        type="button"
                        key={ev.id}
                        onClick={() => setSelectedEvent(ev)}
                        className={`w-full text-left text-[10px] font-medium px-1 py-0.5 rounded truncate ${EVENT_COLORS[ev.type].bg} ${EVENT_COLORS[ev.type].text}`}
                        title={ev.title}
                      >
                        {ev.title}
                      </button>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[10px] text-muted-foreground px-1">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          {/* Selected event detail */}
          {selectedEvent && (
            <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Badge
                    className={`${EVENT_COLORS[selectedEvent.type].bg} ${EVENT_COLORS[selectedEvent.type].text} mb-2`}
                  >
                    {selectedEvent.type}
                  </Badge>
                  <p className="font-semibold text-foreground">
                    {selectedEvent.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedEvent.date}
                    {selectedEvent.endDate ? ` → ${selectedEvent.endDate}` : ""}
                  </p>
                  {selectedEvent.forClass && (
                    <p className="text-xs text-muted-foreground">
                      Class: {selectedEvent.forClass}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedEvent.description}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEdit(selectedEvent)}
                  data-ocid="academic_planner.edit_event.button"
                >
                  <Edit2 size={13} className="mr-1" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteEvent(selectedEvent.id)}
                  data-ocid="academic_planner.delete_event.button"
                >
                  <Trash2 size={13} className="mr-1" /> Delete
                </Button>
              </div>
            </div>
          )}

          {/* Today's Events */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-semibold text-foreground text-sm mb-3">
              Today's Events
            </h3>
            {todayEvents.length === 0 ? (
              <p className="text-xs text-muted-foreground">No events today</p>
            ) : (
              todayEvents.map((ev) => (
                <div key={ev.id} className="flex items-center gap-2 mb-2">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${EVENT_COLORS[ev.type].dot}`}
                  />
                  <p className="text-sm text-foreground truncate">{ev.title}</p>
                </div>
              ))
            )}
          </div>

          {/* Upcoming Events */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-semibold text-foreground text-sm mb-3">
              Upcoming (7 days)
            </h3>
            {upcoming.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No upcoming events
              </p>
            ) : (
              upcoming.map((ev) => (
                <div key={ev.id} className="mb-3 last:mb-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${EVENT_COLORS[ev.type].dot}`}
                    />
                    <p className="text-sm font-medium text-foreground truncate">
                      {ev.title}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground ml-4">
                    {ev.date}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Event Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent data-ocid="academic_planner.event.dialog">
          <DialogHeader>
            <DialogTitle>
              {editEvent ? "Edit Event" : "Add Academic Event"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="e.g. Annual Sports Day"
                data-ocid="academic_planner.event.title.input"
              />
            </div>
            <div>
              <Label>Event Type *</Label>
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, type: v as EventType }))
                }
              >
                <SelectTrigger data-ocid="academic_planner.event.type.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    [
                      "Exam",
                      "Holiday",
                      "Event",
                      "PTM",
                      "Activity",
                    ] as EventType[]
                  ).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, date: e.target.value }))
                  }
                  data-ocid="academic_planner.event.date.input"
                />
              </div>
              <div>
                <Label>End Date (optional)</Label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, endDate: e.target.value }))
                  }
                />
              </div>
            </div>
            <div>
              <Label>For Class (optional)</Label>
              <Input
                value={form.forClass}
                onChange={(e) =>
                  setForm((p) => ({ ...p, forClass: e.target.value }))
                }
                placeholder="e.g. X, All"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                rows={2}
                data-ocid="academic_planner.event.description.textarea"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddDialog(false)}
              data-ocid="academic_planner.event.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={saveEvent}
              data-ocid="academic_planner.event.save_button"
            >
              Save Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
