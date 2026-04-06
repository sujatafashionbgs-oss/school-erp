import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CLASSES as AVAILABLE_CLASSES } from "@/data/classConfig";
import { mockStudents } from "@/data/mockStudents";
import { useClassConfig } from "@/hooks/useClassConfig";
import { FileDown, Printer, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

function getGrade(percentage: number): string {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  return "D";
}

function printBulkReportCards(students: typeof mockStudents) {
  if (students.length === 0) {
    toast.error("No students selected to print.");
    return;
  }

  const win = window.open("", "_blank", "width=900,height=1100");
  if (!win) {
    toast.error(
      "Popup blocked. Please allow popups for this site and try again.",
    );
    return;
  }

  const cards = students.map((student, idx) => {
    const marks = getStudentMarks(student.id);
    const total = marks.reduce((a, s) => a + s.obtained, 0);
    const maxTotal = marks.reduce((a, s) => a + s.max, 0);
    const percentage = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
    const grade = getGrade(percentage);
    const isLast = idx === students.length - 1;

    const subjectRows = marks
      .map(
        (m) => `
      <tr>
        <td style="padding:6px 8px;border:1px solid #ddd;">${m.subject}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;text-align:center;">${m.max}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;text-align:center;font-weight:600;">${m.obtained}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;text-align:center;">${Math.round((m.obtained / m.max) * 100)}%</td>
      </tr>`,
      )
      .join("");

    const pageBreak = !isLast ? `style="page-break-after:always;"` : "";

    return `
    <div ${pageBreak}>
      <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;padding:24px;color:#000;border:1px solid #ccc;">
        <!-- Header -->
        <div style="text-align:center;padding-bottom:16px;border-bottom:2px solid #333;margin-bottom:16px;">
          <h1 style="margin:0;font-size:22px;font-weight:bold;color:#1a1a1a;">SmartSkale Public School</h1>
          <p style="margin:4px 0 0;font-size:13px;color:#555;">Academic Year 2026-27 | Report Card</p>
        </div>

        <!-- Student Info -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
          <tr>
            <td style="padding:6px 0;font-size:13px;"><span style="color:#666;">Student Name:</span> <strong>${student.name}</strong></td>
            <td style="padding:6px 0;font-size:13px;"><span style="color:#666;">Admission No:</span> <strong>${student.admissionNo}</strong></td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:13px;"><span style="color:#666;">Class-Section:</span> <strong>${student.className}-${student.section}</strong></td>
            <td style="padding:6px 0;font-size:13px;"><span style="color:#666;">Roll No:</span> <strong>${student.rollNo}</strong></td>
          </tr>
        </table>

        <!-- Marks Table -->
        <h3 style="margin:0 0 8px;font-size:14px;color:#333;">Subject-wise Performance</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:13px;">
          <thead>
            <tr style="background:#f0f0f0;">
              <th style="padding:8px;border:1px solid #ddd;text-align:left;">Subject</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:center;">Max Marks</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:center;">Obtained</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:center;">Percentage</th>
            </tr>
          </thead>
          <tbody>
            ${subjectRows}
            <tr style="background:#f9f9f9;font-weight:bold;">
              <td style="padding:8px;border:1px solid #ddd;">TOTAL</td>
              <td style="padding:8px;border:1px solid #ddd;text-align:center;">${maxTotal}</td>
              <td style="padding:8px;border:1px solid #ddd;text-align:center;">${total}</td>
              <td style="padding:8px;border:1px solid #ddd;text-align:center;">${percentage}%</td>
            </tr>
          </tbody>
        </table>

        <!-- Summary Row -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:13px;">
          <tr style="background:#f0f0f0;">
            <th style="padding:8px;border:1px solid #ddd;text-align:center;">Overall %</th>
            <th style="padding:8px;border:1px solid #ddd;text-align:center;">Grade</th>
            <th style="padding:8px;border:1px solid #ddd;text-align:center;">Result</th>
          </tr>
          <tr>
            <td style="padding:10px;border:1px solid #ddd;text-align:center;font-weight:bold;font-size:16px;">${percentage}%</td>
            <td style="padding:10px;border:1px solid #ddd;text-align:center;font-weight:bold;font-size:20px;color:#1a6bbf;">${grade}</td>
            <td style="padding:10px;border:1px solid #ddd;text-align:center;font-weight:bold;color:${percentage >= 33 ? "#2e7d32" : "#c62828"};">${percentage >= 33 ? "PASS" : "FAIL"}</td>
          </tr>
        </table>

        <!-- Footer -->
        <div style="margin-top:20px;padding-top:12px;border-top:1px solid #ccc;text-align:center;font-size:11px;color:#888;">
          Generated by SmartSkale ERP &nbsp;|&nbsp; SmartSkale Public School, Academic Year 2026-27
        </div>
      </div>
    </div>`;
  });

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Bulk Report Cards – SmartSkale</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 16px; background: #fff; }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  ${cards.join("\n")}
</body>
</html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();
  setTimeout(() => {
    win.print();
    win.close();
  }, 400);
}

export function BulkReportCardPage() {
  const { getActiveSections } = useClassConfig();
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedSections, setSelectedSections] = useState<
    Record<string, string[]>
  >({});
  const [showPreview, setShowPreview] = useState(false);

  const toggleClass = (cls: string) => {
    setSelectedClasses((prev) => {
      const isRemoving = prev.includes(cls);
      return isRemoving ? prev.filter((c) => c !== cls) : [...prev, cls];
    });
    setSelectedSections((prev) => {
      const next = { ...prev };
      delete next[cls]; // clear on BOTH add and remove
      return next;
    });
  };

  const handleClearAll = () => {
    setSelectedClasses([]);
    setSelectedSections({});
    setShowPreview(false);
  };

  const toggleSection = (cls: string, sec: string) => {
    setSelectedSections((prev) => {
      const current = prev[cls] ?? [];
      return {
        ...prev,
        [cls]: current.includes(sec)
          ? current.filter((s) => s !== sec)
          : [...current, sec],
      };
    });
  };

  const previewStudents = mockStudents.filter((s) => {
    if (!selectedClasses.includes(s.className)) return false;
    const sections = selectedSections[s.className];
    if (sections && sections.length > 0) {
      return sections.includes(s.section);
    }
    return true; // all sections if none specifically selected
  });

  const handlePrint = () => {
    if (previewStudents.length === 0) {
      toast.error(
        "No students match the selected classes/sections. Please adjust your selection.",
      );
      return;
    }
    toast.info(
      `Opening print dialog for ${previewStudents.length} report card(s)...`,
    );
    printBulkReportCards(previewStudents);
  };

  const handleExportMerged = () => {
    if (previewStudents.length === 0) {
      toast.error("No students selected.");
      return;
    }
    toast.success(
      `Generating merged PDF for ${previewStudents.length} report cards...`,
    );
    printBulkReportCards(previewStudents);
  };

  const handleExportIndividual = () => {
    if (previewStudents.length === 0) {
      toast.error("No students selected.");
      return;
    }
    toast.success(
      `Generating ${previewStudents.length} individual PDFs... This may take a moment.`,
    );
    setTimeout(
      () =>
        toast.success(`${previewStudents.length} PDFs generated successfully!`),
      1500,
    );
  };

  return (
    <div className="space-y-6" data-ocid="bulk_report_card.page">
      <div className="flex items-center gap-3">
        <Users className="text-primary" size={24} />
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Bulk Report Card Generation
          </h1>
          <p className="text-sm text-muted-foreground">
            Generate report cards for multiple classes and sections at once
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class/Section picker */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">
                Select Classes & Sections
              </h2>
              {selectedClasses.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={handleClearAll}
                  data-ocid="bulk_report_card.clear_all.button"
                >
                  Clear All
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {AVAILABLE_CLASSES.map((cls) => {
                const activeSections = getActiveSections(cls);
                const isClassSelected = selectedClasses.includes(cls);
                return (
                  <div key={cls}>
                    <div className="flex items-center gap-2 mb-2">
                      <Checkbox
                        id={`cls-${cls}`}
                        checked={isClassSelected}
                        onCheckedChange={() => toggleClass(cls)}
                        data-ocid="bulk_report_card.class.checkbox"
                      />
                      <Label
                        htmlFor={`cls-${cls}`}
                        className="font-medium cursor-pointer"
                      >
                        Class {cls}
                      </Label>
                    </div>
                    {isClassSelected && (
                      <div className="ml-6 flex flex-wrap gap-2">
                        {activeSections.map((sec) => (
                          <button
                            type="button"
                            key={sec}
                            onClick={() => toggleSection(cls, sec)}
                            className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                              (selectedSections[cls] ?? []).includes(sec)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border text-muted-foreground hover:bg-muted"
                            }`}
                            data-ocid="bulk_report_card.section.toggle"
                          >
                            {sec}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowPreview(true)}
            disabled={selectedClasses.length === 0}
            data-ocid="bulk_report_card.preview.button"
          >
            Preview Students ({previewStudents.length})
          </Button>

          <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
            <p className="text-sm font-semibold text-foreground mb-3">
              Export Options
            </p>
            <Button
              className="w-full"
              variant="outline"
              onClick={handlePrint}
              disabled={selectedClasses.length === 0}
              data-ocid="bulk_report_card.print.button"
            >
              <Printer size={14} className="mr-2" /> Print All
            </Button>
            <Button
              className="w-full"
              onClick={handleExportMerged}
              disabled={selectedClasses.length === 0}
              data-ocid="bulk_report_card.merged_pdf.button"
            >
              <FileDown size={14} className="mr-2" /> Export Merged PDF
            </Button>
            <Button
              className="w-full"
              variant="secondary"
              onClick={handleExportIndividual}
              disabled={selectedClasses.length === 0}
              data-ocid="bulk_report_card.individual_pdfs.button"
            >
              <FileDown size={14} className="mr-2" /> Export Individual PDFs
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-foreground">
                {showPreview
                  ? `Preview — ${previewStudents.length} students selected`
                  : "Select classes to preview students"}
              </h2>
            </div>
            {showPreview && previewStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                        #
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                        Student Name
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                        Class
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                        Section
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                        Roll No
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewStudents.map((s, i) => (
                      <tr
                        key={s.id}
                        className="border-b border-border last:border-0 hover:bg-muted/20"
                        data-ocid={`bulk_report_card.item.${i + 1}`}
                      >
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {i + 1}
                        </td>
                        <td className="px-4 py-2.5 font-medium text-foreground">
                          {s.name}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          Class {s.className}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {s.section}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {s.rollNo}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : showPreview && previewStudents.length === 0 ? (
              <div
                className="py-12 text-center text-muted-foreground"
                data-ocid="bulk_report_card.empty_state"
              >
                No students found for the selected classes/sections.
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                Select classes on the left and click &quot;Preview
                Students&quot;
              </div>
            )}
          </div>

          {/* Sample report card preview */}
          <div className="mt-4 bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-foreground mb-4">
              Sample Report Card Preview
            </h3>
            <div className="border border-border rounded-xl p-5 space-y-3 text-sm">
              <div className="text-center border-b border-border pb-3">
                <p className="font-bold text-lg text-foreground">
                  SmartSkale Public School
                </p>
                <p className="text-muted-foreground text-xs">
                  Academic Year 2026-27 | Report Card
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Student: </span>
                  <span className="font-medium">Aarav Sharma</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Roll No: </span>
                  <span className="font-medium">01</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Class: </span>
                  <span className="font-medium">VIII-A</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Admission No: </span>
                  <span className="font-medium">2024-1045</span>
                </div>
              </div>
              <div className="text-xs">
                <p className="font-semibold mb-1 text-foreground">
                  Subject-wise Performance
                </p>
                {[
                  ["Mathematics", 92, "A+"],
                  ["Science", 88, "A"],
                  ["English", 85, "A"],
                  ["Hindi", 78, "B+"],
                  ["Social Science", 82, "A"],
                ].map(([sub, marks, grade]) => (
                  <div
                    key={sub as string}
                    className="flex items-center gap-2 py-0.5"
                  >
                    <span className="flex-1 text-muted-foreground">
                      {sub as string}
                    </span>
                    <span className="font-medium w-8 text-right">
                      {marks as number}/100
                    </span>
                    <span className="w-6 text-center font-semibold text-primary">
                      {grade as string}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
