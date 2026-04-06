import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
import { Download, Printer, QrCode, Search, User } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");

  const sectionOptions =
    selectedClass === "XI" || selectedClass === "XII"
      ? [...SECTIONS, "Science", "Commerce", "Arts"]
      : SECTIONS;

  const filteredStudents = mockStudents.filter((s) => {
    if (selectedClass && s.className !== selectedClass) return false;
    if (selectedSection && s.section !== selectedSection) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q) ||
        s.rollNo.includes(q)
      );
    }
    return true;
  });

  const selectedStudent =
    filteredStudents.find((s) => s.id === selectedStudentId) ??
    (selectedStudentId
      ? mockStudents.find((s) => s.id === selectedStudentId)
      : undefined);

  const blueHeader = "bg-gradient-to-r from-blue-700 to-blue-500";
  const greenHeader = "bg-gradient-to-r from-green-700 to-emerald-500";
  const headerClass = template === "blue" ? blueHeader : greenHeader;

  function handlePrint() {
    if (!selectedStudent && !bulkSelect) {
      toast.error("Please select a student first");
      return;
    }
    window.print();
  }

  function handleDownload() {
    if (!selectedStudent && !bulkSelect) {
      toast.error("Please select a student first");
      return;
    }
    toast.success("Generating PDF...");
  }

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

            {/* Search */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search by name, admission no, roll no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
                data-ocid="idcard.search.input"
              />
            </div>

            {/* Class / Section filters */}
            <div className="flex gap-3">
              <Select
                value={selectedClass || "__all__"}
                onValueChange={(v) => {
                  setSelectedClass(v === "__all__" ? "" : v);
                  setSelectedSection("");
                  setSelectedStudentId(null);
                }}
              >
                <SelectTrigger data-ocid="idcard.class.select">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="__all__">All Classes</SelectItem>
                  {CLASSES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedSection || "__all__"}
                onValueChange={(v) => {
                  setSelectedSection(v === "__all__" ? "" : v);
                  setSelectedStudentId(null);
                }}
                disabled={!selectedClass}
              >
                <SelectTrigger data-ocid="idcard.section_filter.select">
                  <SelectValue placeholder="All Sections" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="__all__">All Sections</SelectItem>
                  {sectionOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Student count + clear */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {filteredStudents.length} student
                {filteredStudents.length !== 1 ? "s" : ""}
              </Badge>
              {(selectedClass || searchQuery) && (
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                  onClick={() => {
                    setSelectedClass("");
                    setSelectedSection("");
                    setSearchQuery("");
                    setSelectedStudentId(null);
                    setBulkSelect(false);
                  }}
                  data-ocid="idcard.clear_filters.button"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Bulk select */}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={bulkSelect}
                onCheckedChange={(v) => setBulkSelect(!!v)}
                id="bulk"
                data-ocid="idcard.bulk.checkbox"
              />
              <Label htmlFor="bulk" className="cursor-pointer">
                Select Entire Class/Section (Bulk Print)
              </Label>
            </div>

            {/* Student list */}
            <div className="max-h-64 overflow-y-auto border rounded-lg divide-y">
              {filteredStudents.length === 0 ? (
                <p
                  className="text-sm text-muted-foreground text-center py-6"
                  data-ocid="idcard.empty_state"
                >
                  {searchQuery
                    ? "No students match your search"
                    : "No students found for selected filters"}
                </p>
              ) : (
                filteredStudents.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    className={`w-full flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted transition-colors text-left ${
                      selectedStudentId === s.id || bulkSelect ? "bg-muted" : ""
                    }`}
                    onClick={() => {
                      if (!bulkSelect) setSelectedStudentId(s.id);
                    }}
                    data-ocid={`idcard.student.${s.id}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">
                        {s.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.admissionNo} &middot; {s.className}-{s.section}
                      </p>
                    </div>
                    {selectedStudentId === s.id && !bulkSelect && (
                      <Badge className="text-xs bg-primary/10 text-primary border-primary/20 shrink-0">
                        Selected
                      </Badge>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Template picker */}
            <div className="space-y-2">
              <Label>Template</Label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setTemplate("blue")}
                  className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                    template === "blue"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                      : "border-border"
                  }`}
                  data-ocid="idcard.template_blue.toggle"
                >
                  🔵 Blue Theme
                </button>
                <button
                  type="button"
                  onClick={() => setTemplate("green")}
                  className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                    template === "green"
                      ? "border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
                      : "border-border"
                  }`}
                  data-ocid="idcard.template_green.toggle"
                >
                  🟢 Green Theme
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-1">
              <Button
                className="flex-1"
                onClick={handlePrint}
                data-ocid="idcard.print.button"
              >
                <Printer size={14} className="mr-2" /> Print ID Card
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleDownload}
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
                    `Bulk printing ${filteredStudents.length} ID cards...`,
                  )
                }
                data-ocid="idcard.bulk_print.button"
              >
                <Printer size={14} className="mr-2" /> Bulk Print (
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
                  {/* Photo placeholder */}
                  <div className="w-20 h-24 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 border">
                    <div className="flex flex-col items-center gap-1">
                      <User size={28} className="text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground font-bold">
                        {selectedStudent.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    </div>
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
                        {selectedStudent.rollNo}
                      </span>
                    </p>
                    <p className="text-muted-foreground text-xs">
                      DOB:{" "}
                      <span className="font-medium text-foreground">
                        {selectedStudent.dob}
                      </span>
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Blood:{" "}
                      <span className="font-medium text-foreground">
                        {selectedStudent.bloodGroup}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="border-t pt-2 space-y-0.5 text-xs">
                  <p className="text-muted-foreground">
                    Father:{" "}
                    <span className="text-foreground">
                      {selectedStudent.fatherName}
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    Address:{" "}
                    <span className="text-foreground">
                      {selectedStudent.address}, {selectedStudent.city}
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    Emergency:{" "}
                    <span className="text-foreground font-mono">
                      {selectedStudent.mobile}
                    </span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-muted-foreground font-medium">
                    2026–27
                  </p>
                  <div className="w-12 h-12 bg-muted rounded flex items-center justify-center border">
                    <QrCode size={20} className="text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={`${headerClass} text-white text-center py-1.5`}>
                <p className="text-xs tracking-wide">STUDENT IDENTITY CARD</p>
              </div>
            </div>
          ) : (
            <div
              className="w-80 mx-auto h-72 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3"
              data-ocid="idcard.empty_preview"
            >
              <User size={36} className="text-muted-foreground/40" />
              <div className="text-center px-4">
                <p className="text-sm font-medium text-muted-foreground">
                  No student selected
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Search or filter by class on the left, then click a student
                  name to preview their ID card
                </p>
              </div>
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
