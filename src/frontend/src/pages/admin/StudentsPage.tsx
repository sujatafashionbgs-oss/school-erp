import { ExportButtons } from "@/components/ExportButtons";
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
import { Skeleton } from "@/components/ui/skeleton";
import { type Student, mockStudents } from "@/data/mockStudents";
import { useClassConfig } from "@/hooks/useClassConfig";
import { useLoadingData } from "@/hooks/useLoadingData";
import { Edit, Eye, Filter, Plus, Search, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
// xlsx is loaded dynamically at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const XLSX: any = typeof window !== "undefined" ? (window as any).XLSX : null;

interface StudentsPageProps {
  navigate: (path: string) => void;
}

function StudentsSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-28" />
      </div>
      {["sk0", "sk1", "sk2", "sk3", "sk4", "sk5"].map((k) => (
        <Skeleton key={k} className="h-16 rounded-2xl" />
      ))}
    </div>
  );
}

interface ImportRow {
  id: string;
  name: string;
  dob: string;
  gender: string;
  fatherName: string;
  mobile: string;
  address: string;
  admissionNo: string;
  className: string;
  section: string;
  category: string;
  edited: boolean;
}

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.trim().split("\n");
  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().replace(/^"|"$/g, ""));
  const rows = lines
    .slice(1)
    .map((line) =>
      line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, "")),
    );
  return { headers, rows };
}

const STUDENT_FIELDS = [
  "name",
  "dob",
  "gender",
  "fatherName",
  "mobile",
  "address",
  "admissionNo",
  "className",
  "section",
  "category",
  "(skip)",
];

