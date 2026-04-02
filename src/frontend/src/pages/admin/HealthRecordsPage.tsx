import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { CLASSES, SECTIONS } from "@/data/classConfig";
import {
  type ClinicVisit,
  type StudentHealth,
  mockHealthRecords,
} from "@/data/mockHealthRecords";
import { Heart, Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const VACC_STATUS: Record<string, string> = {
  Complete: "bg-green-500/15 text-green-600",
  Due: "bg-yellow-500/15 text-yellow-600",
  Overdue: "bg-red-500/15 text-red-600",
};

export function HealthRecordsPage() {
  const [records, setRecords] = useState<StudentHealth[]>(mockHealthRecords);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [selected, setSelected] = useState<StudentHealth | null>(null);
  const [addVisitOpen, setAddVisitOpen] = useState(false);
  const [visitForm, setVisitForm] = useState({
    date: "",
    complaint: "",
    treatment: "",
    referredToDoctor: false,
  });

  const filtered = records.filter((r) => {
    const matchSearch =
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.admissionNo.includes(search) ||
      r.className.toLowerCase().includes(search.toLowerCase());
    const matchClass =
      classFilter === "all" ||
      r.className.startsWith(`${classFilter}-`) ||
      r.className.startsWith(classFilter);
    const matchSection =
      sectionFilter === "all" || r.className.includes(`-${sectionFilter}`);
    return matchSearch && matchClass && matchSection;
  });

  const handleAddVisit = () => {
    if (!visitForm.date || !visitForm.complaint || !visitForm.treatment) {
      toast.error("Please fill all required fields");
      return;
    }
    const newVisit: ClinicVisit = {
      id: `cv${Date.now()}`,
      date: visitForm.date,
      complaint: visitForm.complaint,
      treatment: visitForm.treatment,
      referredToDoctor: visitForm.referredToDoctor,
    };
    setRecords((prev) =>
      prev.map((r) =>
        r.studentId === selected?.studentId
          ? { ...r, clinicVisits: [newVisit, ...r.clinicVisits] }
          : r,
      ),
    );
    if (selected) {
      setSelected((s) =>
        s ? { ...s, clinicVisits: [newVisit, ...s.clinicVisits] } : s,
      );
    }
    setVisitForm({
      date: "",
      complaint: "",
      treatment: "",
      referredToDoctor: false,
    });
    setAddVisitOpen(false);
    toast.success("Clinic visit added");
  };

  return (
    <div className="space-y-6" data-ocid="health_records.page">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Heart size={22} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Health Records</h1>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative max-w-xs w-full">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students..."
              className="pl-9"
              data-ocid="health_records.search_input"
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
              className="w-36"
              data-ocid="health_records.class_filter.select"
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
              data-ocid="health_records.section_filter.select"
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
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        data-ocid="health_records.list"
      >
        {filtered.map((r, i) => (
          <div
            key={r.studentId}
            className="bg-card border border-border rounded-2xl p-5 space-y-3"
            data-ocid={`health_records.item.${i + 1}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-foreground">{r.studentName}</p>
                <p className="text-xs text-muted-foreground">
                  {r.admissionNo} · {r.className}
                </p>
              </div>
              <Badge className="text-xs bg-blue-500/15 text-blue-600 shrink-0">
                {r.bloodGroup}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {r.allergies !== "None" && (
                <Badge className="text-xs bg-orange-500/15 text-orange-600">
                  Allergy: {r.allergies}
                </Badge>
              )}
              {r.medicalConditions !== "None" && (
                <Badge className="text-xs bg-red-500/15 text-red-600">
                  {r.medicalConditions}
                </Badge>
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => setSelected(r)}
              data-ocid={`health_records.view_button.${i + 1}`}
            >
              View Profile
            </Button>
          </div>
        ))}
      </div>

      {/* Health Profile Dialog */}
      <Dialog
        open={!!selected && !addVisitOpen}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
      >
        <DialogContent
          className="max-w-2xl max-h-[85vh] overflow-y-auto"
          data-ocid="health_records.dialog"
        >
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span>{selected.studentName}</span>
                  <Badge className="bg-blue-500/15 text-blue-600">
                    {selected.bloodGroup}
                  </Badge>
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {selected.admissionNo} · Class {selected.className} · Last
                  checkup:{" "}
                  {new Date(
                    `${selected.lastCheckup}T00:00:00`,
                  ).toLocaleDateString("en-IN")}
                </p>
              </DialogHeader>

              {/* Health Summary */}
              <div className="space-y-2 p-4 rounded-xl bg-secondary/30">
                <p className="text-sm font-semibold text-foreground">
                  Health Summary
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                  <div>
                    <span className="text-muted-foreground">Allergies: </span>
                    <span className="text-foreground">
                      {selected.allergies}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Conditions: </span>
                    <span className="text-foreground">
                      {selected.medicalConditions}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Emergency Contact:{" "}
                    </span>
                    <span className="text-foreground">
                      {selected.emergencyContact}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone: </span>
                    <span className="text-foreground">
                      {selected.emergencyPhone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Vaccinations */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  Vaccination Record
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-xs font-semibold text-muted-foreground">
                          Vaccine
                        </th>
                        <th className="text-left py-2 text-xs font-semibold text-muted-foreground">
                          Date Given
                        </th>
                        <th className="text-left py-2 text-xs font-semibold text-muted-foreground">
                          Next Due
                        </th>
                        <th className="text-left py-2 text-xs font-semibold text-muted-foreground">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.vaccinations.map((v) => (
                        <tr
                          key={v.vaccine}
                          className="border-b border-border last:border-0"
                        >
                          <td className="py-2 text-foreground font-medium">
                            {v.vaccine}
                          </td>
                          <td className="py-2 text-muted-foreground">
                            {v.dateGiven}
                          </td>
                          <td className="py-2 text-muted-foreground">
                            {v.nextDue}
                          </td>
                          <td className="py-2">
                            <Badge
                              className={`text-xs ${VACC_STATUS[v.status]}`}
                            >
                              {v.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Clinic Visits */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    Clinic Visits
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAddVisitOpen(true)}
                    data-ocid="health_records.add_visit_button"
                  >
                    <Plus size={13} className="mr-1" /> Add Visit
                  </Button>
                </div>
                {selected.clinicVisits.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No clinic visits recorded.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 text-xs font-semibold text-muted-foreground">
                            Date
                          </th>
                          <th className="text-left py-2 text-xs font-semibold text-muted-foreground">
                            Complaint
                          </th>
                          <th className="text-left py-2 text-xs font-semibold text-muted-foreground">
                            Treatment
                          </th>
                          <th className="text-left py-2 text-xs font-semibold text-muted-foreground">
                            Referred
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selected.clinicVisits.map((cv) => (
                          <tr
                            key={cv.id}
                            className="border-b border-border last:border-0"
                          >
                            <td className="py-2 text-muted-foreground">
                              {cv.date}
                            </td>
                            <td className="py-2 text-foreground">
                              {cv.complaint}
                            </td>
                            <td className="py-2 text-muted-foreground">
                              {cv.treatment}
                            </td>
                            <td className="py-2">
                              {cv.referredToDoctor ? (
                                <Badge className="bg-red-500/15 text-red-600 text-xs">
                                  Yes
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-xs">
                                  No
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Visit Dialog */}
      <Dialog open={addVisitOpen} onOpenChange={setAddVisitOpen}>
        <DialogContent data-ocid="health_records.add_visit_dialog">
          <DialogHeader>
            <DialogTitle>Add Clinic Visit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Date *</Label>
              <Input
                type="date"
                value={visitForm.date}
                onChange={(e) =>
                  setVisitForm((f) => ({ ...f, date: e.target.value }))
                }
                data-ocid="health_records.visit_date.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Complaint *</Label>
              <Input
                value={visitForm.complaint}
                onChange={(e) =>
                  setVisitForm((f) => ({ ...f, complaint: e.target.value }))
                }
                placeholder="Student's complaint"
                data-ocid="health_records.visit_complaint.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Treatment *</Label>
              <Textarea
                value={visitForm.treatment}
                onChange={(e) =>
                  setVisitForm((f) => ({ ...f, treatment: e.target.value }))
                }
                rows={3}
                placeholder="Treatment given"
                data-ocid="health_records.visit_treatment.textarea"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="referred"
                checked={visitForm.referredToDoctor}
                onCheckedChange={(v) =>
                  setVisitForm((f) => ({ ...f, referredToDoctor: !!v }))
                }
                data-ocid="health_records.visit_referred.checkbox"
              />
              <Label htmlFor="referred">Referred to Doctor</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddVisitOpen(false)}
              data-ocid="health_records.visit_cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddVisit}
              data-ocid="health_records.visit_submit_button"
            >
              Add Visit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
