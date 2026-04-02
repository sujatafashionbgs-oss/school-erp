import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CLASSES, SECTIONS } from "@/data/classConfig";
import { mockStudents } from "@/data/mockStudents";
import { Download, Printer, QrCode, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function IDCardPage() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [bulkSelect, setBulkSelect] = useState(false);
  const [template, setTemplate] = useState<"blue" | "green">("blue");

  const filteredStudents = mockStudents.filter((s) => {
    if (selectedClass && s.className !== selectedClass) return false;
    if (selectedSection && s.section !== selectedSection) return false;
    return true;
  });

  const selectedStudent =
    mockStudents.find((s) => s.id === selectedStudentId) ?? filteredStudents[0];

  const blueHeader = "bg-gradient-to-r from-blue-700 to-blue-500";
  const greenHeader = "bg-gradient-to-r from-green-700 to-emerald-500";
  const headerClass = template === "blue" ? blueHeader : greenHeader;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Student ID Card Generator</h1>
        <p className="text-muted-foreground text-sm">
          Preview and print student ID cards individually or in bulk
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: selector */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="font-semibold">Select Student</h2>
            <div className="flex gap-3">
              <Select
                value={selectedClass}
                onValueChange={(v) => {
                  setSelectedClass(v);
                  setSelectedSection("");
                }}
              >
                <SelectTrigger data-ocid="idcard.class.select">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {CLASSES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedSection}
                onValueChange={setSelectedSection}
              >
                <SelectTrigger data-ocid="idcard.section_filter.select">
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="">All Sections</SelectItem>
                  {(selectedClass === "XI" || selectedClass === "XII"
                    ? [...SECTIONS, "Science", "Commerce", "Arts"]
                    : SECTIONS
                  ).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={bulkSelect}
                onCheckedChange={(v) => setBulkSelect(!!v)}
                id="bulk"
                data-ocid="idcard.bulk.checkbox"
              />
              <Label htmlFor="bulk">Select Entire Class/Section</Label>
            </div>

            <div className="max-h-64 overflow-y-auto border rounded-lg divide-y">
              {filteredStudents.length === 0 ? (
                <p
                  className="text-sm text-muted-foreground text-center py-6"
                  data-ocid="idcard.empty_state"
                >
                  Select class and section to view students
                </p>
              ) : (
                filteredStudents.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    className={`w-full flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted transition-colors text-left ${selectedStudentId === s.id || bulkSelect ? "bg-muted" : ""}`}
                    onClick={() => {
                      if (!bulkSelect) setSelectedStudentId(s.id);
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                      <User size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.admissionNo}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="space-y-2">
              <Label>Template</Label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setTemplate("blue")}
                  className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${template === "blue" ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300" : "border-border"}`}
                  data-ocid="idcard.template_blue.toggle"
                >
                  🔵 Blue Theme
                </button>
                <button
                  type="button"
                  onClick={() => setTemplate("green")}
                  className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${template === "green" ? "border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300" : "border-border"}`}
                  data-ocid="idcard.template_green.toggle"
                >
                  🟢 Green Theme
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                className="flex-1"
                onClick={() => window.print()}
                data-ocid="idcard.print.button"
              >
                <Printer size={14} className="mr-2" /> Print ID Card
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => toast.success("Generating PDF...")}
                data-ocid="idcard.download.button"
              >
                <Download size={14} className="mr-2" /> Download PDF
              </Button>
            </div>
            {bulkSelect && (
              <Button
                variant="secondary"
                className="w-full"
                onClick={() =>
                  toast.success(
                    `Bulk printing for ${filteredStudents.length} students...`,
                  )
                }
                data-ocid="idcard.bulk_print.button"
              >
                <Printer size={14} className="mr-2" /> Bulk Print for Class (
                {filteredStudents.length} students)
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Right: ID Card Preview */}
        <div>
          <h2 className="font-semibold mb-3">ID Card Preview</h2>
          {selectedStudent ? (
            <div
              id="id-card-preview"
              className="w-80 mx-auto shadow-xl rounded-xl overflow-hidden border"
            >
              {/* Header */}
              <div className={`${headerClass} text-white px-4 py-3`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-xs font-bold">SPS</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Sunrise Public School</p>
                    <p className="text-xs opacity-80">Lucknow, Uttar Pradesh</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="bg-white dark:bg-card px-4 py-4 space-y-3">
                <div className="flex gap-4">
                  {/* Photo */}
                  <div className="w-20 h-24 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 border">
                    <User size={32} className="text-muted-foreground" />
                  </div>
                  {/* Info */}
                  <div className="space-y-0.5 text-sm">
                    <p className="font-bold text-base">
                      {selectedStudent.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Class:{" "}
                      <span className="font-medium text-foreground">
                        {selectedStudent.className}-{selectedStudent.section}
                      </span>
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Adm. No:{" "}
                      <span className="font-medium text-foreground">
                        {selectedStudent.admissionNo}
                      </span>
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Roll No:{" "}
                      <span className="font-medium text-foreground">
                        {selectedStudent.rollNo ?? "04"}
                      </span>
                    </p>
                    <p className="text-muted-foreground text-xs">
                      DOB:{" "}
                      <span className="font-medium text-foreground">
                        {selectedStudent.dob ?? "2010-05-15"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="border-t pt-2 space-y-0.5 text-xs">
                  <p className="text-muted-foreground">
                    Address:{" "}
                    <span className="text-foreground">
                      {selectedStudent.address ?? "123, Civil Lines, Lucknow"}
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    Emergency:{" "}
                    <span className="text-foreground">
                      {selectedStudent.mobile ?? "9876543210"}
                    </span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-muted-foreground">2026–27</p>
                  <div className="w-12 h-12 bg-muted rounded flex items-center justify-center border">
                    <QrCode size={20} className="text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={`${headerClass} text-white text-center py-1.5`}>
                <p className="text-xs">STUDENT IDENTITY CARD</p>
              </div>
            </div>
          ) : (
            <div
              className="w-80 mx-auto h-64 rounded-xl border-2 border-dashed flex items-center justify-center"
              data-ocid="idcard.empty_state"
            >
              <p className="text-sm text-muted-foreground">
                Select a student to preview
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media print {
          body > * { display: none; }
          #id-card-preview { display: block !important; }
        }
      `}</style>
    </div>
  );
}
