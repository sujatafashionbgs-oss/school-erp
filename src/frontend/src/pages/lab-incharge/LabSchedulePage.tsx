import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FlaskConical } from "lucide-react";

const todayBookings = [
  {
    time: "8:00 - 9:00",
    class: "X A",
    subject: "Chemistry",
    teacher: "Ramesh Tiwari",
    lab: "Science Lab",
    status: "Completed",
  },
  {
    time: "9:00 - 10:00",
    class: "IX B",
    subject: "Physics",
    teacher: "Ramesh Tiwari",
    lab: "Science Lab",
    status: "In Progress",
  },
  {
    time: "10:00 - 11:00",
    class: "VIII A",
    subject: "Computer Basics",
    teacher: "Vivek Pandey",
    lab: "Computer Lab",
    status: "Booked",
  },
  {
    time: "11:30 - 12:30",
    class: "XI Sci",
    subject: "Biology",
    teacher: "Ramesh Tiwari",
    lab: "Science Lab",
    status: "Booked",
  },
  {
    time: "12:30 - 1:30",
    class: "VII B",
    subject: "Python Lab",
    teacher: "Vivek Pandey",
    lab: "Computer Lab",
    status: "Booked",
  },
  {
    time: "2:00 - 3:00",
    class: "XII Sci",
    subject: "Organic Chemistry",
    teacher: "Ramesh Tiwari",
    lab: "Science Lab",
    status: "Available",
  },
  {
    time: "3:00 - 4:00",
    class: "",
    subject: "",
    teacher: "",
    lab: "",
    status: "Available",
  },
  {
    time: "4:00 - 5:00",
    class: "",
    subject: "",
    teacher: "",
    lab: "",
    status: "Available",
  },
];

const weeklySchedule = [
  {
    time: "8-9",
    mon: "X A Chem",
    tue: "IX A Bio",
    wed: "VIII A Phy",
    thu: "XI Chem",
    fri: "X B Bio",
    sat: "XII Chem",
  },
  {
    time: "9-10",
    mon: "IX B Phy",
    tue: "X B Chem",
    wed: "XI Bio",
    thu: "IX A Chem",
    fri: "XII Bio",
    sat: "X A Phy",
  },
  {
    time: "10-11",
    mon: "VIII A CS",
    tue: "VII B CS",
    wed: "IX B CS",
    thu: "X A CS",
    fri: "XI CS",
    sat: "XII CS",
  },
  {
    time: "11:30-12:30",
    mon: "XI Bio",
    tue: "X A Bio",
    wed: "IX A Phy",
    thu: "VIII B Chem",
    fri: "X B Phy",
    sat: "XI Phy",
  },
];

const statusColor = (s: string) =>
  s === "Completed"
    ? "secondary"
    : s === "In Progress"
      ? "default"
      : s === "Booked"
        ? "outline"
        : "outline";

export function LabSchedulePage() {
  const booked = todayBookings.filter((b) => b.status !== "Available").length;
  const available = todayBookings.filter(
    (b) => b.status === "Available",
  ).length;

  return (
    <div className="space-y-6" data-ocid="lab_schedule.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lab Schedule</h1>
        <p className="text-muted-foreground text-sm">
          Today's bookings and weekly overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <Calendar size={22} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{booked}</p>
          <p className="text-sm text-muted-foreground">Today's Bookings</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <Clock size={22} className="text-green-600 mb-2" />
          <p className="text-2xl font-bold text-green-600">{available}</p>
          <p className="text-sm text-muted-foreground">Available Slots</p>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <FlaskConical size={16} className="text-primary" /> Today's Schedule
        </h2>
        <div className="space-y-3" data-ocid="lab_schedule.list">
          {todayBookings.map((b, bi) => (
            <div
              key={b.time}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/30"
              data-ocid={`lab_schedule.item.${bi + 1}`}
            >
              <span className="text-xs text-muted-foreground w-24 shrink-0">
                {b.time}
              </span>
              <div className="flex-1">
                {b.class ? (
                  <>
                    <p className="text-sm font-medium text-foreground">
                      {b.class} · {b.subject}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {b.teacher} · {b.lab}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Free slot
                  </p>
                )}
              </div>
              <Badge
                variant={statusColor(b.status) as any}
                className="text-xs shrink-0"
              >
                {b.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h2 className="text-base font-semibold text-foreground mb-4">
          Weekly Overview
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-3 text-xs font-semibold text-muted-foreground">
                  Time
                </th>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <th
                    key={d}
                    className="text-left py-2 px-2 text-xs font-semibold text-muted-foreground"
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeklySchedule.map((row) => (
                <tr key={row.time} className="border-b border-border">
                  <td className="py-2.5 pr-3 text-xs text-muted-foreground whitespace-nowrap">
                    {row.time}
                  </td>
                  {(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const).map(
                    (day) => (
                      <td
                        key={day}
                        className="py-2.5 px-2 text-xs text-foreground"
                      >
                        {row[day.toLowerCase() as keyof typeof row]}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
