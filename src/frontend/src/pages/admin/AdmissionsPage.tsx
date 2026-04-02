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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CLASSES } from "@/data/classConfig";
import {
  CheckCircle,
  ClipboardCheck,
  FileDown,
  LayoutGrid,
  LayoutList,
  Paperclip,
  Plus,
  Printer,
  UploadCloud,
  XCircle,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type AdmissionStatus =
  | "Applied"
  | "Documents Pending"
  | "Admitted"
  | "Cancelled";

interface Admission {
  id: string;
  name: string;
  parentName: string;
  phone: string;
  forClass: string;
  appliedDate: string;
  status: AdmissionStatus;
  admissionNo?: string;
  docs: { birthCert: boolean; transferCert: boolean; photo: boolean };
}

const initialAdmissions: Admission[] = [
  {
    id: "a1",
    name: "Rohan Mehta",
    parentName: "Suresh Mehta",
    phone: "9876543210",
    forClass: "VI",
    appliedDate: "2024-11-20",
    status: "Applied",
    docs: { birthCert: true, transferCert: false, photo: true },
  },
  {
    id: "a2",
    name: "Anika Sharma",
    parentName: "Priya Sharma",
    phone: "9845123456",
    forClass: "IX",
    appliedDate: "2024-11-18",
    status: "Documents Pending",
    docs: { birthCert: true, transferCert: true, photo: false },
  },
  {
    id: "a3",
    name: "Dev Patel",
    parentName: "Ramesh Patel",
    phone: "9812345678",
    forClass: "VII",
    appliedDate: "2024-11-15",
    status: "Admitted",
    admissionNo: "2024-1101",
    docs: { birthCert: true, transferCert: true, photo: true },
  },
  {
    id: "a4",
    name: "Kavya Nair",
    parentName: "Anita Nair",
    phone: "9898765432",
    forClass: "XI",
    appliedDate: "2024-11-10",
    status: "Cancelled",
    docs: { birthCert: false, transferCert: false, photo: true },
  },
  {
    id: "a5",
    name: "Arjun Singh",
    parentName: "Vikram Singh",
    phone: "9765432109",
    forClass: "V",
    appliedDate: "2024-11-22",
    status: "Applied",
    docs: { birthCert: true, transferCert: false, photo: false },
  },
  {
    id: "a6",
    name: "Sneha Gupta",
    parentName: "Amit Gupta",
    phone: "9654321098",
    forClass: "VIII",
    appliedDate: "2024-11-21",
    status: "Documents Pending",
    docs: { birthCert: true, transferCert: true, photo: true },
  },
];

const STATUS_COLORS: Record<AdmissionStatus, string> = {
  Applied: "bg-blue-500/10 text-blue-600",
  "Documents Pending": "bg-yellow-500/10 text-yellow-700",
  Admitted: "bg-green-500/10 text-green-700",
  Cancelled: "bg-red-500/10 text-red-600",
};

const STATUSES: AdmissionStatus[] = [
  "Applied",
  "Documents Pending",
  "Admitted",
  "Cancelled",
];

const SCHOOL_NAME = "SmartSkale Public School";

export function AdmissionsPage() {
  const [admissions, setAdmissions] = useState<Admission[]>(initialAdmissions);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

  // New admission form state
  const [form, setForm] = useState({
    name: "",
    parentName: "",
    phone: "",
    forClass: "",
    source: "Walk-in",
  });

  // File state for each document
  const [docFiles, setDocFiles] = useState<{
    birthCert: File | null;
    transferCert: File | null;
    photo: File | null;
  }>({ birthCert: null, transferCert: null, photo: null });

  // Hidden file input refs
  const birthCertRef = useRef<HTMLInputElement>(null);
  const transferCertRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const filteredAdmissions = admissions.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.parentName.toLowerCase().includes(q) ||
      a.phone.includes(q);
    const matchClass = classFilter === "all" || a.forClass === classFilter;
    return matchSearch && matchClass;
  });

  const resetForm = () => {
    setForm({
      name: "",
      parentName: "",
      phone: "",
      forClass: "",
      source: "Walk-in",
    });
    setDocFiles({ birthCert: null, transferCert: null, photo: null });
    if (birthCertRef.current) birthCertRef.current.value = "";
    if (transferCertRef.current) transferCertRef.current.value = "";
    if (photoRef.current) photoRef.current.value = "";
  };

  const handleAddSubmit = () => {
    if (!form.name || !form.parentName || !form.phone) {
      toast.error("Please fill in student name, parent name, and phone.");
      return;
    }
    const newAdmission: Admission = {
      id: `a${Date.now()}`,
      name: form.name,
      parentName: form.parentName,
      phone: form.phone,
      forClass: form.forClass || "—",
      appliedDate: new Date().toISOString().slice(0, 10),
      status: "Applied",
      docs: {
        birthCert: !!docFiles.birthCert,
        transferCert: !!docFiles.transferCert,
        photo: !!docFiles.photo,
      },
    };
    setAdmissions((prev) => [newAdmission, ...prev]);
    toast.success(`Admission application added for ${form.name}!`);
    setAddOpen(false);
    resetForm();
  };

  const admit = (id: string) => {
    const admNo = `2024-1${String(100 + Math.floor(Math.random() * 900))}`;
    setAdmissions((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "Admitted", admissionNo: admNo } : a,
      ),
    );
    toast.success(`Student admitted! Admission No: ${admNo}`);
  };

  const cancel = (id: string) => {
    setAdmissions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Cancelled" } : a)),
    );
    toast.info("Application cancelled.");
  };

  const toggleDoc = (id: string, doc: keyof Admission["docs"]) => {
    setAdmissions((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, docs: { ...a.docs, [doc]: !a.docs[doc] } } : a,
      ),
    );
  };

  const handlePrint = (a: Admission) => {
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) {
      toast.error("Popup blocked. Please allow popups for this site.");
      return;
    }
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Admission Form - ${a.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; color: #111; }
          h1 { font-size: 22px; font-weight: bold; margin: 0; text-align: center; }
          h2 { font-size: 16px; margin: 8px 0 0; text-align: center; }
          .header { border-bottom: 2px solid #333; padding-bottom: 16px; margin-bottom: 24px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          td { padding: 8px 12px; border-bottom: 1px solid #eee; }
          td:first-child { font-weight: bold; width: 40%; background: #f5f5f5; }
          .signatures { margin-top: 40px; display: flex; justify-content: space-between; }
          .sig-line { border-top: 1px solid #333; width: 150px; padding-top: 8px; text-align: center; font-size: 13px; }
          .footer { margin-top: 30px; font-size: 11px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${SCHOOL_NAME}</h1>
          <h2>Admission Application Form</h2>
        </div>
        <table>
          <tbody>
            <tr><td>Student Name</td><td>${a.name}</td></tr>
            <tr><td>Parent / Guardian</td><td>${a.parentName}</td></tr>
            <tr><td>Contact Number</td><td>${a.phone}</td></tr>
            <tr><td>Class Applied For</td><td>${a.forClass}</td></tr>
            <tr><td>Application Date</td><td>${a.appliedDate}</td></tr>
            <tr><td>Admission Number</td><td>${a.admissionNo || "\u2014"}</td></tr>
            <tr><td>Status</td><td>${a.status}</td></tr>
            <tr><td>Birth Certificate</td><td>${a.docs.birthCert ? "Submitted" : "Pending"}</td></tr>
            <tr><td>Transfer Certificate</td><td>${a.docs.transferCert ? "Submitted" : "Pending"}</td></tr>
            <tr><td>Photograph</td><td>${a.docs.photo ? "Submitted" : "Pending"}</td></tr>
          </tbody>
        </table>
        <div class="signatures">
          <div class="sig-line">Parent Signature</div>
          <div class="sig-line">Principal Signature</div>
        </div>
        <p class="footer">Printed on ${new Date().toLocaleDateString("en-IN")} &middot; ${SCHOOL_NAME}</p>
      </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  const counts = {
    Total: admissions.length,
    Applied: admissions.filter((a) => a.status === "Applied").length,
    "Documents Pending": admissions.filter(
      (a) => a.status === "Documents Pending",
    ).length,
    Admitted: admissions.filter((a) => a.status === "Admitted").length,
    Cancelled: admissions.filter((a) => a.status === "Cancelled").length,
  };

  const renderList = (list: Admission[]) => (
    <div className="space-y-3">
      {list.length === 0 && (
        <div
          className="text-center py-10 text-muted-foreground"
          data-ocid="admissions.empty_state"
        >
          No admissions found.
        </div>
      )}
      {list.map((a, i) => (
        <div
          key={a.id}
          data-ocid={`admissions.item.${i + 1}`}
          className="bg-card border border-border rounded-2xl p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground">{a.name}</span>
                <Badge className={STATUS_COLORS[a.status]}>{a.status}</Badge>
                {a.admissionNo && (
                  <span className="text-xs text-muted-foreground font-mono">
                    {a.admissionNo}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {a.parentName} · {a.phone} · Class {a.forClass} · Applied:{" "}
                {a.appliedDate}
              </p>
              {/* Document checklist */}
              <div className="flex items-center gap-3 mt-2">
                {[
                  { key: "birthCert" as const, label: "Birth Cert" },
                  { key: "transferCert" as const, label: "TC" },
                  { key: "photo" as const, label: "Photo" },
                ].map(({ key, label }) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => toggleDoc(a.id, key)}
                    className="flex items-center gap-1 text-xs hover:opacity-80 transition-opacity"
                    data-ocid="admissions.toggle"
                  >
                    {a.docs[key] ? (
                      <CheckCircle size={14} className="text-green-500" />
                    ) : (
                      <XCircle size={14} className="text-red-400" />
                    )}
                    <span
                      className={
                        a.docs[key] ? "text-green-600" : "text-red-500"
                      }
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {(a.status === "Applied" || a.status === "Documents Pending") && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => admit(a.id)}
                  data-ocid={`admissions.confirm_button.${i + 1}`}
                >
                  Admit
                </Button>
              )}
              {a.status !== "Admitted" && a.status !== "Cancelled" && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => cancel(a.id)}
                  data-ocid={`admissions.delete_button.${i + 1}`}
                >
                  Cancel
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePrint(a)}
                data-ocid="admissions.print.button"
              >
                <Printer size={14} className="mr-1" /> Print
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePrint(a)}
                data-ocid={`admissions.pdf_button.${i + 1}`}
              >
                <FileDown size={14} className="mr-1" /> Export PDF
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6" data-ocid="admissions.page">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="text-primary" size={24} />
          <h1 className="text-2xl font-bold text-foreground">Admissions</h1>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          data-ocid="admissions.open_modal_button"
        >
          <Plus size={16} className="mr-2" /> Add New Admission
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        {Object.entries(counts).map(([label, count]) => (
          <div
            key={label}
            className="bg-card border border-border rounded-2xl p-3 text-center"
          >
            <p className="text-2xl font-bold text-foreground">{count}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Search + Class Filter + View Toggle */}
      <div className="flex gap-3 items-center flex-wrap">
        <Input
          placeholder="Search by student name, parent name, or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
          data-ocid="admissions.search_input"
        />
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-40" data-ocid="admissions.class.select">
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
        <div className="flex items-center border border-border rounded-lg overflow-hidden ml-auto">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}
            title="List View"
            data-ocid="admissions.list.toggle"
          >
            <LayoutList size={16} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("kanban")}
            className={`p-2 transition-colors ${viewMode === "kanban" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}
            title="Kanban View"
            data-ocid="admissions.kanban.toggle"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {viewMode === "kanban" ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
          data-ocid="admissions.kanban.panel"
        >
          {(
            [
              {
                status: "Applied" as AdmissionStatus,
                color: "bg-blue-500",
                light: "bg-blue-50 dark:bg-blue-950/20",
              },
              {
                status: "Documents Pending" as AdmissionStatus,
                color: "bg-amber-500",
                light: "bg-amber-50 dark:bg-amber-950/20",
              },
              {
                status: "Admitted" as AdmissionStatus,
                color: "bg-green-500",
                light: "bg-green-50 dark:bg-green-950/20",
              },
              {
                status: "Cancelled" as AdmissionStatus,
                color: "bg-red-500",
                light: "bg-red-50 dark:bg-red-950/20",
              },
            ] as { status: AdmissionStatus; color: string; light: string }[]
          ).map(({ status, color, light }) => {
            const colItems = filteredAdmissions.filter(
              (a) => a.status === status,
            );
            return (
              <div
                key={status}
                className="flex flex-col rounded-xl border border-border overflow-hidden"
              >
                <div
                  className={`${color} px-3 py-2 flex items-center justify-between`}
                >
                  <span className="text-white text-sm font-semibold">
                    {status}
                  </span>
                  <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {colItems.length}
                  </span>
                </div>
                <div className={`flex-1 p-2 space-y-2 min-h-[200px] ${light}`}>
                  {colItems.length === 0 && (
                    <div
                      className="text-center text-xs text-muted-foreground pt-6"
                      data-ocid="admissions.empty_state"
                    >
                      No records
                    </div>
                  )}
                  {colItems.map((a, i) => (
                    <div
                      key={a.id}
                      className="bg-card border border-border rounded-lg p-3 space-y-2 shadow-sm"
                      data-ocid={`admissions.item.${i + 1}`}
                    >
                      <div className="font-semibold text-sm text-foreground">
                        {a.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {a.parentName} · {a.phone}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Class {a.forClass}
                      </div>
                      <div className="flex items-center gap-2">
                        {[
                          { key: "birthCert" as const, label: "BC" },
                          { key: "transferCert" as const, label: "TC" },
                          { key: "photo" as const, label: "Ph" },
                        ].map(({ key, label }) => (
                          <span
                            key={key}
                            className={`flex items-center gap-0.5 text-xs ${a.docs[key] ? "text-green-600" : "text-red-500"}`}
                          >
                            {a.docs[key] ? (
                              <CheckCircle size={11} />
                            ) : (
                              <XCircle size={11} />
                            )}
                            {label}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-1 flex-wrap pt-1">
                        {(status === "Applied" ||
                          status === "Documents Pending") && (
                          <Button
                            size="sm"
                            className="h-6 text-xs px-2"
                            onClick={() => admit(a.id)}
                            data-ocid={`admissions.confirm_button.${i + 1}`}
                          >
                            Admit
                          </Button>
                        )}
                        {status !== "Admitted" && status !== "Cancelled" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-6 text-xs px-2"
                            onClick={() => cancel(a.id)}
                            data-ocid={`admissions.delete_button.${i + 1}`}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Tabs defaultValue="All" data-ocid="admissions.tab">
          <TabsList>
            <TabsTrigger value="All">All</TabsTrigger>
            {STATUSES.map((s) => (
              <TabsTrigger key={s} value={s}>
                {s}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="All" className="mt-4">
            {renderList(filteredAdmissions)}
          </TabsContent>
          {STATUSES.map((s) => (
            <TabsContent key={s} value={s} className="mt-4">
              {renderList(filteredAdmissions.filter((a) => a.status === s))}
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Add New Admission Dialog */}
      <Dialog
        open={addOpen}
        onOpenChange={(open) => {
          setAddOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-w-lg" data-ocid="admissions.modal">
          <DialogHeader>
            <DialogTitle>Add New Admission</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Applicant Info */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">
                Applicant Information
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 col-span-2">
                  <Label>Student Name *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Full name of student"
                    data-ocid="admissions.name.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Parent / Guardian Name *</Label>
                  <Input
                    value={form.parentName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, parentName: e.target.value }))
                    }
                    placeholder="Parent's name"
                    data-ocid="admissions.parent_name.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Phone *</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="10-digit mobile"
                    data-ocid="admissions.phone.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Class Applied For</Label>
                  <Select
                    value={form.forClass}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, forClass: v }))
                    }
                  >
                    <SelectTrigger data-ocid="admissions.forclass.select">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {CLASSES.map((c) => (
                        <SelectItem key={c} value={c}>
                          Class {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Source</Label>
                  <Select
                    value={form.source}
                    onValueChange={(v) => setForm((f) => ({ ...f, source: v }))}
                  >
                    <SelectTrigger data-ocid="admissions.source.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Walk-in", "Online", "Referral", "Phone"].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">
                Document Upload
              </p>
              <div className="space-y-3">
                {(
                  [
                    {
                      key: "birthCert" as const,
                      label: "Birth Certificate",
                      ref: birthCertRef,
                    },
                    {
                      key: "transferCert" as const,
                      label: "Transfer Certificate",
                      ref: transferCertRef,
                    },
                    {
                      key: "photo" as const,
                      label: "Passport Photo",
                      ref: photoRef,
                    },
                  ] as {
                    key: keyof typeof docFiles;
                    label: string;
                    ref: React.RefObject<HTMLInputElement>;
                  }[]
                ).map(({ key, label, ref }) => (
                  <div key={key} className="flex items-center gap-3">
                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      ref={ref}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setDocFiles((prev) => ({ ...prev, [key]: file }));
                      }}
                      data-ocid={`admissions.${key}.file_input`}
                    />
                    <button
                      type="button"
                      onClick={() => ref.current?.click()}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border-2 border-dashed transition-colors w-full ${
                        docFiles[key]
                          ? "border-green-400 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400"
                          : "border-border hover:border-primary text-muted-foreground hover:text-foreground"
                      }`}
                      data-ocid="admissions.upload_button"
                    >
                      {docFiles[key] ? (
                        <>
                          <CheckCircle
                            size={16}
                            className="text-green-500 shrink-0"
                          />
                          <span className="flex-1 text-left truncate">
                            {docFiles[key]?.name}
                          </span>
                        </>
                      ) : (
                        <>
                          <UploadCloud size={16} className="shrink-0" />
                          <span className="flex-1 text-left">{label}</span>
                          <Paperclip
                            size={14}
                            className="shrink-0 opacity-50"
                          />
                        </>
                      )}
                    </button>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">
                  Accepted formats: PDF, JPG, PNG (max 5MB each)
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAddOpen(false);
                resetForm();
              }}
              data-ocid="admissions.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSubmit}
              data-ocid="admissions.submit_button"
            >
              Add Admission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
