import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CLASSES, SECTIONS } from "@/data/classConfig";
import { mockStudents } from "@/data/mockStudents";
import { Download, FileText, QrCode, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function makeVerifyCode(admissionNo: string): string {
  let hash = 0;
  for (let i = 0; i < admissionNo.length; i++) {
    hash = ((hash << 5) - hash + admissionNo.charCodeAt(i)) | 0;
  }
  return `RC-${Math.abs(hash).toString(36).toUpperCase().slice(0, 8)}`;
}

function getStudentMarks(studentId: string) {
  const subjects = [
    "Mathematics",
    "Science",
    "Hindi",
    "English",
    "Social Studies",
  ];
  const seed = studentId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return subjects.map((subject, i) => ({
    subject,
    max: 100,
    obtained: 50 + ((seed * (i + 7)) % 45),
  }));
}

export function ReportCardPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(mockStudents[0]);
  const [showQR, setShowQR] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkClass, setBulkClass] = useState("all");
  const [bulkSection, setBulkSection] = useState("all");

  const subjectMarks = selected ? getStudentMarks(selected.id) : [];

  const filtered = mockStudents.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNo.includes(search);
    const matchClass = bulkClass === "all" || s.className === bulkClass;
    const matchSection = bulkSection === "all" || s.section === bulkSection;
    return matchSearch && matchClass && matchSection;
  });

  const total = subjectMarks.reduce((a, s) => a + s.obtained, 0);
  const maxTotal = subjectMarks.reduce((a, s) => a + s.max, 0);
  const percentage = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
  const grade =
    percentage >= 90
      ? "A+"
      : percentage >= 80
        ? "A"
        : percentage >= 70
          ? "B"
          : percentage >= 60
            ? "C"
            : "D";

  const verifyCode = selected ? makeVerifyCode(selected.admissionNo) : "";
  const verifyUrl = `${window.location.origin}${window.location.pathname}#/verify?code=${verifyCode}&name=${encodeURIComponent(selected?.name || "")}&class=${encodeURIComponent(`${selected?.className || ""}-${selected?.section || ""}`)}&pct=${percentage}&grade=${grade}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}`;

  function handleDownload() {
    toast.info("Preparing download... Use your browser's print/save dialog.");
    window.print();
  }

  return (
    <div
      className={`space-y-5 ${selectedIds.length > 0 ? "pb-20" : ""}`}
      data-ocid="report_card.page"
    >
      <h1 className="text-2xl font-bold text-foreground">Report Cards</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel */}
        <div className="bg-card border border-border rounded-2xl p-5">
          {/* Bulk Export Panel */}
          <div className="mb-3 p-3 bg-secondary/30 rounded-xl border border-border space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Bulk Export
            </p>
            <select
              value={bulkClass}
              onChange={(e) => setBulkClass(e.target.value)}
              className="w-full h-8 px-2 rounded-lg border border-input bg-background text-sm"
              data-ocid="report_card.bulk_class.select"
            >
              <option value="all">All Classes</option>
              {CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={bulkSection}
              onChange={(e) => setBulkSection(e.target.value)}
              className="w-full h-8 px-2 rounded-lg border border-input bg-background text-sm"
              data-ocid="report_card.bulk_section.select"
            >
              <option value="all">All Sections</option>
              {SECTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={
                  filtered.length > 0 &&
                  filtered.every((s) => selectedIds.includes(s.id))
                }
                onChange={(e) =>
                  setSelectedIds(
                    e.target.checked ? filtered.map((s) => s.id) : [],
                  )
                }
                className="w-4 h-4 cursor-pointer"
                data-ocid="report_card.select_all.checkbox"
              />
              Select All ({filtered.length} filtered)
            </label>
          </div>

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student..."
            className="mb-3"
            data-ocid="report_card.search.input"
          />
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filtered.map((s, i) => (
              <div
                key={s.id}
                className="flex items-center gap-2"
                data-ocid={`report_card.student.item.${i + 1}`}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(s.id)}
                  onChange={(e) => {
                    setSelectedIds((prev) =>
                      e.target.checked
                        ? [...prev, s.id]
                        : prev.filter((id) => id !== s.id),
                    );
                  }}
                  onClick={(ev) => ev.stopPropagation()}
                  className="w-4 h-4 cursor-pointer shrink-0"
                  data-ocid={`report_card.student.checkbox.${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelected(s);
                    setShowQR(false);
                  }}
                  className={`flex-1 text-left p-3 rounded-xl transition-colors ${
                    selected?.id === s.id
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-secondary"
                  }`}
                >
                  <p className="text-sm font-medium text-foreground">
                    {s.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Class {s.className} · {s.admissionNo}
                  </p>
                </button>
              </div>
            ))}
          </div>
        </div>

        {selected && (
          <div
            className="lg:col-span-2 bg-card border border-border rounded-2xl p-6"
            data-ocid="report_card.preview.card"
          >
            <div className="flex items-start justify-between mb-6 gap-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {selected.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Class {selected.className}-{selected.section} · Roll{" "}
                  {selected.rollNo}
                </p>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  Verification: {verifyCode}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowQR((v) => !v)}
                >
                  <QrCode size={14} className="mr-1" />
                  {showQR ? "Hide" : "Show"} QR
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownload}
                  data-ocid="report_card.download.button"
                >
                  <Download size={14} className="mr-1" /> Download
                </Button>
              </div>
            </div>

            {showQR && (
              <div className="mb-6 flex items-start gap-4 p-4 bg-secondary/30 rounded-2xl border border-border">
                <img
                  src={qrSrc}
                  alt="Verification QR Code"
                  className="w-28 h-28 rounded-xl border border-border bg-white"
                />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-green-500" />
                    Document Verification QR
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Scan this QR code to verify the authenticity of this report
                    card online.
                  </p>
                  <p className="text-xs font-mono text-muted-foreground break-all">
                    Code: {verifyCode}
                  </p>
                </div>
              </div>
            )}

            <table className="w-full mb-4">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-xs font-semibold text-muted-foreground">
                    Subject
                  </th>
                  <th className="text-right py-2 text-xs font-semibold text-muted-foreground">
                    Max
                  </th>
                  <th className="text-right py-2 text-xs font-semibold text-muted-foreground">
                    Obtained
                  </th>
                  <th className="text-right py-2 text-xs font-semibold text-muted-foreground">
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                {subjectMarks.map((s, i) => (
                  <tr
                    key={s.subject}
                    className="border-b border-border last:border-0"
                    data-ocid={`report_card.subject.${i + 1}`}
                  >
                    <td className="py-2 text-sm text-foreground flex items-center gap-2">
                      <FileText size={12} className="text-muted-foreground" />
                      {s.subject}
                    </td>
                    <td className="py-2 text-sm text-muted-foreground text-right">
                      {s.max}
                    </td>
                    <td className="py-2 text-sm font-medium text-foreground text-right">
                      {s.obtained}
                    </td>
                    <td className="py-2 text-sm text-right">
                      <Badge variant="secondary" className="text-xs">
                        {Math.round((s.obtained / s.max) * 100)}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-bold text-foreground">
                  {total} / {maxTotal}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Percentage</p>
                <p className="font-bold text-foreground">{percentage}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Grade</p>
                <p className="text-2xl font-bold text-primary">{grade}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Result</p>
                <Badge
                  variant={percentage >= 33 ? "secondary" : "destructive"}
                  className="text-sm"
                >
                  {percentage >= 33 ? "Pass" : "Fail"}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg p-4 flex items-center gap-3 flex-wrap"
          data-ocid="report_card.bulk_action.panel"
        >
          <span className="text-sm font-medium">
            {selectedIds.length} student(s) selected
          </span>
          <div className="flex gap-2 ml-auto flex-wrap">
            <Button
              size="sm"
              onClick={() => {
                toast.info(
                  `Printing report cards for ${selectedIds.length} student(s)...`,
                );
                window.print();
              }}
              data-ocid="report_card.bulk_print.button"
            >
              Print Selected
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast.info(
                  `Generating PDF for ${selectedIds.length} student(s)...`,
                );
              }}
              data-ocid="report_card.bulk_export_pdf.button"
            >
              Export PDF
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const selectedStudents = mockStudents.filter((s) =>
                  selectedIds.includes(s.id),
                );
                const rows = selectedStudents.map((s) => {
                  const marks = getStudentMarks(s.id);
                  const tot = marks.reduce((a, m) => a + m.obtained, 0);
                  const pct = Math.round(
                    (tot / marks.reduce((a, m) => a + m.max, 0)) * 100,
                  );
                  return [
                    s.name,
                    s.admissionNo,
                    s.className,
                    s.section,
                    ...marks.map((m) => m.obtained),
                    tot,
                    `${pct}%`,
                  ].join(",");
                });
                const header = [
                  "Name",
                  "Admission No",
                  "Class",
                  "Section",
                  "Math",
                  "Science",
                  "Hindi",
                  "English",
                  "Social Studies",
                  "Total",
                  "Percentage",
                ].join(",");
                const csv = [header, ...rows].join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "report_cards.csv";
                a.click();
                URL.revokeObjectURL(url);
                toast.success(`Exported ${selectedIds.length} records to CSV`);
              }}
              data-ocid="report_card.bulk_export_excel.button"
            >
              Export Excel
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds([])}
              data-ocid="report_card.bulk_clear.button"
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
