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
import { Textarea } from "@/components/ui/textarea";
import {
  type Enquiry,
  type EnquiryStage,
  mockEnquiries,
} from "@/data/mockEnquiries";
import {
  ArrowUpDown,
  LayoutGrid,
  LayoutList,
  MessageSquare,
  Phone,
  Plus,
  Search,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STAGES: EnquiryStage[] = [
  "New",
  "Contacted",
  "Follow-up",
  "Admitted",
  "Rejected",
];

const STAGE_COLORS: Record<EnquiryStage, string> = {
  New: "bg-blue-500/10 text-blue-600 border-blue-200",
  Contacted: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  "Follow-up": "bg-orange-500/10 text-orange-600 border-orange-200",
  Admitted: "bg-green-500/10 text-green-700 border-green-200",
  Rejected: "bg-red-500/10 text-red-600 border-red-200",
};

const STAGE_HEADER_COLORS: Record<EnquiryStage, string> = {
  New: "bg-blue-500",
  Contacted: "bg-yellow-500",
  "Follow-up": "bg-orange-500",
  Admitted: "bg-green-500",
  Rejected: "bg-red-500",
};

export function EnquiryPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(mockEnquiries);
  const [addOpen, setAddOpen] = useState(false);
  const [detailEnquiry, setDetailEnquiry] = useState<Enquiry | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [sortField, setSortField] = useState<keyof Enquiry | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [form, setForm] = useState({
    studentName: "",
    parentName: "",
    phone: "",
    classInterested: "",
    source: "Walk-in" as Enquiry["source"],
    notes: "",
  });

  const filteredEnquiries = enquiries.filter((e) => {
    const q = search.toLowerCase();
    return (
      !q ||
      e.studentName?.toLowerCase().includes(q) ||
      e.parentName?.toLowerCase().includes(q) ||
      e.phone?.includes(q) ||
      e.stage?.toLowerCase().includes(q)
    );
  });

  const moveStage = (id: string, stage: EnquiryStage) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, stage } : e)),
    );
    toast.success(`Moved to ${stage}`);
  };

  const handleAdd = () => {
    if (!form.studentName || !form.parentName || !form.phone) {
      toast.error("Please fill student name, parent name, and phone.");
      return;
    }
    const newEnquiry: Enquiry = {
      id: `eq${Date.now()}`,
      studentName: form.studentName,
      parentName: form.parentName,
      phone: form.phone,
      classInterested: form.classInterested,
      date: new Date().toISOString().slice(0, 10),
      source: form.source,
      stage: "New",
      notes: form.notes,
    };
    setEnquiries((prev) => [...prev, newEnquiry]);
    toast.success("Enquiry added!");
    setAddOpen(false);
    setForm({
      studentName: "",
      parentName: "",
      phone: "",
      classInterested: "",
      source: "Walk-in",
      notes: "",
    });
  };

  const listCols: { label: string; field: keyof Enquiry }[] = [
    { label: "Name", field: "studentName" },
    { label: "Parent", field: "parentName" },
    { label: "Phone", field: "phone" },
    { label: "Class", field: "classInterested" },
    { label: "Stage", field: "stage" },
    { label: "Date", field: "date" },
  ];

  const sortedEnquiries = [...filteredEnquiries].sort((a, b) => {
    if (!sortField) return 0;
    const av = a[sortField] ?? "";
    const bv = b[sortField] ?? "";
    return sortDir === "asc"
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  return (
    <div className="space-y-6" data-ocid="enquiry.page">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="text-primary" size={24} />
          <h1 className="text-2xl font-bold text-foreground">Enquiry CRM</h1>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          data-ocid="enquiry.open_modal_button"
        >
          <Plus size={16} className="mr-2" /> New Enquiry
        </Button>
      </div>

      {/* Search + View Toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search by name, mobile, or stage..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-ocid="enquiry.search_input"
          />
        </div>
        <div className="flex border border-border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setViewMode("kanban")}
            className={`p-2 ${
              viewMode === "kanban"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted"
            }`}
            title="Kanban View"
            data-ocid="enquiry.toggle"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`p-2 ${
              viewMode === "list"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted"
            }`}
            title="List View"
            data-ocid="enquiry.toggle"
          >
            <LayoutList size={16} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        {STAGES.map((stage) => (
          <div
            key={stage}
            className={`rounded-2xl border p-3 text-center ${STAGE_COLORS[stage]}`}
          >
            <p className="text-2xl font-bold">
              {enquiries.filter((e) => e.stage === stage).length}
            </p>
            <p className="text-xs font-medium mt-0.5">{stage}</p>
          </div>
        ))}
      </div>

      {/* Kanban / List View */}
      {viewMode === "list" ? (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {listCols.map((col) => (
                  <th
                    key={col.field}
                    className="px-4 py-3 text-left font-medium text-muted-foreground"
                  >
                    <button
                      type="button"
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                      onClick={() => {
                        if (sortField === col.field) {
                          setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                        } else {
                          setSortField(col.field);
                          setSortDir("asc");
                        }
                      }}
                    >
                      {col.label}
                      <ArrowUpDown size={12} className="opacity-50" />
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedEnquiries.map((enq, i) => (
                <tr
                  key={enq.id}
                  className="hover:bg-muted/30 transition-colors"
                  data-ocid={`enquiry.row.${i + 1}`}
                >
                  <td className="px-4 py-3 font-medium">{enq.studentName}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {enq.parentName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {enq.phone}
                  </td>
                  <td className="px-4 py-3">{enq.classInterested}</td>
                  <td className="px-4 py-3">
                    <Badge className={STAGE_COLORS[enq.stage]}>
                      {enq.stage}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {enq.date}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDetailEnquiry(enq)}
                        data-ocid={`enquiry.secondary_button.${i + 1}`}
                      >
                        View
                      </Button>
                      <Select
                        value={enq.stage}
                        onValueChange={(v) =>
                          moveStage(enq.id, v as EnquiryStage)
                        }
                      >
                        <SelectTrigger
                          className="h-7 w-28 text-xs"
                          data-ocid="enquiry.select"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STAGES.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredEnquiries.length === 0 && (
            <div
              className="text-center py-10 text-muted-foreground"
              data-ocid="enquiry.empty_state"
            >
              No enquiries found.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {STAGES.map((stage) => {
            const cards = filteredEnquiries.filter((e) => e.stage === stage);
            return (
              <div
                key={stage}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <div
                  className={`${STAGE_HEADER_COLORS[stage]} px-3 py-2 flex items-center justify-between`}
                >
                  <span className="text-white font-semibold text-sm">
                    {stage}
                  </span>
                  <span className="bg-white/20 text-white text-xs rounded-full px-2 py-0.5">
                    {cards.length}
                  </span>
                </div>
                <div className="p-2 space-y-2 min-h-24">
                  {cards.map((enq, i) => (
                    <div
                      key={enq.id}
                      className="bg-background border border-border rounded-xl p-3"
                    >
                      <button
                        type="button"
                        data-ocid={`enquiry.item.${i + 1}`}
                        className="w-full text-left cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setDetailEnquiry(enq)}
                      >
                        <p className="font-semibold text-sm text-foreground">
                          {enq.studentName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {enq.parentName}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Phone size={10} />
                          <span>{enq.phone}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="text-xs">
                            {enq.classInterested}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {enq.source}
                          </Badge>
                        </div>
                      </button>
                      <div className="mt-2">
                        <Select
                          value={enq.stage}
                          onValueChange={(v) =>
                            moveStage(enq.id, v as EnquiryStage)
                          }
                        >
                          <SelectTrigger
                            className="h-7 text-xs"
                            data-ocid="enquiry.select"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STAGES.map((s) => (
                              <SelectItem key={s} value={s} className="text-xs">
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Dialog */}
      {detailEnquiry && (
        <Dialog
          open={!!detailEnquiry}
          onOpenChange={() => setDetailEnquiry(null)}
        >
          <DialogContent data-ocid="enquiry.dialog">
            <DialogHeader>
              <DialogTitle>{detailEnquiry.studentName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">Parent: </span>
                  <span className="text-foreground">
                    {detailEnquiry.parentName}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone: </span>
                  <span className="text-foreground">{detailEnquiry.phone}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Class: </span>
                  <span className="text-foreground">
                    {detailEnquiry.classInterested}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Date: </span>
                  <span className="text-foreground">{detailEnquiry.date}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Source: </span>
                  <span className="text-foreground">
                    {detailEnquiry.source}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Stage: </span>
                  <Badge variant="secondary">{detailEnquiry.stage}</Badge>
                </div>
              </div>
              {detailEnquiry.notes && (
                <div className="bg-muted/40 rounded-xl p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Notes
                  </p>
                  <p>{detailEnquiry.notes}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDetailEnquiry(null)}
                data-ocid="enquiry.close_button"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent data-ocid="enquiry.modal">
          <DialogHeader>
            <DialogTitle>New Enquiry</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Student Name</Label>
                <Input
                  value={form.studentName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, studentName: e.target.value }))
                  }
                  data-ocid="enquiry.input"
                />
              </div>
              <div className="space-y-1">
                <Label>Parent Name</Label>
                <Input
                  value={form.parentName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, parentName: e.target.value }))
                  }
                  data-ocid="enquiry.input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  data-ocid="enquiry.input"
                />
              </div>
              <div className="space-y-1">
                <Label>Class Interested</Label>
                <Input
                  value={form.classInterested}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, classInterested: e.target.value }))
                  }
                  data-ocid="enquiry.input"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Source</Label>
              <Select
                value={form.source}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, source: v as Enquiry["source"] }))
                }
              >
                <SelectTrigger data-ocid="enquiry.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Walk-in", "Phone", "Website", "Referral"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                data-ocid="enquiry.textarea"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              data-ocid="enquiry.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={handleAdd} data-ocid="enquiry.submit_button">
              Add Enquiry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
