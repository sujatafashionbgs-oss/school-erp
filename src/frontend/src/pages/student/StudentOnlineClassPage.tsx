import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Monitor, Video } from "lucide-react";
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

const mockClasses: OnlineClass[] = [
  {
    id: "oc1",
    title: "Mathematics - Chapter 5 Fractions",
    teacher: "Amit Kumar",
    class: "VIII-A",
    date: "2025-04-05",
    time: "10:00 AM",
    duration: "45 min",
    platform: "Google Meet",
    link: "https://meet.google.com/abc-def-ghi",
    status: "Upcoming",
  },
  {
    id: "oc4",
    title: "History - Mughal Empire",
    teacher: "Sunita Rao",
    class: "VIII-A",
    date: "2025-04-02",
    time: "02:00 PM",
    duration: "45 min",
    platform: "MS Teams",
    link: "https://teams.microsoft.com/l/meeting/abc",
    status: "Live",
  },
  {
    id: "oc2",
    title: "English Grammar - Tenses",
    teacher: "Priya Singh",
    class: "VIII-A",
    date: "2025-04-01",
    time: "09:00 AM",
    duration: "45 min",
    platform: "Zoom",
    link: "https://zoom.us/j/123456",
    status: "Completed",
  },
];

const PLATFORM_COLORS: Record<string, string> = {
  "Google Meet": "bg-blue-500/10 text-blue-700 border-blue-200",
  Zoom: "bg-indigo-500/10 text-indigo-700 border-indigo-200",
  "MS Teams": "bg-purple-500/10 text-purple-700 border-purple-200",
};

const STATUS_COLORS: Record<ClassStatus, string> = {
  Upcoming: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  Live: "bg-green-500/10 text-green-700 border-green-200",
  Completed: "bg-secondary text-muted-foreground",
};

export function StudentOnlineClassPage() {
  const liveClasses = mockClasses.filter((c) => c.status === "Live");
  const upcomingClasses = mockClasses.filter((c) => c.status === "Upcoming");
  const completedClasses = mockClasses.filter((c) => c.status === "Completed");

  return (
    <div className="space-y-5" data-ocid="student_online_class.page">
      <h1 className="text-2xl font-bold text-foreground">Online Classes</h1>

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

        <TabsContent value="schedule" className="mt-5">
          {upcomingClasses.length === 0 && liveClasses.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground">
              <Monitor size={36} className="mx-auto mb-2 opacity-40" />
              <p>No upcoming classes scheduled.</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
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
                      Date & Time
                    </th>
                    <th className="p-3 text-left font-semibold text-muted-foreground">
                      Platform
                    </th>
                    <th className="p-3 text-center font-semibold text-muted-foreground">
                      Status
                    </th>
                    <th className="p-3 text-center font-semibold text-muted-foreground">
                      Join
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...liveClasses, ...upcomingClasses].map((cls, i) => (
                    <tr
                      key={cls.id}
                      className="border-t border-border hover:bg-secondary/20"
                      data-ocid={`student_oc.row.${i + 1}`}
                    >
                      <td className="p-3 font-medium text-foreground">
                        {cls.title}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {cls.teacher}
                      </td>
                      <td className="p-3 text-muted-foreground whitespace-nowrap">
                        {cls.date} · {cls.time}
                      </td>
                      <td className="p-3">
                        <Badge
                          className={PLATFORM_COLORS[cls.platform] ?? ""}
                          variant="outline"
                        >
                          {cls.platform}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge className={STATUS_COLORS[cls.status]}>
                          {cls.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        {cls.status === "Live" ? (
                          <Button
                            size="sm"
                            onClick={() => window.open(cls.link, "_blank")}
                            data-ocid={`student_oc.join.${i + 1}`}
                          >
                            <ExternalLink size={12} className="mr-1" /> Join Now
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" disabled>
                            Upcoming
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="live" className="mt-5">
          {liveClasses.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground">
              <Monitor size={36} className="mx-auto mb-2 opacity-40" />
              <p>No classes are live right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {liveClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-card border-2 border-green-500/30 rounded-2xl p-5 space-y-3"
                  data-ocid={`student_oc.live.${cls.id}`}
                >
                  <Badge className="bg-green-500/10 text-green-700 border-green-200">
                    🔴 LIVE
                  </Badge>
                  <p className="font-semibold text-foreground">{cls.title}</p>
                  <p className="text-sm text-muted-foreground">
                    by {cls.teacher} · {cls.time} · {cls.duration}
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => window.open(cls.link, "_blank")}
                    data-ocid={`student_oc.join_live.${cls.id}`}
                  >
                    <ExternalLink size={14} className="mr-2" /> Join Class
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recordings" className="mt-5">
          {completedClasses.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground">
              No recordings available.
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
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
                      Date
                    </th>
                    <th className="p-3 text-center font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {completedClasses.map((cls, i) => (
                    <tr
                      key={cls.id}
                      className="border-t border-border hover:bg-secondary/20"
                    >
                      <td className="p-3 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <Video size={14} className="text-muted-foreground" />
                          {cls.title}
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {cls.teacher}
                      </td>
                      <td className="p-3 text-muted-foreground">{cls.date}</td>
                      <td className="p-3 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            toast.info("Recording will be available soon")
                          }
                          data-ocid={`student_oc.view_recording.${i + 1}`}
                        >
                          View Recording
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
