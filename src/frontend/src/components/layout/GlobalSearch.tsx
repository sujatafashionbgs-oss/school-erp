import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { type Staff, mockStaff } from "@/data/mockStaff";
import { type Student, mockStudents } from "@/data/mockStudents";
import {
  FileText,
  GraduationCap,
  LayoutDashboard,
  Search,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const PAGES = [
  { label: "Dashboard", route: "/admin/dashboard" },
  { label: "Students", route: "/admin/students" },
  { label: "Staff", route: "/admin/staff" },
  { label: "Attendance", route: "/admin/attendance" },
  { label: "Fee Management", route: "/admin/fees" },
  { label: "Collect Fee", route: "/admin/fees/collect" },
  { label: "Admissions", route: "/admin/admissions" },
  { label: "Enquiry CRM", route: "/admin/enquiry" },
  { label: "Examinations", route: "/admin/exams" },
  { label: "Report Cards", route: "/admin/report-cards" },
  { label: "Timetable", route: "/admin/timetable" },
  { label: "Communication", route: "/admin/communication" },
  { label: "Notices", route: "/admin/notices" },
  { label: "Leave Management", route: "/admin/leave" },
  { label: "Transport", route: "/admin/transport" },
  { label: "Library", route: "/admin/library" },
  { label: "Certificates", route: "/admin/certificates" },
  { label: "Reports", route: "/admin/reports" },
  { label: "AI Analytics", route: "/admin/ai-analytics" },
  { label: "User Management", route: "/admin/users" },
  { label: "Settings", route: "/admin/settings" },
  { label: "Scholarships", route: "/admin/scholarships" },
  { label: "Grievances", route: "/admin/grievances" },
  { label: "Photo Gallery", route: "/admin/gallery" },
  { label: "Visitor / Gate Pass", route: "/admin/visitors" },
  { label: "Health Records", route: "/admin/health" },
  { label: "Online Fee Payment", route: "/admin/online-fee-payment" },
  { label: "Homework", route: "/admin/homework" },
  { label: "ID Cards", route: "/admin/id-cards" },
  { label: "Alumni", route: "/admin/alumni" },
  { label: "Inventory", route: "/admin/inventory" },
];

interface GlobalSearchProps {
  navigate: (path: string) => void;
}

function InfoField({
  label,
  value,
  highlight,
}: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <span
        className={`text-sm font-medium ${highlight ? "text-red-500 dark:text-red-400" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function Initials({
  name,
  className: cls,
}: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0 ${cls ?? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"}`}
    >
      {initials}
    </div>
  );
}

