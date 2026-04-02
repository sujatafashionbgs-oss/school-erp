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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CLASSES, SECTIONS } from "@/data/classConfig";
import { mockStudents } from "@/data/mockStudents";
import { useClassConfig } from "@/hooks/useClassConfig";
import { ArrowRightLeft, History, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TransferLog {
  id: string;
  studentName: string;
  fromClass: string;
  fromSection: string;
  toClass: string;
  toSection: string;
  date: string;
  reason: string;
}

const CLASS_ORDER = [
  "Pre-Nursery",
  "Nursery",
  "KG",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
];

function getNextClass(current: string): string {
  const idx = CLASS_ORDER.indexOf(current);
  if (idx === -1 || idx >= CLASS_ORDER.length - 1) return current;
  return CLASS_ORDER[idx + 1];
}

interface Props {
  navigate: (path: string) => void;
}

export function StudentTransferPage({ navigate: _navigate }: Props) {
  const { getAllClasses, getActiveSections } = useClassConfig();
  const classes = getAllClasses();

  const [students, setStudents] = useState(mockStudents);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [newClass, setNewClass] = useState("");
  const [newSection, setNewSection] = useState("");
  const [reason, setReason] = useState("");
  const [logs, setLogs] = useState<TransferLog[]>([
    {
      id: "l1",
      studentName: "Aarav Sharma",
      fromClass: "VII",
      fromSection: "A",
      toClass: "VIII",
      toSection: "A",
      date: "2026-04-01",
      reason: "Annual promotion",
    },
    {
      id: "l2",
      studentName: "Priya Singh",
      fromClass: "VIII",
      fromSection: "A",
      toClass: "VIII",
      toSection: "B",
      date: "2026-06-10",
      reason: "Section rebalancing",
    },
  ]);

  // Bulk promotion
  const [bulkClass, setBulkClass] = useState("");
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);
  const filteredStudents = students.filter((s) => {
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNo.includes(search);
    const matchClass = classFilter === "all" || s.className === classFilter;
    const matchSection = sectionFilter === "all" || s.section === sectionFilter;
    return matchSearch && matchClass && matchSection;
  });

  const newSections = newClass ? getActiveSections(newClass) : [];

  const handleTransfer = () => {
    if (!selectedStudent || !newClass || !newSection) {
      toast.error("Please select student, class and section");
      return;
    }
    const log: TransferLog = {
      id: `l${Date.now()}`,
      studentName: selectedStudent.name,
      fromClass: selectedStudent.className,
      fromSection: selectedStudent.section,
      toClass: newClass,
      toSection: newSection,
      date: new Date().toISOString().split("T")[0],
      reason: reason || "Manual transfer",
    };
    setLogs((prev) => [log, ...prev]);
    setStudents((prev) =>
      prev.map((s) =>
        s.id === selectedStudent.id
          ? { ...s, className: newClass, section: newSection }
          : s,
      ),
    );
    toast.success(
      `${selectedStudent.name} transferred to ${newClass}-${newSection}`,
    );
    setSelectedStudentId(null);
    setSearch("");
    setNewClass("");
    setNewSection("");
    setReason("");
  };

  const handleBulkPromotion = () => {
    if (!bulkClass) {
      toast.error("Please select a class to promote");
      return;
    }
    const nextClass = getNextClass(bulkClass);
    if (nextClass === bulkClass) {
      toast.error("No next class found");
      return;
    }
    const classStudents = students.filter((s) => s.className === bulkClass);
    const newLogs: TransferLog[] = classStudents.map((s) => ({
      id: `l${Date.now()}-${s.id}`,
      studentName: s.name,
      fromClass: s.className,
      fromSection: s.section,
      toClass: nextClass,
      toSection: s.section,
      date: new Date().toISOString().split("T")[0],
      reason: "Year-end bulk promotion",
    }));
    setLogs((prev) => [...newLogs, ...prev]);
    setStudents((prev) =>
      prev.map((s) =>
        s.className === bulkClass ? { ...s, className: nextClass } : s,
      ),
    );
    toast.success(
      `${classStudents.length} students promoted from ${bulkClass} to ${nextClass}`,
    );
    setBulkConfirmOpen(false);
    setBulkClass("");
  };

  return (
    <div className="space-y-6" data-ocid="student_transfer.page">
      <div className="flex items-center gap-3">
        <ArrowRightLeft className="text-primary" size={24} />
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Student Transfer & Promotion
          </h1>
          <p className="text-sm text-muted-foreground">
            Transfer students between sections or promote to next class
          </p>
        </div>
      </div>

      <Tabs defaultValue="individual">
        <TabsList>
          <TabsTrigger
            value="individual"
            data-ocid="student_transfer.individual.tab"
          >
            Individual Transfer
          </TabsTrigger>
          <TabsTrigger value="bulk" data-ocid="student_transfer.bulk.tab">
            Bulk Promotion
          </TabsTrigger>
          <TabsTrigger value="history" data-ocid="student_transfer.history.tab">
            History Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="mt-5">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
            {/* Student Search */}
            <div className="space-y-2">
              <Label>Search Student</Label>
              <div className="flex gap-2 flex-wrap mb-2">
                <Select
                  value={classFilter}
                  onValueChange={(v) => {
                    setClassFilter(v);
                    setSectionFilter("all");
                  }}
                >
                  <SelectTrigger
                    className="w-36"
                    data-ocid="student_transfer.class_filter.select"
                  >
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    <SelectItem value="all">All Classes</SelectItem>
                    {CLASSES.map((c) => (
                      <SelectItem key={c} value={c}>
                        Class {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={sectionFilter}
                  onValueChange={setSectionFilter}
                  disabled={classFilter === "all"}
                >
                  <SelectTrigger
                    className="w-36"
                    data-ocid="student_transfer.section_filter.select"
                  >
                    <SelectValue placeholder="All Sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {(classFilter === "XI" || classFilter === "XII"
                      ? [...SECTIONS, "Science", "Commerce", "Arts"]
                      : SECTIONS
                    ).map((s) => (
                      <SelectItem key={s} value={s}>
                        Section {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  className="pl-9"
                  placeholder="Name or admission number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  data-ocid="student_transfer.search.input"
                />
              </div>
              {(search || classFilter !== "all") &&
                filteredStudents.length > 0 && (
                  <div className="border border-border rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                    {filteredStudents.map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => {
                          setSelectedStudentId(s.id);
                          setSearch(s.name);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-muted/40 text-sm border-b border-border last:border-0"
                      >
                        <span className="font-medium">{s.name}</span>
                        <span className="text-muted-foreground ml-2">
                          {s.admissionNo} · Class {s.className}-{s.section}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
            </div>

            {selectedStudent && (
              <div className="p-4 bg-muted/30 rounded-xl">
                <p className="text-sm font-semibold text-foreground">
                  {selectedStudent.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Current: Class {selectedStudent.className}-
                  {selectedStudent.section} · {selectedStudent.admissionNo}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>New Class</Label>
                <select
                  value={newClass}
                  onChange={(e) => {
                    setNewClass(e.target.value);
                    setNewSection("");
                  }}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                  data-ocid="student_transfer.new_class.select"
                >
                  <option value="">Select Class</option>
                  {classes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>New Section</Label>
                <select
                  value={newSection}
                  onChange={(e) => setNewSection(e.target.value)}
                  disabled={!newClass}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm disabled:opacity-50"
                  data-ocid="student_transfer.new_section.select"
                >
                  <option value="">Select Section</option>
                  {newSections.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Reason</Label>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Transfer reason"
                  data-ocid="student_transfer.reason.input"
                />
              </div>
            </div>

            <Button
              onClick={handleTransfer}
              disabled={!selectedStudentId || !newClass || !newSection}
              data-ocid="student_transfer.save.button"
            >
              <ArrowRightLeft size={14} className="mr-2" /> Save Transfer
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="bulk" className="mt-5">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
            <div>
              <h2 className="font-semibold text-foreground mb-1">
                Year-End Bulk Promotion
              </h2>
              <p className="text-sm text-muted-foreground">
                Promote all students in a class to the next class.
              </p>
            </div>
            <div className="space-y-1.5 max-w-xs">
              <Label>Select Class to Promote From</Label>
              <select
                value={bulkClass}
                onChange={(e) => setBulkClass(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                data-ocid="student_transfer.bulk_class.select"
              >
                <option value="">Select Class</option>
                {classes.slice(0, -1).map((c) => (
                  <option key={c} value={c}>
                    {c} ({students.filter((s) => s.className === c).length}{" "}
                    students)
                  </option>
                ))}
              </select>
            </div>
            {bulkClass && (
              <div className="p-4 bg-muted/30 rounded-xl text-sm">
                <p className="text-foreground">
                  Will promote{" "}
                  <strong>
                    {students.filter((s) => s.className === bulkClass).length}
                  </strong>{" "}
                  students from <strong>{bulkClass}</strong> →{" "}
                  <strong>{getNextClass(bulkClass)}</strong>
                </p>
              </div>
            )}
            <Button
              onClick={() => setBulkConfirmOpen(true)}
              disabled={!bulkClass}
              data-ocid="student_transfer.bulk_promote.button"
            >
              Promote All to Next Class
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-5">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center gap-2">
              <History size={16} className="text-muted-foreground" />
              <h2 className="font-semibold text-foreground">
                Transfer History
              </h2>
              <span className="ml-auto text-sm text-muted-foreground">
                {logs.length} records
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                      Student
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                      From
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                      To
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr
                      key={log.id}
                      className="border-b border-border last:border-0"
                      data-ocid={`student_transfer.history.item.${i + 1}`}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {log.studentName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {log.fromClass}-{log.fromSection}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {log.toClass}-{log.toSection}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {log.date}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {log.reason}
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-muted-foreground"
                        data-ocid="student_transfer.history.empty_state"
                      >
                        No transfer records yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bulk Confirm Dialog */}
      <Dialog open={bulkConfirmOpen} onOpenChange={setBulkConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Bulk Promotion</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to promote all students from{" "}
            <strong className="text-foreground">{bulkClass}</strong> to{" "}
            <strong className="text-foreground">
              {getNextClass(bulkClass)}
            </strong>
            ? This will update all{" "}
            {students.filter((s) => s.className === bulkClass).length} student
            records.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBulkConfirmOpen(false)}
              data-ocid="student_transfer.bulk_cancel.button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkPromotion}
              data-ocid="student_transfer.bulk_confirm.button"
            >
              Confirm Promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
