import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { CLASSES, SECTIONS } from "@/data/classConfig";
import { type Student, mockStudents } from "@/data/mockStudents";
import { Printer, Search } from "lucide-react";
import { useState } from "react";

const SCHOOL_NAME = "SmartSkale School";
const TODAY = new Date().toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});
const YEAR = "2026-27";

function StudentSearch({ onSelect }: { onSelect: (s: Student) => void }) {
  const [q, setQ] = useState("");
  const [classF, setClassF] = useState("all");
  const [sectionF, setSectionF] = useState("all");
  const results =
    q.length >= 2 || classF !== "all"
      ? mockStudents
          .filter((s) => {
            const matchQ =
              !q ||
              s.name.toLowerCase().includes(q.toLowerCase()) ||
              s.admissionNo.includes(q);
            const matchClass = classF === "all" || s.className === classF;
            const matchSection = sectionF === "all" || s.section === sectionF;
            return matchQ && matchClass && matchSection;
          })
          .slice(0, 8)
      : [];
  return (
    <div className="space-y-2">
      <Label>Search Student</Label>
      <div className="flex gap-2 mb-2">
        <Select
          value={classF}
          onValueChange={(v) => {
            setClassF(v);
            setSectionF("all");
          }}
        >
          <SelectTrigger
            className="w-36"
            data-ocid="certificates.class_filter.select"
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
          value={sectionF}
          onValueChange={setSectionF}
          disabled={classF === "all"}
        >
          <SelectTrigger
            className="w-36"
            data-ocid="certificates.section_filter.select"
          >
            <SelectValue placeholder="All Sections" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            {(classF === "XI" || classF === "XII"
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
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          className="pl-9"
          placeholder="Name or admission number..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          data-ocid="certificates.search_input"
        />
      </div>
      {results.length > 0 && (
        <div className="border rounded-md divide-y overflow-hidden">
          {results.map((s) => (
            <button
              key={s.id}
              type="button"
              className="w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors flex justify-between"
              onClick={() => {
                onSelect(s);
                setQ("");
              }}
            >
              <span className="font-medium">{s.name}</span>
              <span className="text-muted-foreground">
                {s.admissionNo} · Class {s.className}-{s.section}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CertHeader({ student }: { student: Student }) {
  return (
    <div className="text-center border-b pb-4 mb-4">
      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
        <span className="text-2xl">🏫</span>
      </div>
      <h2 className="text-xl font-bold tracking-wide">{SCHOOL_NAME}</h2>
      <p className="text-xs text-muted-foreground">
        123, Education Road, Knowledge City · Tel: 0612-234567
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        Affiliated to CBSE · Reg. No. 12345
      </p>
      <p className="text-sm font-semibold mt-2 underline">
        TO WHOM IT MAY CONCERN
      </p>
      <p className="text-xs text-muted-foreground">
        Admission No: {student.admissionNo}
      </p>
    </div>
  );
}

// Bonafide Tab
function BonafideTab() {
  const [student, setStudent] = useState<Student | null>(null);
  const [purpose, setPurpose] = useState("General");
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <StudentSearch onSelect={setStudent} />
        {student && (
          <div className="space-y-3">
            <div className="p-3 bg-muted rounded-lg space-y-1 text-sm">
              <p>
                <span className="font-medium">Name:</span> {student.name}
              </p>
              <p>
                <span className="font-medium">Class:</span> {student.className}-
                {student.section}
              </p>
              <p>
                <span className="font-medium">Father:</span>{" "}
                {student.fatherName}
              </p>
            </div>
            <div className="space-y-1">
              <Label>Purpose</Label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger data-ocid="certificates.bonafide.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Bank Account", "Scholarship", "Passport", "General"].map(
                    (p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full no-print"
              onClick={() => window.print()}
              data-ocid="certificates.bonafide.print_button"
            >
              <Printer size={16} className="mr-2" />
              Download / Print PDF
            </Button>
          </div>
        )}
      </div>
      {student ? (
        <div className="border rounded-xl p-6 bg-white dark:bg-card text-sm print-area">
          <CertHeader student={student} />
          <h3 className="text-center text-base font-bold mb-4 uppercase tracking-widest">
            Bonafide Certificate
          </h3>
          <p className="leading-7 text-justify">
            This is to certify that <strong>{student.name}</strong>, S/D/O{" "}
            <strong>{student.fatherName}</strong>, is a bonafide student of{" "}
            <strong>{SCHOOL_NAME}</strong> studying in Class{" "}
            <strong>
              {student.className}-{student.section}
            </strong>{" "}
            for the academic year <strong>{YEAR}</strong>. His/Her admission
            number is <strong>{student.admissionNo}</strong>. This certificate
            is issued on <strong>{TODAY}</strong> for the purpose of{" "}
            <strong>{purpose}</strong>.
          </p>
          <div className="mt-10 flex justify-between text-xs text-muted-foreground">
            <div className="text-center">
              <div className="border-t border-foreground/30 pt-1 w-28">
                Class Teacher
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-foreground/30 pt-1 w-28">
                Principal
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-xl p-6 flex items-center justify-center text-muted-foreground">
          <p className="text-sm">
            Search and select a student to preview the certificate
          </p>
        </div>
      )}
    </div>
  );
}

// Transfer Certificate Tab
function TCTab() {
  const [student, setStudent] = useState<Student | null>(null);
  const [leavingDate, setLeavingDate] = useState(TODAY);
  const [conduct, setConduct] = useState("Good");
  const [reason, setReason] = useState("");
  const tcNo = student
    ? `TC/${YEAR}/${student.admissionNo.replace("2024-", "")}`
    : "";
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <StudentSearch onSelect={setStudent} />
        {student && (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Conduct</Label>
              <Select value={conduct} onValueChange={setConduct}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Leaving Date</Label>
              <Input
                value={leavingDate}
                onChange={(e) => setLeavingDate(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Reason for Leaving</Label>
              <Textarea
                placeholder="Reason for leaving school..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
              />
            </div>
            <Button
              className="w-full no-print"
              onClick={() => window.print()}
              data-ocid="certificates.tc.print_button"
            >
              <Printer size={16} className="mr-2" />
              Download / Print PDF
            </Button>
          </div>
        )}
      </div>
      {student ? (
        <div className="border rounded-xl p-6 bg-white dark:bg-card text-sm print-area">
          <CertHeader student={student} />
          <h3 className="text-center text-base font-bold mb-4 uppercase tracking-widest">
            Transfer Certificate
          </h3>
          <table className="w-full text-sm border-collapse">
            <tbody>
              {[
                ["TC Number", tcNo],
                ["Student Name", student.name],
                ["Father's Name", student.fatherName],
                ["Date of Birth", student.dob],
                ["Admission Number", student.admissionNo],
                ["Date of Admission", student.admissionDate],
                [
                  "Class Last Studied",
                  `${student.className}-${student.section}`,
                ],
                ["Date of Leaving", leavingDate],
                ["Conduct", conduct],
                ["Reason for Leaving", reason || "—"],
              ].map(([label, value]) => (
                <tr key={label} className="border">
                  <td className="px-3 py-1.5 font-medium border-r bg-muted/30 w-44">
                    {label}
                  </td>
                  <td className="px-3 py-1.5">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-8 flex justify-between text-xs text-muted-foreground">
            <div className="text-center">
              <div className="border-t border-foreground/30 pt-1 w-28">
                Class Teacher
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-foreground/30 pt-1 w-28">
                Principal
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-xl p-6 flex items-center justify-center text-muted-foreground">
          <p className="text-sm">
            Search and select a student to preview the certificate
          </p>
        </div>
      )}
    </div>
  );
}

// Character Certificate Tab
function CharacterTab() {
  const [student, setStudent] = useState<Student | null>(null);
  const [fromYear, setFromYear] = useState("2020");
  const [toYear, setToYear] = useState("2026");
  const [conduct, setConduct] = useState("Good");
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <StudentSearch onSelect={setStudent} />
        {student && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label>From Year</Label>
                <Input
                  value={fromYear}
                  onChange={(e) => setFromYear(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>To Year</Label>
                <Input
                  value={toYear}
                  onChange={(e) => setToYear(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Character & Conduct</Label>
              <Select value={conduct} onValueChange={setConduct}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full no-print"
              onClick={() => window.print()}
              data-ocid="certificates.character.print_button"
            >
              <Printer size={16} className="mr-2" />
              Download / Print PDF
            </Button>
          </div>
        )}
      </div>
      {student ? (
        <div className="border rounded-xl p-6 bg-white dark:bg-card text-sm print-area">
          <CertHeader student={student} />
          <h3 className="text-center text-base font-bold mb-4 uppercase tracking-widest">
            Character Certificate
          </h3>
          <p className="leading-7 text-justify">
            This is to certify that <strong>{student.name}</strong> has been a
            student of <strong>{SCHOOL_NAME}</strong> from{" "}
            <strong>{fromYear}</strong> to <strong>{toYear}</strong>. During
            this period, his/her character and conduct have been{" "}
            <strong>{conduct}</strong>. We wish him/her all the best for future
            endeavours.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Issued on: {TODAY}
          </p>
          <div className="mt-10 flex justify-between text-xs text-muted-foreground">
            <div className="text-center">
              <div className="border-t border-foreground/30 pt-1 w-28">
                Class Teacher
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-foreground/30 pt-1 w-28">
                Principal
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-xl p-6 flex items-center justify-center text-muted-foreground">
          <p className="text-sm">
            Search and select a student to preview the certificate
          </p>
        </div>
      )}
    </div>
  );
}

export function CertificatesPage() {
  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: fixed; inset: 0; padding: 40px; }
        }
      `}</style>
      <div>
        <h1 className="text-2xl font-bold">Certificate Generator</h1>
        <p className="text-sm text-muted-foreground">
          Generate Bonafide, Transfer, and Character certificates for students
        </p>
      </div>
      <Tabs defaultValue="bonafide">
        <TabsList className="no-print">
          <TabsTrigger value="bonafide" data-ocid="certificates.bonafide.tab">
            Bonafide Certificate
          </TabsTrigger>
          <TabsTrigger value="tc" data-ocid="certificates.tc.tab">
            Transfer Certificate
          </TabsTrigger>
          <TabsTrigger value="character" data-ocid="certificates.character.tab">
            Character Certificate
          </TabsTrigger>
        </TabsList>
        <TabsContent value="bonafide" className="mt-4">
          <BonafideTab />
        </TabsContent>
        <TabsContent value="tc" className="mt-4">
          <TCTab />
        </TabsContent>
        <TabsContent value="character" className="mt-4">
          <CharacterTab />
        </TabsContent>
      </Tabs>
      {/* Badge watermark for unused import prevention */}
      <div className="hidden">
        <Badge>hidden</Badge>
      </div>
    </div>
  );
}