export function StudentsPage({ navigate }: StudentsPageProps) {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const { loading } = useLoadingData(null);
  const { getActiveSections } = useClassConfig();

  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState<Partial<Student>>({});

  // Import dialog state
  const [importOpen, setImportOpen] = useState(false);
  const [importHeaders, setImportHeaders] = useState<string[]>([]);
  const [importRawRows, setImportRawRows] = useState<string[][]>([]);
  const [columnMap, setColumnMap] = useState<Record<number, string>>({});
  const [importRows, setImportRows] = useState<ImportRow[]>([]);
  const [importParsed, setImportParsed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (loading) return <StudentsSkeleton />;

  const classes = [...new Set(students.map((s) => s.className))].sort();
  const sections = classFilter
    ? getActiveSections(classFilter)
    : [...new Set(students.map((s) => s.section))].sort();

  const filtered = students.filter((s) => {
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNo.includes(search) ||
      s.mobile.includes(search);
    const matchClass = !classFilter || s.className === classFilter;
    const matchSection = !sectionFilter || s.section === sectionFilter;
    return matchSearch && matchClass && matchSection;
  });

  const handleEditOpen = (s: Student) => {
    setEditStudent(s);
    setEditForm({ ...s });
  };

  const handleEditSave = () => {
    if (!editStudent) return;
    setStudents((prev) =>
      prev.map((s) =>
        s.id === editStudent.id ? ({ ...s, ...editForm } as Student) : s,
      ),
    );
    toast.success("Student updated successfully");
    setEditStudent(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteStudent) return;
    setStudents((prev) => prev.filter((s) => s.id !== deleteStudent.id));
    toast.success("Student deleted");
    setDeleteStudent(null);
  };

  // CSV Import handlers
  const applyAutoMapping = (headers: string[]) => {
    const map: Record<number, string> = {};
    headers.forEach((h, idx) => {
      const lower = h.toLowerCase();
      if (
        lower.includes("name") &&
        !lower.includes("father") &&
        !lower.includes("mother")
      )
        map[idx] = "name";
      else if (lower.includes("dob") || lower.includes("birth"))
        map[idx] = "dob";
      else if (lower.includes("gender")) map[idx] = "gender";
      else if (lower.includes("father")) map[idx] = "fatherName";
      else if (lower.includes("mobile") || lower.includes("phone"))
        map[idx] = "mobile";
      else if (lower.includes("address")) map[idx] = "address";
      else if (lower.includes("admission")) map[idx] = "admissionNo";
      else if (lower.includes("class")) map[idx] = "className";
      else if (lower.includes("section")) map[idx] = "section";
      else if (lower.includes("category")) map[idx] = "category";
      else map[idx] = "(skip)";
    });
    return map;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const data = new Uint8Array(ev.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonRows = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
        }) as string[][];
        if (jsonRows.length < 2) return;
        const headers = jsonRows[0].map(String);
        const rows = jsonRows
          .slice(1)
          .map((r) => headers.map((_, i) => String(r[i] ?? "")));
        setImportHeaders(headers);
        setImportRawRows(rows);
        setColumnMap(applyAutoMapping(headers));
        setImportParsed(false);
        setImportRows([]);
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        const { headers, rows } = parseCSV(text);
        setImportHeaders(headers);
        setImportRawRows(rows);
        setColumnMap(applyAutoMapping(headers));
        setImportParsed(false);
        setImportRows([]);
      };
      reader.readAsText(file);
    }
  };

  const handleParsePreview = () => {
    const rows: ImportRow[] = importRawRows.map((row, idx) => {
      const mapped: Record<string, string> = {};
      for (const [colIdx, field] of Object.entries(columnMap)) {
        if (field !== "(skip)") {
          mapped[field] = row[Number(colIdx)] ?? "";
        }
      }
      return {
        id: `import-${idx}`,
        name: mapped.name ?? "",
        dob: mapped.dob ?? "",
        gender: mapped.gender ?? "Male",
        fatherName: mapped.fatherName ?? "",
        mobile: mapped.mobile ?? "",
        address: mapped.address ?? "",
        admissionNo: mapped.admissionNo ?? `IMP-${Date.now()}-${idx}`,
        className: mapped.className ?? "I",
        section: mapped.section ?? "A",
        category: mapped.category ?? "General",
        edited: false,
      };
    });
    setImportRows(rows);
    setImportParsed(true);
  };

  const updateImportRow = (
    id: string,
    field: keyof ImportRow,
    value: string,
  ) => {
    setImportRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, [field]: value, edited: true } : r,
      ),
    );
  };

  const handleImportAll = () => {
    const valid = importRows.filter((r) => r.name && r.admissionNo);
    const newStudents: Student[] = valid.map((r) => ({
      id: `s-imp-${Date.now()}-${r.id}`,
      admissionNo: r.admissionNo,
      name: r.name,
      fatherName: r.fatherName,
      motherName: "",
      dob: r.dob,
      gender: (r.gender === "Female" ? "Female" : "Male") as "Male" | "Female",
      className: r.className,
      section: r.section,
      rollNo: "",
      mobile: r.mobile,
      email: "",
      address: r.address,
      city: "",
      state: "",
      pin: "",
      admissionDate: new Date().toISOString().split("T")[0],
      bloodGroup: "",
      religion: "",
      category: r.category,
      attendance: 0,
      feeDue: 0,
      status: "Active",
    }));
    setStudents((prev) => [...prev, ...newStudents]);
    toast.success(`${newStudents.length} students imported successfully!`);
    setImportOpen(false);
    setImportRows([]);
    setImportParsed(false);
    setImportHeaders([]);
    setImportRawRows([]);
  };

  const exportData = filtered.map((s) => ({
    Name: s.name,
    "Admission No": s.admissionNo,
    Class: s.className,
    Section: s.section,
    Gender: s.gender,
    Mobile: s.mobile,
    Status: s.status,
    "Fee Due": s.feeDue,
  }));

  return (
    <div className="space-y-5" data-ocid="students.page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground text-sm">
            {filtered.length} of {students.length} students
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <ExportButtons title="Students_Report" data={exportData} />
          <Button
            variant="outline"
            onClick={() => setImportOpen(true)}
            data-ocid="students.import.button"
          >
            <Upload size={16} className="mr-1" /> Import
          </Button>
          <Button
            onClick={() => navigate("/admin/students/add")}
            data-ocid="students.add.button"
          >
            <Plus size={16} className="mr-1" /> Add Student
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            className="pl-9"
            placeholder="Search by name, admission no, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="students.search_input"
          />
        </div>
        <div className="relative">
          <Filter
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <select
            className="pl-9 pr-4 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={classFilter}
            onChange={(e) => {
              setClassFilter(e.target.value);
              setSectionFilter("");
            }}
            data-ocid="students.class_filter.select"
          >
            <option value="">All Classes</option>
            {classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            className="px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            data-ocid="students.section_filter.select"
          >
            <option value="">All Sections</option>
            {sections.map((s) => (
              <option key={s} value={s}>
                Section {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2" data-ocid="students.list">
        {filtered.map((s: Student, i: number) => (
          <div
            key={s.admissionNo}
            data-ocid={`students.item.${i + 1}`}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border border-border rounded-2xl px-5 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                {s.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">
                  {s.admissionNo} · Class {s.className}-{s.section} · {s.gender}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={s.feeDue > 0 ? "destructive" : "secondary"}
                className="text-xs"
              >
                {s.feeDue > 0 ? `₹${s.feeDue} due` : "Fee clear"}
              </Badge>
              <Badge
                variant={s.status === "Active" ? "secondary" : "outline"}
                className="text-xs"
              >
                {s.status}
              </Badge>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewStudent(s)}
                  data-ocid={`students.view.button.${i + 1}`}
                >
                  <Eye size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleEditOpen(s)}
                  data-ocid={`students.edit_button.${i + 1}`}
                >
                  <Edit size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setDeleteStudent(s)}
                  data-ocid={`students.delete_button.${i + 1}`}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div
            className="text-center py-10 text-muted-foreground"
            data-ocid="students.empty_state"
          >
            No students found.
          </div>
        )}
      </div>

      {/* View Modal */}
      <Dialog
        open={!!viewStudent}
        onOpenChange={(open) => !open && setViewStudent(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {viewStudent && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {(
                [
                  ["Name", viewStudent.name],
                  ["Admission No", viewStudent.admissionNo],
                  [
                    "Class",
                    `${viewStudent.className} - ${viewStudent.section}`,
                  ],
                  ["Gender", viewStudent.gender],
                  ["DOB", viewStudent.dob],
                  ["Blood Group", viewStudent.bloodGroup],
                  ["Father", viewStudent.fatherName],
                  ["Mother", viewStudent.motherName],
                  ["Mobile", viewStudent.mobile],
                  ["Email", viewStudent.email],
                  ["Address", viewStudent.address],
                  ["City", viewStudent.city],
                  ["State", viewStudent.state],
                  ["PIN", viewStudent.pin],
                  ["Attendance", `${viewStudent.attendance}%`],
                  [
                    "Fee Due",
                    viewStudent.feeDue > 0 ? `₹${viewStudent.feeDue}` : "None",
                  ],
                  ["Status", viewStudent.status],
                ] as [string, string][]
              ).map(([label, value]) => (
                <div key={label}>
                  <span className="text-muted-foreground">{label}: </span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewStudent(null)}
              data-ocid="students.view.close_button"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog
        open={!!editStudent}
        onOpenChange={(open) => !open && setEditStudent(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          {editStudent && (
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  ["name", "Name"],
                  ["fatherName", "Father Name"],
                  ["motherName", "Mother Name"],
                  ["mobile", "Mobile"],
                  ["email", "Email"],
                  ["address", "Address"],
                  ["city", "City"],
                  ["state", "State"],
                  ["pin", "PIN"],
                  ["bloodGroup", "Blood Group"],
                ] as [keyof Student, string][]
              ).map(([field, label]) => (
                <div key={field} className="space-y-1">
                  <Label className="text-xs">{label}</Label>
                  <Input
                    value={(editForm[field] as string) ?? ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                    className="h-8 text-sm"
                    data-ocid={`students.edit.${field}.input`}
                  />
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditStudent(null)}
              data-ocid="students.edit.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSave}
              data-ocid="students.edit.save_button"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!deleteStudent}
        onOpenChange={(open) => !open && setDeleteStudent(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {deleteStudent?.name}
            </span>
            ? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteStudent(null)}
              data-ocid="students.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              data-ocid="students.delete.confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Students from CSV</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            {/* Step 1: File upload */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Step 1: Upload CSV File
              </Label>
              <button
                type="button"
                className="w-full border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                data-ocid="students.import.dropzone"
              >
                <Upload
                  size={24}
                  className="mx-auto text-muted-foreground mb-2"
                />
                <p className="text-sm text-muted-foreground">
                  Click to upload a CSV file
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Columns: name, dob, gender, fatherName, mobile, address,
                  admissionNo, className, section, category
                </p>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={handleFileChange}
                data-ocid="students.import.upload_button"
              />
            </div>

            {/* Step 2: Column mapping */}
            {importHeaders.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  Step 2: Map Columns
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {importHeaders.map((header, idx) => (
                    <div key={header} className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        CSV: {header}
                      </Label>
                      <select
                        value={columnMap[idx] ?? "(skip)"}
                        onChange={(e) =>
                          setColumnMap((prev) => ({
                            ...prev,
                            [idx]: e.target.value,
                          }))
                        }
                        className="w-full h-8 px-2 rounded border border-input bg-background text-sm"
                      >
                        {STUDENT_FIELDS.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <Button
                  size="sm"
                  onClick={handleParsePreview}
                  data-ocid="students.import.parse_button"
                >
                  Parse & Preview
                </Button>
              </div>
            )}

            {/* Step 3: Editable preview table */}
            {importParsed && importRows.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  Step 3: Review & Edit ({importRows.length} rows)
                </Label>
                <div className="overflow-x-auto border border-border rounded-xl">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border">
                        {[
                          "Name",
                          "Admission No",
                          "Class",
                          "Section",
                          "Gender",
                          "Mobile",
                          "Father Name",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-3 py-2 text-left font-semibold text-muted-foreground"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {importRows.map((row) => (
                        <tr
                          key={row.id}
                          className={`border-b border-border last:border-0 ${row.edited ? "bg-primary/5" : ""}`}
                        >
                          {(
                            [
                              "name",
                              "admissionNo",
                              "className",
                              "section",
                              "gender",
                              "mobile",
                              "fatherName",
                            ] as (keyof ImportRow)[]
                          ).map((field) => (
                            <td key={field} className="px-2 py-1">
                              <input
                                type="text"
                                value={row[field] as string}
                                onChange={(e) =>
                                  updateImportRow(row.id, field, e.target.value)
                                }
                                className="w-full px-2 py-1 rounded border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-ring min-w-16"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setImportOpen(false);
                setImportParsed(false);
                setImportRows([]);
                setImportHeaders([]);
              }}
              data-ocid="students.import.cancel_button"
            >
              Cancel
            </Button>
            {importParsed && importRows.length > 0 && (
              <Button
                onClick={handleImportAll}
                data-ocid="students.import.confirm_button"
              >
                Import All ({importRows.filter((r) => r.name).length} valid)
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
