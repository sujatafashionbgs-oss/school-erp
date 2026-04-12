import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import {
  CheckSquare,
  ChevronDown,
  Eye,
  FileText,
  Plus,
  Search,
  Send,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import React from "react";
import { useState } from "react";
import { toast } from "sonner";

interface FormField {
  type: "text" | "checkbox" | "dropdown" | "date" | "number";
  label: string;
  required: boolean;
  options?: string[];
}

interface MockForm {
  id: string;
  name: string;
  createdBy: string;
  target: string;
  sentTo: number;
  responses: number;
  status: "Active" | "Draft" | "Closed";
  createdDate: string;
  fields: FormField[];
}

const mockRecipients = [
  "Ramesh Sharma",
  "Vikram Singh",
  "Suresh Mehta",
  "Dilip Patel",
  "Rajesh Kumar",
  "Prakash Joshi",
  "Mohan Verma",
  "Sajan Nair",
  "Biplab Das",
  "Venkat Reddy",
  "Anita Sharma",
  "Kavita Singh",
  "Priya Mehta",
  "Sunita Patel",
  "Geeta Kumar",
];

function generateResponseData(form: MockForm) {
  const seed = form.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return mockRecipients.slice(0, Math.min(form.sentTo, 15)).map((name, i) => {
    const responded = i < form.responses;
    const dateOffset = (seed + i) % 20;
    const d = new Date("2026-04-01");
    d.setDate(d.getDate() + dateOffset);
    return {
      id: `r${i}`,
      name,
      role:
        form.target === "Staff"
          ? "Teacher"
          : form.target === "Students"
            ? "Student"
            : "Parent",
      class:
        form.target === "Staff"
          ? "—"
          : `${["VI", "VII", "VIII", "IX", "X"][(seed + i) % 5]}-${["A", "B", "C"][(seed + i) % 3]}`,
      responded,
      responseDate: responded
        ? d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "—",
      fieldValues: form.fields.map((f) => ({
        label: f.label,
        value:
          f.type === "checkbox"
            ? i % 3 !== 0
              ? "Yes"
              : "No"
            : f.type === "dropdown"
              ? (f.options?.[i % (f.options.length || 1)] ?? "—")
              : f.type === "date"
                ? "2026-05-15"
                : `Sample response ${i + 1}`,
      })),
    };
  });
}

const mockForms: MockForm[] = [
  {
    id: "f1",
    name: "Annual Medical Check Consent",
    createdBy: "Admin",
    target: "Parents",
    sentTo: 162,
    responses: 134,
    status: "Active",
    createdDate: "2026-04-01",
    fields: [
      { type: "text", label: "Child Name", required: true },
      {
        type: "checkbox",
        label: "I consent to the annual medical examination",
        required: true,
      },
      { type: "date", label: "Preferred Date", required: false },
      {
        type: "text",
        label: "Any known allergies or conditions",
        required: false,
      },
    ],
  },
  {
    id: "f2",
    name: "Sports Day Permission Slip",
    createdBy: "Amit Kumar",
    target: "Parents",
    sentTo: 120,
    responses: 98,
    status: "Active",
    createdDate: "2026-04-15",
    fields: [
      { type: "text", label: "Parent Name", required: true },
      {
        type: "checkbox",
        label: "I give permission for my child to participate in Sports Day",
        required: true,
      },
      {
        type: "dropdown",
        label: "T-shirt Size",
        options: ["XS", "S", "M", "L", "XL"],
        required: true,
      },
    ],
  },
  {
    id: "f3",
    name: "Parent Satisfaction Survey",
    createdBy: "Admin",
    target: "Parents",
    sentTo: 162,
    responses: 45,
    status: "Active",
    createdDate: "2026-04-20",
    fields: [
      {
        type: "dropdown",
        label: "Overall Satisfaction",
        options: [
          "Very Satisfied",
          "Satisfied",
          "Neutral",
          "Dissatisfied",
          "Very Dissatisfied",
        ],
        required: true,
      },
      {
        type: "text",
        label: "What do you appreciate most about the school?",
        required: false,
      },
      { type: "text", label: "What could be improved?", required: false },
      {
        type: "checkbox",
        label: "Would you recommend this school to others?",
        required: false,
      },
    ],
  },
  {
    id: "f4",
    name: "Emergency Contact Update",
    createdBy: "Admin",
    target: "Parents",
    sentTo: 162,
    responses: 162,
    status: "Closed",
    createdDate: "2026-03-01",
    fields: [
      { type: "text", label: "Primary Contact Name", required: true },
      { type: "text", label: "Primary Contact Phone", required: true },
      { type: "text", label: "Secondary Contact Name", required: false },
      { type: "text", label: "Relationship", required: true },
    ],
  },
  {
    id: "f5",
    name: "Teacher Professional Development Feedback",
    createdBy: "Admin",
    target: "Staff",
    sentTo: 32,
    responses: 12,
    status: "Active",
    createdDate: "2026-04-25",
    fields: [
      {
        type: "dropdown",
        label: "Training Session Attended",
        options: [
          "Digital Literacy",
          "Special Needs Education",
          "Assessment Techniques",
          "None",
        ],
        required: true,
      },
      { type: "text", label: "Key Learning", required: false },
      {
        type: "checkbox",
        label: "I would like further training",
        required: false,
      },
    ],
  },
  {
    id: "f6",
    name: "Student Interest Survey",
    createdBy: "Priya Singh",
    target: "Students",
    sentTo: 80,
    responses: 5,
    status: "Draft",
    createdDate: "2026-05-01",
    fields: [
      {
        type: "dropdown",
        label: "Favourite Subject",
        options: [
          "Math",
          "Science",
          "English",
          "Hindi",
          "Social Science",
          "Art",
          "PE",
        ],
        required: true,
      },
      {
        type: "checkbox",
        label: "Would you like after-school clubs?",
        required: false,
      },
      { type: "text", label: "Club ideas", required: false },
    ],
  },
];

function statusBadge(status: string) {
  if (status === "Active")
    return (
      <Badge className="bg-green-500/15 text-green-700 border-green-300">
        Active
      </Badge>
    );
  if (status === "Draft")
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Draft
      </Badge>
    );
  return <Badge className="bg-muted text-muted-foreground">Closed</Badge>;
}