function StudentDetailSheet({
  student,
  onClose,
  navigate,
}: {
  student: Student | null;
  onClose: () => void;
  navigate: (path: string) => void;
}) {
  const statusColor =
    student?.status === "Active"
      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      : student?.status === "Transfer"
        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";

  return (
    <Sheet
      open={!!student}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        {student && (
          <>
            <SheetHeader className="pb-4">
              <div className="flex items-start gap-4">
                <Initials name={student.name} />
                <div className="flex-1 min-w-0">
                  <SheetTitle className="text-xl leading-tight">
                    {student.name}
                  </SheetTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {student.admissionNo}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Badge variant="outline" className="text-xs">
                      Class {student.className}-{student.section}
                    </Badge>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor}`}
                    >
                      {student.status}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="shrink-0 -mt-1"
                >
                  <X size={16} />
                </Button>
              </div>
            </SheetHeader>

            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <InfoField label="Father's Name" value={student.fatherName} />
                <InfoField label="Mother's Name" value={student.motherName} />
                <InfoField label="Date of Birth" value={student.dob} />
                <InfoField label="Gender" value={student.gender} />
                <InfoField label="Blood Group" value={student.bloodGroup} />
                <InfoField label="Mobile" value={student.mobile} />
                <InfoField label="Email" value={student.email} />
                <InfoField label="Category" value={student.category} />
                <InfoField label="Religion" value={student.religion} />
                <InfoField
                  label="Admission Date"
                  value={student.admissionDate}
                />
                <InfoField
                  label="Attendance"
                  value={`${student.attendance}%`}
                  highlight={student.attendance < 75}
                />
                <InfoField
                  label="Fee Due"
                  value={
                    student.feeDue > 0
                      ? `₹${student.feeDue.toLocaleString("en-IN")}`
                      : "No dues"
                  }
                  highlight={student.feeDue > 0}
                />
              </div>

              <div className="mt-4 col-span-2">
                <InfoField
                  label="Address"
                  value={`${student.address}, ${student.city}, ${student.state} - ${student.pin}`}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-6 border-t mt-6">
              <Button
                className="flex-1"
                onClick={() => {
                  navigate("/admin/students");
                  onClose();
                }}
                data-ocid="global_search.student_detail.view_profile_button"
              >
                View Full Profile
              </Button>
              {student.feeDue > 0 && (
                <Button
                  variant="outline"
                  className="flex-1 text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={() => {
                    navigate("/admin/fees/collect");
                    onClose();
                  }}
                  data-ocid="global_search.student_detail.collect_fee_button"
                >
                  Collect Fee
                </Button>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function StaffDetailSheet({
  staff,
  onClose,
  navigate,
}: {
  staff: Staff | null;
  onClose: () => void;
  navigate: (path: string) => void;
}) {
  const statusColor =
    staff?.status === "Active"
      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      : staff?.status === "On Leave"
        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";

  return (
    <Sheet
      open={!!staff}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        {staff && (
          <>
            <SheetHeader className="pb-4">
              <div className="flex items-start gap-4">
                <Initials
                  name={staff.name}
                  className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300"
                />
                <div className="flex-1 min-w-0">
                  <SheetTitle className="text-xl leading-tight">
                    {staff.name}
                  </SheetTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {staff.department}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {staff.designation}
                    </Badge>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor}`}
                    >
                      {staff.status}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="shrink-0 -mt-1"
                >
                  <X size={16} />
                </Button>
              </div>
            </SheetHeader>

            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <InfoField label="Staff ID" value={staff.staffId} />
                <InfoField label="Department" value={staff.department} />
                {staff.subject && (
                  <InfoField label="Subject" value={staff.subject} />
                )}
                <InfoField label="Mobile" value={staff.mobile} />
                <InfoField label="Email" value={staff.email} />
                <InfoField label="Join Date" value={staff.joinDate} />
                <InfoField label="Experience" value={staff.experience} />
                <InfoField label="Qualification" value={staff.qualification} />
                <InfoField
                  label="Monthly Salary"
                  value={`₹${staff.salary.toLocaleString("en-IN")}`}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-6 border-t mt-6">
              <Button
                className="flex-1"
                onClick={() => {
                  navigate("/admin/staff");
                  onClose();
                }}
                data-ocid="global_search.staff_detail.view_profile_button"
              >
                View Full Profile
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function GlobalSearch({ navigate }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const q = query.toLowerCase();

  const matchedStudents = mockStudents
    .filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q) ||
        s.mobile?.includes(q),
    )
    .slice(0, 5);

  const matchedStaff = mockStaff
    .filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.staffId.toLowerCase().includes(q) ||
        s.designation.toLowerCase().includes(q),
    )
    .slice(0, 5);

  const matchedPages = PAGES.filter((p) =>
    p.label.toLowerCase().includes(q),
  ).slice(0, 5);

  function go(route: string) {
    navigate(route);
    setOpen(false);
    setQuery("");
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        data-ocid="global_search.open_modal_button"
        className="hidden md:flex items-center gap-2 text-muted-foreground text-sm h-9 px-3 w-52"
      >
        <Search size={14} />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="text-[10px] bg-muted border border-border rounded px-1.5 py-0.5 font-mono">
          Ctrl+K
        </kbd>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        data-ocid="global_search.mobile.open_modal_button"
        className="md:hidden"
      >
        <Search size={18} />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setQuery("");
        }}
      >
        <CommandInput
          placeholder="Search students, staff, pages..."
          value={query}
          onValueChange={setQuery}
          data-ocid="global_search.search_input"
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {matchedStudents.length > 0 && (
            <CommandGroup heading="Students">
              {matchedStudents.map((s) => (
                <CommandItem
                  key={s.id}
                  onSelect={() => {
                    setSelectedStudent(s);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-2"
                  data-ocid="global_search.student.item"
                >
                  <GraduationCap size={14} className="text-blue-500 shrink-0" />
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted-foreground text-xs ml-auto">
                    Class {s.className}-{s.section} · {s.admissionNo}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {matchedStudents.length > 0 && matchedStaff.length > 0 && (
            <CommandSeparator />
          )}

          {matchedStaff.length > 0 && (
            <CommandGroup heading="Staff">
              {matchedStaff.map((s) => (
                <CommandItem
                  key={s.id}
                  onSelect={() => {
                    setSelectedStaff(s);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-2"
                  data-ocid="global_search.staff.item"
                >
                  <Users size={14} className="text-purple-500 shrink-0" />
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted-foreground text-xs ml-auto">
                    {s.designation}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {matchedPages.length > 0 && (
            <>
              {(matchedStudents.length > 0 || matchedStaff.length > 0) && (
                <CommandSeparator />
              )}
              <CommandGroup heading="Pages">
                {matchedPages.map((p) => (
                  <CommandItem
                    key={p.route}
                    onSelect={() => go(p.route)}
                    className="flex items-center gap-2"
                    data-ocid="global_search.page.item"
                  >
                    {p.label === "Dashboard" ? (
                      <LayoutDashboard
                        size={14}
                        className="text-green-500 shrink-0"
                      />
                    ) : (
                      <FileText
                        size={14}
                        className="text-orange-500 shrink-0"
                      />
                    )}
                    <span>{p.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>

      <StudentDetailSheet
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        navigate={navigate}
      />

      <StaffDetailSheet
        staff={selectedStaff}
        onClose={() => setSelectedStaff(null)}
        navigate={navigate}
      />
    </>
  );
}
