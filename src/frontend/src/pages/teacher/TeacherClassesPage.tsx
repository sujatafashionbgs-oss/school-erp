import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

const mockClasses = [
  {
    id: "c1",
    name: "Class 8-A",
    subject: "Mathematics",
    section: "A",
    studentCount: 32,
    avgAttendance: 86,
    students: [
      { rollNo: "01", name: "Aarav Sharma", attendance: 92 },
      { rollNo: "02", name: "Priya Singh", attendance: 88 },
      { rollNo: "03", name: "Rohan Kumar", attendance: 75 },
      { rollNo: "04", name: "Ananya Verma", attendance: 95 },
      { rollNo: "05", name: "Mohammed Arif", attendance: 82 },
      { rollNo: "06", name: "Sneha Jha", attendance: 97 },
    ],
  },
  {
    id: "c2",
    name: "Class 9-B",
    subject: "Science",
    section: "B",
    studentCount: 28,
    avgAttendance: 81,
    students: [
      { rollNo: "01", name: "Ravi Prakash", attendance: 70 },
      { rollNo: "02", name: "Kajal Kumari", attendance: 91 },
      { rollNo: "03", name: "Deepak Ranjan", attendance: 85 },
      { rollNo: "04", name: "Nisha Kumari", attendance: 78 },
      { rollNo: "05", name: "Saurabh Mishra", attendance: 93 },
      { rollNo: "06", name: "Ritu Rani", attendance: 87 },
    ],
  },
  {
    id: "c3",
    name: "Class 10-A",
    subject: "English",
    section: "A",
    studentCount: 30,
    avgAttendance: 84,
    students: [
      { rollNo: "01", name: "Akash Yadav", attendance: 72 },
      { rollNo: "02", name: "Pooja Kumari", attendance: 96 },
      { rollNo: "03", name: "Vikash Ranjan", attendance: 80 },
      { rollNo: "04", name: "Shweta Pandey", attendance: 98 },
      { rollNo: "05", name: "Rahul Sinha", attendance: 76 },
      { rollNo: "06", name: "Aisha Khan", attendance: 89 },
    ],
  },
];

export function TeacherClassesPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sectionFilter, setSectionFilter] = useState("all");
  const uniqueSections = [...new Set(mockClasses.map((c) => c.section))];
  const displayClasses =
    sectionFilter === "all"
      ? mockClasses
      : mockClasses.filter((c) => c.section === sectionFilter);

  const totalStudents = mockClasses.reduce((s, c) => s + c.studentCount, 0);
  const avgAttendance = Math.round(
    mockClasses.reduce((s, c) => s + c.avgAttendance, 0) / mockClasses.length,
  );

  return (
    <div className="space-y-6" data-ocid="teacher-classes.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Classes</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Assigned classes and student rosters
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Classes",
            value: mockClasses.length,
            icon: BookOpen,
            color: "text-blue-500",
          },
          {
            label: "Total Students",
            value: totalStudents,
            icon: Users,
            color: "text-green-500",
          },
          {
            label: "Avg Attendance",
            value: `${avgAttendance}%`,
            icon: TrendingUp,
            color: "text-purple-500",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="p-2 rounded-xl bg-muted">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Section Filter */}
      <div className="flex items-center gap-3">
        <Select value={sectionFilter} onValueChange={setSectionFilter}>
          <SelectTrigger
            className="w-40"
            data-ocid="teacher-classes.section_filter.select"
          >
            <SelectValue placeholder="All Sections" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            {uniqueSections.map((s) => (
              <SelectItem key={s} value={s}>
                Section {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Class Cards */}
      <div className="space-y-4">
        {displayClasses.map((cls, idx) => (
          <div
            key={cls.id}
            className="bg-card border border-border rounded-2xl overflow-hidden"
            data-ocid={`teacher-classes.item.${idx + 1}`}
          >
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{cls.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {cls.subject} &bull; Section {cls.section}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="font-semibold text-foreground">
                    {cls.studentCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">
                    {cls.avgAttendance}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Avg Attendance
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setExpanded(expanded === cls.id ? null : cls.id)
                  }
                  data-ocid={`teacher-classes.toggle.${idx + 1}`}
                >
                  {expanded === cls.id ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" /> Hide Roster
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" /> View Roster
                    </>
                  )}
                </Button>
              </div>
            </div>

            {expanded === cls.id && (
              <div className="border-t border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                        Roll No
                      </th>
                      <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                        Name
                      </th>
                      <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                        Attendance %
                      </th>
                      <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cls.students.map((s) => (
                      <tr
                        key={s.rollNo}
                        className="border-t border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-5 py-3 text-muted-foreground">
                          {s.rollNo}
                        </td>
                        <td className="px-5 py-3 font-medium text-foreground">
                          {s.name}
                        </td>
                        <td className="px-5 py-3 text-foreground">
                          {s.attendance}%
                        </td>
                        <td className="px-5 py-3">
                          <Badge
                            variant={
                              s.attendance >= 85
                                ? "default"
                                : s.attendance >= 75
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {s.attendance >= 85
                              ? "Good"
                              : s.attendance >= 75
                                ? "Average"
                                : "Low"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
