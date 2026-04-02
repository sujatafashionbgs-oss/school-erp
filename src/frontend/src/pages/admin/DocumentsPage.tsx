import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CLASSES, SECTIONS } from "@/data/classConfig";
import { type Student, mockStudents } from "@/data/mockStudents";
import {
  Download,
  FileText,
  MessageCircle,
  Search,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const DOC_TYPES = [
  "Birth Certificate",
  "Aadhaar Card",
  "Transfer Certificate",
  "Previous Marksheet",
  "Passport Photo",
  "Caste Certificate",
  "Address Proof",
  "Medical Certificate",
  "Character Certificate",
];

type DocStatus = "Uploaded" | "Pending" | "Rejected";

interface StudentDoc {
  type: string;
  status: DocStatus;
  uploadDate: string;
}

function getInitialDocs(studentId: string): StudentDoc[] {
  const seed = studentId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return DOC_TYPES.map((type, i) => {
    const r = (seed * (i + 7)) % 10;
    const status: DocStatus =
      r < 5 ? "Uploaded" : r < 8 ? "Pending" : "Rejected";
    return {
      type,
      status,
      uploadDate:
        status === "Uploaded" ? `2026-0${1 + (i % 3)}-${10 + (i % 15)}` : "",
    };
  });
}

export function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student>(
    mockStudents[0],
  );
  const [docsMap, setDocsMap] = useState<Record<string, StudentDoc[]>>(
    Object.fromEntries(mockStudents.map((s) => [s.id, getInitialDocs(s.id)])),
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const filteredStudents = mockStudents.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.admissionNo.toLowerCase().includes(q);
    const matchClass = classFilter === "all" || s.className === classFilter;
    const matchSection = sectionFilter === "all" || s.section === sectionFilter;
    return matchSearch && matchClass && matchSection;
  });

  const selectedDocs = docsMap[selectedStudent.id] ?? [];

  // Stats
  const totalStudents = mockStudents.length;
  const completeCount = mockStudents.filter((s) =>
    (docsMap[s.id] ?? []).every((d) => d.status === "Uploaded"),
  ).length;
  const pendingCount = mockStudents.filter((s) =>
    (docsMap[s.id] ?? []).some((d) => d.status === "Pending"),
  ).length;
  const rejectedCount = mockStudents.filter((s) =>
    (docsMap[s.id] ?? []).some((d) => d.status === "Rejected"),
  ).length;

  function changeDocStatus(docType: string, newStatus: DocStatus) {
    setDocsMap((prev) => ({
      ...prev,
      [selectedStudent.id]: (prev[selectedStudent.id] ?? []).map((d) =>
        d.type === docType
          ? {
              ...d,
              status: newStatus,
              uploadDate:
                newStatus === "Uploaded"
                  ? new Date().toISOString().slice(0, 10)
                  : d.uploadDate,
            }
          : d,
      ),
    }));
  }

  function handleUploadClick(docType: string) {
    setUploadingDoc(docType);
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !uploadingDoc) return;
    changeDocStatus(uploadingDoc, "Uploaded");
    toast.success(`Document uploaded successfully: ${file.name}`);
    setUploadingDoc(null);
    e.target.value = "";
  }

  function sendDocRequest() {
    const missing = selectedDocs.filter((d) => d.status !== "Uploaded");
    if (missing.length === 0) {
      toast.info("All documents are already uploaded");
      return;
    }
    const list = missing.map((d) => d.type).join(", ");
    const msg = encodeURIComponent(
      `Dear Parent of ${selectedStudent.name}, Please submit the following documents at the earliest:\n${list}\n\nRegards, SmartSkale School`,
    );
    window.open(
      `https://wa.me/91${selectedStudent.mobile}?text=${msg}`,
      "_blank",
    );
  }

  function exportCSV() {
    const rows = [
      ["Student", "Admission No", "Class", ...DOC_TYPES],
      ...mockStudents.map((s) => {
        const docs = docsMap[s.id] ?? [];
        return [
          s.name,
          s.admissionNo,
          `${s.className}-${s.section}`,
          ...DOC_TYPES.map(
            (type) => docs.find((d) => d.type === type)?.status ?? "Pending",
          ),
        ];
      }),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document_status.csv";
    a.click();
    toast.success("CSV exported");
  }

  const STATUS_STYLES: Record<DocStatus, string> = {
    Uploaded: "bg-green-500/10 text-green-700 border-green-200",
    Pending: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
    Rejected: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <div className="space-y-5" data-ocid="documents.page">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground">
          Student Documents
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={exportCSV}
          data-ocid="documents.export_csv.button"
        >
          <Download size={14} className="mr-2" /> Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Total Students",
            value: totalStudents,
            color: "text-foreground",
          },
          {
            label: "All Documents Complete",
            value: completeCount,
            color: "text-green-600",
          },
          {
            label: "Documents Pending",
            value: pendingCount,
            color: "text-yellow-600",
          },
          {
            label: "Documents Rejected",
            value: rejectedCount,
            color: "text-destructive",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-2xl p-4"
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT: Student Selector */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3 h-fit max-h-[600px] flex flex-col">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              className="pl-8 text-sm"
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="documents.search.input"
            />
          </div>
          <Select
            value={classFilter}
            onValueChange={(v) => {
              setClassFilter(v);
              setSectionFilter("all");
            }}
          >
            <SelectTrigger
              className="text-sm"
              data-ocid="documents.class_filter.select"
            >
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent className="max-h-48 overflow-y-auto">
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
              className="text-sm"
              data-ocid="documents.section_filter.select"
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
          <div className="flex-1 overflow-y-auto space-y-1">
            {filteredStudents.map((s) => {
              const docs = docsMap[s.id] ?? [];
              const complete = docs.every((d) => d.status === "Uploaded");
              const hasRejected = docs.some((d) => d.status === "Rejected");
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`w-full text-left p-3 rounded-xl border transition-colors ${
                    selectedStudent.id === s.id
                      ? "bg-primary/10 border-primary/30"
                      : "border-transparent hover:bg-secondary/50"
                  }`}
                  onClick={() => setSelectedStudent(s)}
                  data-ocid={`documents.student.${s.id}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {s.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {s.admissionNo} · {s.className}-{s.section}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {complete ? (
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      ) : hasRejected ? (
                        <div className="w-2 h-2 rounded-full bg-destructive" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
            {filteredStudents.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">
                No students found
              </p>
            )}
          </div>
        </div>

        {/* RIGHT: Document List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h2 className="font-semibold text-foreground text-lg">
                  {selectedStudent.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedStudent.admissionNo} · Class{" "}
                  {selectedStudent.className}-{selectedStudent.section}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    toast.info(
                      `Downloading all documents for ${selectedStudent.name}...`,
                    )
                  }
                  data-ocid="documents.download_all.button"
                >
                  <Download size={13} className="mr-1" /> Download All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={sendDocRequest}
                  data-ocid="documents.send_request.button"
                >
                  <MessageCircle size={13} className="mr-1" /> Request Missing
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {selectedDocs.map((doc, i) => (
                <div
                  key={doc.type}
                  className="flex items-center gap-3 p-3 border border-border rounded-xl hover:bg-secondary/20 transition-colors"
                  data-ocid={`documents.doc_row.${i + 1}`}
                >
                  <FileText
                    size={16}
                    className="text-muted-foreground shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {doc.type}
                    </p>
                    {doc.uploadDate && (
                      <p className="text-xs text-muted-foreground">
                        Uploaded: {doc.uploadDate}
                      </p>
                    )}
                  </div>
                  <Badge className={STATUS_STYLES[doc.status]}>
                    {doc.status}
                  </Badge>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      onClick={() => handleUploadClick(doc.type)}
                      data-ocid={`documents.upload.${i + 1}`}
                    >
                      <Upload size={11} className="mr-1" /> Upload
                    </Button>
                    {doc.status === "Uploaded" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs"
                        onClick={() => toast.info("Opening document...")}
                        data-ocid={`documents.view.${i + 1}`}
                      >
                        View
                      </Button>
                    )}
                    {doc.status !== "Uploaded" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs text-green-600 hover:text-green-700"
                        onClick={() => {
                          changeDocStatus(doc.type, "Uploaded");
                          toast.success(`${doc.type} approved`);
                        }}
                        data-ocid={`documents.approve.${i + 1}`}
                      >
                        Approve
                      </Button>
                    )}
                    {doc.status !== "Rejected" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                        onClick={() => {
                          changeDocStatus(doc.type, "Rejected");
                          toast.warning(`${doc.type} rejected`);
                        }}
                        data-ocid={`documents.reject.${i + 1}`}
                      >
                        Reject
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