export function FormsPage() {
  const [forms, setForms] = useState<MockForm[]>(mockForms);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterTarget, setFilterTarget] = useState("All");
  const [responseSheetForm, setResponseSheetForm] = useState<MockForm | null>(
    null,
  );
  const [viewResponseRecipient, setViewResponseRecipient] = useState<{
    name: string;
    fieldValues: { label: string; value: string }[];
  } | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filtered = forms.filter((f) => {
    if (search && !f.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (filterStatus !== "All" && f.status !== filterStatus) return false;
    if (filterTarget !== "All" && f.target !== filterTarget) return false;
    return true;
  });

  const totalResponses = forms.reduce((s, f) => s + f.responses, 0);
  const totalSent = forms.reduce((s, f) => s + f.sentTo, 0);
  const avgRate = totalSent
    ? Math.round((totalResponses / totalSent) * 100)
    : 0;
  const activeForms = forms.filter((f) => f.status === "Active").length;

  const stats = [
    {
      label: "Total Forms",
      value: forms.length,
      icon: <FileText size={20} className="text-primary" />,
    },
    {
      label: "Active Forms",
      value: activeForms,
      icon: <CheckSquare size={20} className="text-green-600" />,
    },
    {
      label: "Total Responses",
      value: totalResponses,
      icon: <Users size={20} className="text-blue-600" />,
    },
    {
      label: "Avg Response Rate",
      value: `${avgRate}%`,
      icon: <TrendingUp size={20} className="text-orange-500" />,
    },
  ];

  const handleClose = (id: string) => {
    setForms((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "Closed" } : f)),
    );
    toast.success("Form closed");
  };

  const handleDelete = (id: string) => {
    setForms((prev) => prev.filter((f) => f.id !== id));
    toast.success("Form deleted");
  };

  const handleSend = (form: MockForm) => {
    if (form.status === "Closed") {
      toast.error("Cannot send a closed form");
      return;
    }
    toast.success(`Form "${form.name}" sent to ${form.sentTo} recipients`);
  };

  const responseData = responseSheetForm
    ? generateResponseData(responseSheetForm)
    : [];

  return (
    <div className="space-y-6" data-ocid="forms.page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="text-primary" size={24} />
            Digital Forms
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create and manage forms for parents, students, and staff
          </p>
        </div>
        <Button
          onClick={() => {
            window.location.hash = "/admin/forms/builder";
          }}
          data-ocid="forms.create.button"
        >
          <Plus size={16} className="mr-2" /> Create New Form
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="p-2 bg-muted/40 rounded-xl">{s.icon}</div>
            <div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search forms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
            data-ocid="forms.search.input"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36 h-9" data-ocid="forms.status.filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["All", "Active", "Draft", "Closed"].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterTarget} onValueChange={setFilterTarget}>
          <SelectTrigger className="w-36 h-9" data-ocid="forms.target.filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["All", "Parents", "Students", "Staff"].map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Form Name
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Created By
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Target
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Sent To
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Responses
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Rate %
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Created
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((form, i) => (
                <React.Fragment key={form.id}>
                  <tr
                    className="border-b border-border last:border-0 hover:bg-muted/20 cursor-pointer"
                    onClick={() =>
                      setExpandedRow(expandedRow === form.id ? null : form.id)
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      setExpandedRow(expandedRow === form.id ? null : form.id)
                    }
                    tabIndex={0}
                    data-ocid={`forms.row.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <ChevronDown
                          size={14}
                          className={`text-muted-foreground transition-transform ${expandedRow === form.id ? "rotate-180" : ""}`}
                        />
                        {form.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {form.createdBy}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">
                        {form.target}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {form.sentTo}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">
                      {form.responses}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`text-xs font-semibold ${form.responses / form.sentTo >= 0.75 ? "text-green-600" : form.responses / form.sentTo >= 0.5 ? "text-yellow-600" : "text-red-500"}`}
                      >
                        {Math.round((form.responses / form.sentTo) * 100)}%
                      </span>
                    </td>
                    <td className="px-4 py-3">{statusBadge(form.status)}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {new Date(form.createdDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <div className="flex gap-1 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => setResponseSheetForm(form)}
                          data-ocid={`forms.view_responses.${form.id}`}
                        >
                          <Eye size={12} className="mr-1" /> Responses
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => handleSend(form)}
                          data-ocid={`forms.send.${form.id}`}
                        >
                          <Send size={12} className="mr-1" /> Send
                        </Button>
                        {form.status !== "Closed" ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-muted-foreground hover:text-destructive"
                            onClick={() => handleClose(form.id)}
                            data-ocid={`forms.close.${form.id}`}
                          >
                            Close
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-destructive hover:text-destructive"
                            onClick={() => handleDelete(form.id)}
                            data-ocid={`forms.delete.${form.id}`}
                          >
                            <X size={12} className="mr-1" /> Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedRow === form.id && (
                    <tr
                      key={`${form.id}-fields`}
                      className="bg-muted/10 border-b border-border"
                    >
                      <td colSpan={9} className="px-6 py-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">
                          Form Fields ({form.fields.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {form.fields.map((f) => (
                            <div
                              key={f.label}
                              className="flex items-center gap-1.5 bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs"
                            >
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {f.type}
                              </Badge>
                              <span className="font-medium text-foreground">
                                {f.label}
                              </span>
                              {f.required && (
                                <span className="text-red-500 text-[10px] font-bold">
                                  *
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="forms.empty_state"
            >
              No forms match your filters.
            </div>
          )}
        </div>
      </div>

      {/* Response Tracker Sheet */}
      <Sheet
        open={!!responseSheetForm}
        onOpenChange={(o) => !o && setResponseSheetForm(null)}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl overflow-y-auto"
          data-ocid="forms.responses.sheet"
        >
          <SheetHeader>
            <SheetTitle>{responseSheetForm?.name} — Responses</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            <div className="flex gap-2 text-sm text-muted-foreground">
              <span>{responseSheetForm?.responses} responded</span>
              <span>·</span>
              <span>
                {(responseSheetForm?.sentTo ?? 0) -
                  (responseSheetForm?.responses ?? 0)}{" "}
                pending
              </span>
            </div>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground">
                      Role
                    </th>
                    <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground">
                      Class
                    </th>
                    <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground">
                      Responded
                    </th>
                    <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {responseData.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-border last:border-0 hover:bg-muted/10"
                    >
                      <td className="px-3 py-2.5 font-medium text-foreground">
                        {r.name}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {r.role}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {r.class}
                      </td>
                      <td className="px-3 py-2.5">
                        {r.responded ? (
                          <Badge className="bg-green-500/15 text-green-700 border-green-300 text-[10px]">
                            Yes
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-muted-foreground text-[10px]"
                          >
                            No
                          </Badge>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {r.responseDate}
                      </td>
                      <td className="px-3 py-2.5">
                        {r.responded && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-[10px] px-2"
                            onClick={() =>
                              setViewResponseRecipient({
                                name: r.name,
                                fieldValues: r.fieldValues,
                              })
                            }
                            data-ocid={`forms.view_response.${r.id}`}
                          >
                            View
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Individual Response Dialog */}
      <Dialog
        open={!!viewResponseRecipient}
        onOpenChange={(o) => !o && setViewResponseRecipient(null)}
      >
        <DialogContent
          className="max-w-md"
          data-ocid="forms.response_detail.dialog"
        >
          <DialogHeader>
            <DialogTitle>Response — {viewResponseRecipient?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {viewResponseRecipient?.fieldValues.map((fv) => (
              <div key={fv.label} className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {fv.label}
                </p>
                <p className="text-sm text-foreground bg-muted/30 rounded-lg px-3 py-2">
                  {fv.value || "—"}
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
