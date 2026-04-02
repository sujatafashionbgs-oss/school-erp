import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CLASSES, SECTIONS } from "@/data/classConfig";
import {
  type Scholarship,
  type ScholarshipApplication,
  mockScholarshipApplications,
  mockScholarships,
} from "@/data/mockScholarships";
import {
  Award,
  CheckCircle,
  FileText,
  Plus,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const TYPE_COLORS: Record<Scholarship["type"], string> = {
  Merit: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Need-Based":
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Government:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Sports:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  Special: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
};

const STATUS_COLORS: Record<ScholarshipApplication["status"], string> = {
  Applied: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Under Review":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Approved:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

function formatCurrency(amount: number) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}

export function ScholarshipPage() {
  const [schemes, setSchemes] = useState<Scholarship[]>(mockScholarships);
  const [applications, setApplications] = useState<ScholarshipApplication[]>(
    mockScholarshipApplications,
  );
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [classFilter, setClassFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<ScholarshipApplication | null>(
    null,
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Add Scholarship dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [newScholarship, setNewScholarship] = useState({
    name: "",
    type: "Merit" as Scholarship["type"],
    amount: "",
    criteria: "",
    maxRecipients: "",
    status: "Active" as Scholarship["status"],
  });

  // Approve dialog state
  const [approveOpen, setApproveOpen] = useState(false);
  const [approveTarget, setApproveTarget] =
    useState<ScholarshipApplication | null>(null);
  const [concessionAmount, setConcessionAmount] = useState("");
  const [approveRemarks, setApproveRemarks] = useState("");

  // Reject dialog state
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectTarget, setRejectTarget] =
    useState<ScholarshipApplication | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filteredApps = applications.filter((a) => {
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    const matchClass =
      classFilter === "all" ||
      a.class.startsWith(`${classFilter}-`) ||
      a.class.startsWith(classFilter);
    return matchStatus && matchClass;
  });

  const totalAwarded = applications
    .filter((a) => a.status === "Approved")
    .reduce((sum, a) => sum + a.concessionAmount, 0);
  const studentsBenefited = applications.filter(
    (a) => a.status === "Approved",
  ).length;
  const pendingReview = applications.filter(
    (a) => a.status === "Applied" || a.status === "Under Review",
  ).length;

  function handleToggleScheme(id: string) {
    setSchemes((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" }
          : s,
      ),
    );
  }

  function handleAddScholarship() {
    if (
      !newScholarship.name ||
      !newScholarship.amount ||
      !newScholarship.criteria ||
      !newScholarship.maxRecipients
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    const scheme: Scholarship = {
      id: `SCH${String(schemes.length + 1).padStart(3, "0")}`,
      name: newScholarship.name,
      type: newScholarship.type,
      amount: Number(newScholarship.amount),
      criteria: newScholarship.criteria,
      maxRecipients: Number(newScholarship.maxRecipients),
      currentRecipients: 0,
      status: newScholarship.status,
    };
    setSchemes((prev) => [...prev, scheme]);
    setNewScholarship({
      name: "",
      type: "Merit",
      amount: "",
      criteria: "",
      maxRecipients: "",
      status: "Active",
    });
    setAddOpen(false);
    toast.success("Scholarship scheme added successfully");
  }

  function openApprove(app: ScholarshipApplication) {
    setApproveTarget(app);
    const scheme = schemes.find((s) => s.id === app.scholarshipId);
    setConcessionAmount(String(scheme?.amount ?? app.concessionAmount));
    setApproveRemarks("");
    setApproveOpen(true);
  }

  function handleApprove() {
    if (!approveTarget) return;
    setApplications((prev) =>
      prev.map((a) =>
        a.id === approveTarget.id
          ? {
              ...a,
              status: "Approved",
              concessionAmount: Number(concessionAmount),
              remarks: approveRemarks,
            }
          : a,
      ),
    );
    setApproveOpen(false);
    setDrawerOpen(false);
    toast.success("Scholarship approved and fee concession applied");
  }

  function openReject(app: ScholarshipApplication) {
    setRejectTarget(app);
    setRejectReason("");
    setRejectOpen(true);
  }

  function handleReject() {
    if (!rejectTarget) return;
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    setApplications((prev) =>
      prev.map((a) =>
        a.id === rejectTarget.id
          ? { ...a, status: "Rejected", remarks: rejectReason }
          : a,
      ),
    );
    setRejectOpen(false);
    setDrawerOpen(false);
    toast.success("Application rejected");
  }

  function openDrawer(app: ScholarshipApplication) {
    setSelectedApp(app);
    setDrawerOpen(true);
  }

  const canAction = (status: ScholarshipApplication["status"]) =>
    status === "Applied" || status === "Under Review";

  return (
    <div className="space-y-6" data-ocid="scholarship.page">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Scholarship & Fee Concession
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage scholarship schemes and student concession applications
          </p>
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Award
                  className="text-green-600 dark:text-green-400"
                  size={20}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Total Scholarships Awarded
                </p>
                <p className="text-xl font-bold text-foreground">
                  ₹{(totalAwarded / 100000).toFixed(1)}L
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Users className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Students Benefited
                </p>
                <p className="text-xl font-bold text-foreground">
                  {studentsBenefited}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <FileText
                  className="text-amber-600 dark:text-amber-400"
                  size={20}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending Review</p>
                <p className="text-xl font-bold text-foreground">
                  {pendingReview}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="schemes">
        <TabsList>
          <TabsTrigger value="schemes" data-ocid="scholarship.schemes.tab">
            Scholarship Schemes
          </TabsTrigger>
          <TabsTrigger
            value="applications"
            data-ocid="scholarship.applications.tab"
          >
            Applications
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Schemes */}
        <TabsContent value="schemes" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button data-ocid="scholarship.add_scholarship.button">
                  <Plus size={16} className="mr-2" />
                  Add Scholarship
                </Button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-md"
                data-ocid="scholarship.add_scholarship.dialog"
              >
                <DialogHeader>
                  <DialogTitle>Add New Scholarship Scheme</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-1.5">
                    <Label>Scheme Name</Label>
                    <Input
                      placeholder="e.g. Academic Excellence Award"
                      value={newScholarship.name}
                      onChange={(e) =>
                        setNewScholarship((p) => ({
                          ...p,
                          name: e.target.value,
                        }))
                      }
                      data-ocid="scholarship.name.input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Type</Label>
                      <Select
                        value={newScholarship.type}
                        onValueChange={(v) =>
                          setNewScholarship((p) => ({
                            ...p,
                            type: v as Scholarship["type"],
                          }))
                        }
                      >
                        <SelectTrigger data-ocid="scholarship.type.select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "Merit",
                            "Need-Based",
                            "Government",
                            "Sports",
                            "Special",
                          ].map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Amount (₹)</Label>
                      <Input
                        type="number"
                        placeholder="15000"
                        value={newScholarship.amount}
                        onChange={(e) =>
                          setNewScholarship((p) => ({
                            ...p,
                            amount: e.target.value,
                          }))
                        }
                        data-ocid="scholarship.amount.input"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Eligibility Criteria</Label>
                    <Textarea
                      placeholder="Describe the eligibility criteria..."
                      value={newScholarship.criteria}
                      onChange={(e) =>
                        setNewScholarship((p) => ({
                          ...p,
                          criteria: e.target.value,
                        }))
                      }
                      rows={3}
                      data-ocid="scholarship.criteria.textarea"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Max Recipients</Label>
                      <Input
                        type="number"
                        placeholder="20"
                        value={newScholarship.maxRecipients}
                        onChange={(e) =>
                          setNewScholarship((p) => ({
                            ...p,
                            maxRecipients: e.target.value,
                          }))
                        }
                        data-ocid="scholarship.max_recipients.input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Status</Label>
                      <div className="flex items-center gap-2 pt-2">
                        <Switch
                          checked={newScholarship.status === "Active"}
                          onCheckedChange={(c) =>
                            setNewScholarship((p) => ({
                              ...p,
                              status: c ? "Active" : "Inactive",
                            }))
                          }
                          data-ocid="scholarship.status.switch"
                        />
                        <span className="text-sm">{newScholarship.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setAddOpen(false)}
                    data-ocid="scholarship.add_cancel.button"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddScholarship}
                    data-ocid="scholarship.add_submit.button"
                  >
                    Add Scheme
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schemes.map((scheme, idx) => (
              <Card
                key={scheme.id}
                className={`transition-opacity ${scheme.status === "Inactive" ? "opacity-60" : ""}`}
                data-ocid={`scholarship.schemes.item.${idx + 1}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">
                      {scheme.name}
                    </CardTitle>
                    <Switch
                      checked={scheme.status === "Active"}
                      onCheckedChange={() => handleToggleScheme(scheme.id)}
                      data-ocid={`scholarship.scheme_toggle.${idx + 1}`}
                    />
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium w-fit ${TYPE_COLORS[scheme.type]}`}
                  >
                    {scheme.type}
                  </span>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">
                      Annual Amount
                    </span>
                    <span className="font-bold text-base text-foreground">
                      ₹{scheme.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {scheme.criteria}
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Recipients</span>
                      <span className="font-medium">
                        {scheme.currentRecipients}/{scheme.maxRecipients}
                      </span>
                    </div>
                    <Progress
                      value={
                        (scheme.currentRecipients / scheme.maxRecipients) * 100
                      }
                      className="h-1.5"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        scheme.status === "Active"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <span className="text-xs text-muted-foreground">
                      {scheme.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 2: Applications */}
        <TabsContent value="applications" className="space-y-4">
          {/* Class / Section filter */}
          <div className="flex flex-wrap gap-2 mb-2">
            <Select
              value={classFilter}
              onValueChange={(v) => {
                setClassFilter(v);
              }}
            >
              <SelectTrigger
                className="w-36"
                data-ocid="scholarship.class_filter.select"
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
          </div>
          {/* Status filter tabs */}
          <div className="flex flex-wrap gap-2">
            {["All", "Applied", "Under Review", "Approved", "Rejected"].map(
              (s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  data-ocid="scholarship.status_filter.tab"
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                    statusFilter === s
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {s}
                  <span className="ml-1.5 opacity-70">
                    (
                    {s === "All"
                      ? applications.length
                      : applications.filter((a) => a.status === s).length}
                    )
                  </span>
                </button>
              ),
            )}
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Adm. No</TableHead>
                      <TableHead>Scholarship</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Concession</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApps.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-8 text-muted-foreground"
                          data-ocid="scholarship.applications.empty_state"
                        >
                          No applications found
                        </TableCell>
                      </TableRow>
                    )}
                    {filteredApps.map((app, idx) => (
                      <TableRow
                        key={app.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => openDrawer(app)}
                        data-ocid={`scholarship.applications.item.${idx + 1}`}
                      >
                        <TableCell className="font-medium">
                          {app.studentName}
                        </TableCell>
                        <TableCell>{app.class}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {app.admissionNo}
                        </TableCell>
                        <TableCell className="max-w-[140px] truncate">
                          {app.scholarshipName}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(app.appliedDate).toLocaleDateString(
                            "en-IN",
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              STATUS_COLORS[app.status]
                            }`}
                          >
                            {app.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {app.status === "Approved" ? (
                            formatCurrency(app.concessionAmount)
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDrawer(app)}
                              data-ocid={`scholarship.view.button.${idx + 1}`}
                            >
                              View
                            </Button>
                            {canAction(app.status) && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                                  onClick={() => openApprove(app)}
                                  data-ocid={`scholarship.approve.button.${idx + 1}`}
                                >
                                  <CheckCircle size={14} className="mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  onClick={() => openReject(app)}
                                  data-ocid={`scholarship.reject.button.${idx + 1}`}
                                >
                                  <XCircle size={14} className="mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Application Detail Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          className="w-full sm:max-w-lg overflow-y-auto"
          data-ocid="scholarship.application.sheet"
        >
          {selectedApp && (
            <>
              <SheetHeader className="mb-4">
                <SheetTitle>Application Details</SheetTitle>
              </SheetHeader>
              <div className="space-y-5">
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Student Name
                    </span>
                    <span className="text-sm font-semibold">
                      {selectedApp.studentName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Class</span>
                    <span className="text-sm font-medium">
                      {selectedApp.class}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Admission No
                    </span>
                    <span className="text-sm font-medium">
                      {selectedApp.admissionNo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Scholarship
                    </span>
                    <span className="text-sm font-medium text-right max-w-[180px]">
                      {selectedApp.scholarshipName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Applied Date
                    </span>
                    <span className="text-sm">
                      {new Date(selectedApp.appliedDate).toLocaleDateString(
                        "en-IN",
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_COLORS[selectedApp.status]
                      }`}
                    >
                      {selectedApp.status}
                    </span>
                  </div>
                  {selectedApp.status === "Approved" && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Concession
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        ₹{selectedApp.concessionAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  {selectedApp.remarks && (
                    <div className="pt-1">
                      <span className="text-xs text-muted-foreground">
                        Remarks
                      </span>
                      <p className="text-sm mt-0.5">{selectedApp.remarks}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">
                    Submitted Documents
                  </h3>
                  <div className="space-y-1.5">
                    {selectedApp.documents.map((doc) => (
                      <div
                        key={doc}
                        className="flex items-center gap-2 p-2 rounded-md bg-muted/40 text-sm"
                      >
                        <FileText
                          size={14}
                          className="text-muted-foreground shrink-0"
                        />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {canAction(selectedApp.status) && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        openApprove(selectedApp);
                      }}
                      data-ocid="scholarship.drawer_approve.button"
                    >
                      <CheckCircle size={14} className="mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        openReject(selectedApp);
                      }}
                      data-ocid="scholarship.drawer_reject.button"
                    >
                      <XCircle size={14} className="mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Approve Dialog */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent data-ocid="scholarship.approve.dialog">
          <DialogHeader>
            <DialogTitle>Approve Scholarship Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Approving for:{" "}
              <span className="font-semibold text-foreground">
                {approveTarget?.studentName}
              </span>
            </p>
            <div className="space-y-1.5">
              <Label>Concession Amount (₹)</Label>
              <Input
                type="number"
                value={concessionAmount}
                onChange={(e) => setConcessionAmount(e.target.value)}
                data-ocid="scholarship.concession_amount.input"
              />
              <p className="text-xs text-muted-foreground">
                Pre-filled from scheme amount. Editable.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label>Remarks (optional)</Label>
              <Textarea
                placeholder="Add approval remarks..."
                value={approveRemarks}
                onChange={(e) => setApproveRemarks(e.target.value)}
                rows={3}
                data-ocid="scholarship.approve_remarks.textarea"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveOpen(false)}
              data-ocid="scholarship.approve_cancel.button"
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleApprove}
              data-ocid="scholarship.approve_confirm.button"
            >
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent data-ocid="scholarship.reject.dialog">
          <DialogHeader>
            <DialogTitle>Reject Scholarship Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Rejecting application for:{" "}
              <span className="font-semibold text-foreground">
                {rejectTarget?.studentName}
              </span>
            </p>
            <div className="space-y-1.5">
              <Label>Rejection Reason</Label>
              <Textarea
                placeholder="Provide the reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                data-ocid="scholarship.reject_reason.textarea"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectOpen(false)}
              data-ocid="scholarship.reject_cancel.button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              data-ocid="scholarship.reject_confirm.button"
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
