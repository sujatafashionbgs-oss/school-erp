import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import {
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface AddStudentPageProps {
  navigate: (path: string) => void;
}

const STEPS = ["Personal", "Contact", "Academic", "Documents", "Review"];

const DOC_TYPES = [
  "Birth Certificate",
  "Transfer Certificate",
  "Aadhar Card",
  "Passport Photo",
  "Caste Certificate",
] as const;

type DocType = (typeof DOC_TYPES)[number];

interface FormData {
  name: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  religion: string;
  category: string;
  fatherName: string;
  motherName: string;
  guardianPhone: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  className: string;
  section: string;
  rollNo: string;
  admissionDate: string;
  previousSchool: string;
  admissionNo: string;
}

export function AddStudentPage({ navigate }: AddStudentPageProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    religion: "",
    category: "",
    fatherName: "",
    motherName: "",
    guardianPhone: "",
    address: "",
    city: "",
    state: "",
    pin: "",
    className: "",
    section: "",
    rollNo: "",
    admissionDate: "",
    previousSchool: "",
    admissionNo: `2024-${1065 + Math.floor(Math.random() * 100)}`,
  });

  // Document upload state
  const [uploadedDocs, setUploadedDocs] = useState<
    Partial<Record<DocType, File>>
  >({});
  const fileInputRefs = useRef<
    Partial<Record<DocType, HTMLInputElement | null>>
  >({});

  const update = (field: keyof FormData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const validateStep = (): boolean => {
    if (step === 0) {
      if (!formData.name || !formData.dob || !formData.gender) return false;
    }
    if (step === 1) {
      if (
        !formData.guardianPhone ||
        !formData.address ||
        !formData.city ||
        !formData.state ||
        !formData.pin
      )
        return false;
    }
    if (step === 2) {
      if (!formData.className || !formData.section) return false;
    }
    return true;
  };

  const handleFileSelect = (doc: DocType, file: File | null) => {
    if (!file) return;
    setUploadedDocs((prev) => ({ ...prev, [doc]: file }));
    toast.success(`${doc} uploaded: ${file.name}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6" data-ocid="add_student.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add New Student</h1>
        <p className="text-muted-foreground text-sm">
          Fill in the student details step by step
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                i < step
                  ? "bg-green-500 text-white"
                  : i === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground",
              )}
            >
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            {!false && (
              <span
                className={cn(
                  "text-xs hidden sm:inline",
                  i === step
                    ? "text-foreground font-medium"
                    : "text-muted-foreground",
                )}
              >
                {s}
              </span>
            )}
            {i < STEPS.length - 1 && (
              <ChevronRight size={14} className="text-border" />
            )}
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-foreground mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Full Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Student full name"
                  data-ocid="add_student.name.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Date of Birth *</Label>
                <Input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => update("dob", e.target.value)}
                  data-ocid="add_student.dob.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(v) => update("gender", v)}
                >
                  <SelectTrigger data-ocid="add_student.gender.select">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Blood Group</Label>
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(v) => update("bloodGroup", v)}
                >
                  <SelectTrigger data-ocid="add_student.blood_group.select">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                      (bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Religion</Label>
                <Select
                  value={formData.religion}
                  onValueChange={(v) => update("religion", v)}
                >
                  <SelectTrigger data-ocid="add_student.religion.select">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Hindu",
                      "Islam",
                      "Christian",
                      "Sikh",
                      "Buddhist",
                      "Other",
                    ].map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => update("category", v)}
                >
                  <SelectTrigger data-ocid="add_student.category.select">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {["General", "OBC", "SC", "ST", "EWS"].map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-foreground mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Father's Name</Label>
                <Input
                  value={formData.fatherName}
                  onChange={(e) => update("fatherName", e.target.value)}
                  placeholder="Father's full name"
                  data-ocid="add_student.father_name.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Mother's Name</Label>
                <Input
                  value={formData.motherName}
                  onChange={(e) => update("motherName", e.target.value)}
                  placeholder="Mother's full name"
                  data-ocid="add_student.mother_name.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Guardian Phone *</Label>
                <Input
                  value={formData.guardianPhone}
                  onChange={(e) => update("guardianPhone", e.target.value)}
                  placeholder="10-digit mobile"
                  data-ocid="add_student.phone.input"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Address *</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="Street address"
                  data-ocid="add_student.address.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>City *</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="City"
                  data-ocid="add_student.city.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>State *</Label>
                <Input
                  value={formData.state}
                  onChange={(e) => update("state", e.target.value)}
                  placeholder="State"
                  data-ocid="add_student.state.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>PIN Code *</Label>
                <Input
                  value={formData.pin}
                  onChange={(e) => update("pin", e.target.value)}
                  placeholder="6-digit PIN"
                  data-ocid="add_student.pin.input"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-foreground mb-4">
              Academic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Admission No</Label>
                <Input
                  value={formData.admissionNo}
                  readOnly
                  className="bg-secondary"
                  data-ocid="add_student.admission_no.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Admission Date</Label>
                <Input
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => update("admissionDate", e.target.value)}
                  data-ocid="add_student.admission_date.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Class *</Label>
                <Select
                  value={formData.className}
                  onValueChange={(v) => update("className", v)}
                >
                  <SelectTrigger data-ocid="add_student.class.select">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {CLASSES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Section *</Label>
                <Select
                  value={formData.section}
                  onValueChange={(v) => update("section", v)}
                >
                  <SelectTrigger data-ocid="add_student.section.select">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {SECTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        Section {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Roll No</Label>
                <Input
                  value={formData.rollNo}
                  onChange={(e) => update("rollNo", e.target.value)}
                  placeholder="Roll number"
                  data-ocid="add_student.roll_no.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Previous School</Label>
                <Input
                  value={formData.previousSchool}
                  onChange={(e) => update("previousSchool", e.target.value)}
                  placeholder="Previous school name"
                  data-ocid="add_student.prev_school.input"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-foreground mb-4">
              Documents
            </h2>
            <p className="text-xs text-muted-foreground mb-2">
              Accepted formats: PDF, JPG, PNG (max 5MB each)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DOC_TYPES.map((doc) => {
                const uploaded = uploadedDocs[doc];
                return (
                  <div
                    key={doc}
                    className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center gap-2 transition-colors ${
                      uploaded
                        ? "border-green-400 bg-green-50 dark:bg-green-950/20"
                        : "border-border hover:border-primary cursor-pointer"
                    }`}
                  >
                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      ref={(el) => {
                        fileInputRefs.current[doc] = el;
                      }}
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        handleFileSelect(doc, file);
                      }}
                      data-ocid="add_student.file_input"
                    />

                    {uploaded ? (
                      <>
                        <CheckCircle size={24} className="text-green-500" />
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">
                          {doc}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-500 truncate max-w-full px-2">
                          {uploaded.name}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => {
                            setUploadedDocs((prev) => {
                              const next = { ...prev };
                              delete next[doc];
                              return next;
                            });
                            const input = fileInputRefs.current[doc];
                            if (input) input.value = "";
                          }}
                        >
                          Remove
                        </Button>
                      </>
                    ) : (
                      <>
                        <UploadCloud
                          size={24}
                          className="text-muted-foreground"
                        />
                        <p className="text-sm text-muted-foreground">{doc}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRefs.current[doc]?.click()}
                          data-ocid="add_student.upload_button"
                        >
                          Upload
                        </Button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-foreground mb-4">
              Review & Submit
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {Object.entries(formData)
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <span className="text-muted-foreground capitalize w-32 shrink-0">
                      {k.replace(/([A-Z])/g, " $1")}:
                    </span>
                    <span className="text-foreground font-medium">{v}</span>
                  </div>
                ))}
            </div>
            {Object.keys(uploadedDocs).length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-foreground mb-2">
                  Uploaded Documents:
                </p>
                <div className="flex flex-wrap gap-2">
                  {(Object.entries(uploadedDocs) as [DocType, File][]).map(
                    ([doc, file]) => (
                      <div
                        key={doc}
                        className="flex items-center gap-1 text-xs bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-lg"
                      >
                        <CheckCircle size={12} />
                        <span>
                          {doc}: {file.name}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() =>
            step > 0 ? setStep((s) => s - 1) : navigate("/admin/students")
          }
          data-ocid="add_student.back.button"
        >
          <ChevronLeft size={16} className="mr-1" /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button
            onClick={() => {
              if (!validateStep()) {
                toast.error("Please fill all required fields");
                return;
              }
              setStep((s) => s + 1);
            }}
            data-ocid="add_student.next.button"
          >
            Next <ChevronRight size={16} className="ml-1" />
          </Button>
        ) : (
          <Button
            onClick={() => {
              toast.success("Student added successfully!");
              navigate("/admin/students");
            }}
            data-ocid="add_student.submit.button"
          >
            <Check size={16} className="mr-1" /> Submit
          </Button>
        )}
      </div>
    </div>
  );
}
