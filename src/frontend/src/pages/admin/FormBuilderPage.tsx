import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { CLASSES, SECTIONS } from "@/data/classConfig";
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  FileText,
  Hash,
  List,
  Plus,
  Send,
  Trash2,
  Type,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type FieldType =
  | "text"
  | "textarea"
  | "checkbox"
  | "dropdown"
  | "date"
  | "number";

interface FormFieldDef {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string;
}

const FIELD_TYPES: { type: FieldType; label: string; icon: React.ReactNode }[] =
  [
    { type: "text", label: "Text Input", icon: <Type size={14} /> },
    { type: "textarea", label: "Textarea", icon: <FileText size={14} /> },
    { type: "checkbox", label: "Checkbox", icon: <CheckSquare size={14} /> },
    { type: "dropdown", label: "Dropdown", icon: <List size={14} /> },
    { type: "date", label: "Date", icon: <CalendarDays size={14} /> },
    { type: "number", label: "Number", icon: <Hash size={14} /> },
  ];

function fieldTypeIcon(type: FieldType) {
  return FIELD_TYPES.find((f) => f.type === type)?.icon ?? <Type size={14} />;
}

function FieldBadge({ type }: { type: FieldType }) {
  const colors: Record<FieldType, string> = {
    text: "bg-blue-100 text-blue-700",
    textarea: "bg-purple-100 text-purple-700",
    checkbox: "bg-green-100 text-green-700",
    dropdown: "bg-orange-100 text-orange-700",
    date: "bg-pink-100 text-pink-700",
    number: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${colors[type]}`}
    >
      {fieldTypeIcon(type)} {type}
    </span>
  );
}

function PreviewField({ field }: { field: FormFieldDef }) {
  const options =
    field.options
      ?.split(",")
      .map((o) => o.trim())
      .filter(Boolean) ?? [];
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-foreground">
        {field.label || (
          <span className="text-muted-foreground italic">Untitled field</span>
        )}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </p>
      {field.type === "text" && (
        <input
          disabled
          placeholder={field.placeholder || "Text input"}
          className="w-full h-9 px-3 rounded-lg border border-input bg-muted/30 text-sm text-muted-foreground cursor-not-allowed"
        />
      )}
      {field.type === "textarea" && (
        <textarea
          disabled
          placeholder={field.placeholder || "Enter text..."}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-input bg-muted/30 text-sm text-muted-foreground cursor-not-allowed resize-none"
        />
      )}
      {field.type === "checkbox" && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            disabled
            className="w-4 h-4 rounded border border-input cursor-not-allowed"
          />
          <span className="text-sm text-muted-foreground">
            {field.label || "Check this option"}
          </span>
        </div>
      )}
      {field.type === "dropdown" && (
        <select
          disabled
          className="w-full h-9 px-3 rounded-lg border border-input bg-muted/30 text-sm text-muted-foreground cursor-not-allowed"
        >
          <option>Select an option…</option>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      )}
      {field.type === "date" && (
        <input
          type="date"
          disabled
          className="w-full h-9 px-3 rounded-lg border border-input bg-muted/30 text-sm text-muted-foreground cursor-not-allowed"
        />
      )}
      {field.type === "number" && (
        <input
          type="number"
          disabled
          placeholder="0"
          className="w-full h-9 px-3 rounded-lg border border-input bg-muted/30 text-sm text-muted-foreground cursor-not-allowed"
        />
      )}
    </div>
  );
}

export function FormBuilderPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FormFieldDef[]>([]);
  const [showFieldMenu, setShowFieldMenu] = useState(false);
  const [targetAudience, setTargetAudience] = useState<
    "parents" | "students" | "staff" | "class"
  >("parents");
  const [targetClass, setTargetClass] = useState(CLASSES[0]);
  const [targetSection, setTargetSection] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  const audienceCount: Record<string, number> = {
    parents: 162,
    students: 480,
    staff: 32,
    class: 35,
  };

  const addField = (type: FieldType) => {
    const newField: FormFieldDef = {
      id: `f-${Date.now()}`,
      type,
      label: "",
      required: false,
      placeholder: "",
      options: type === "dropdown" ? "Option 1, Option 2, Option 3" : undefined,
    };
    setFields((prev) => [...prev, newField]);
    setShowFieldMenu(false);
  };

  const updateField = (id: string, updates: Partial<FormFieldDef>) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    );
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const moveField = (id: string, dir: "up" | "down") => {
    setFields((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      const swap = dir === "up" ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  };

  const handleSaveDraft = () => {
    if (!title.trim()) {
      toast.error("Please enter a form title");
      return;
    }
    toast.success("Form saved as draft");
  };

  const handleSend = () => {
    if (!title.trim()) {
      toast.error("Form title cannot be empty");
      return;
    }
    if (fields.length === 0) {
      toast.error("Add at least one field to the form");
      return;
    }
    const count =
      targetAudience === "class"
        ? audienceCount.class
        : audienceCount[targetAudience];
    toast.success(`Form sent to ${count} recipients`);
    setTimeout(() => {
      window.location.hash = "/admin/forms";
    }, 800);
  };

  return (
    <div className="space-y-4" data-ocid="form-builder.page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="text-primary" size={24} />
            Form Builder
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Design your form and send it to the right audience
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview((p) => !p)}
            data-ocid="form-builder.preview.toggle"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            data-ocid="form-builder.save_draft.button"
          >
            Save Draft
          </Button>
          <Button onClick={handleSend} data-ocid="form-builder.send.button">
            <Send size={15} className="mr-1.5" /> Send Form
          </Button>
        </div>
      </div>

      <div
        className={`grid gap-6 ${showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 max-w-2xl"}`}
      >
        {/* LEFT: Editor */}
        <div className="space-y-5">
          {/* Form metadata */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-base font-semibold">Form Title *</Label>
              <Input
                placeholder="e.g. Annual Medical Check Consent"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-base"
                data-ocid="form-builder.title.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Form Description</Label>
              <Textarea
                placeholder="Brief description of the form's purpose..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                data-ocid="form-builder.description.textarea"
              />
            </div>
          </div>

          {/* Fields */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-foreground">
                Form Fields ({fields.length})
              </p>
              <div className="relative">
                <Button
                  size="sm"
                  onClick={() => setShowFieldMenu((p) => !p)}
                  data-ocid="form-builder.add_field.button"
                >
                  <Plus size={14} className="mr-1.5" /> Add Field{" "}
                  <ChevronDown size={13} className="ml-1" />
                </Button>
                {showFieldMenu && (
                  <div
                    className="absolute right-0 top-full mt-1 z-30 bg-card border border-border rounded-xl shadow-lg overflow-hidden w-44"
                    data-ocid="form-builder.field_menu"
                  >
                    {FIELD_TYPES.map((ft) => (
                      <button
                        key={ft.type}
                        type="button"
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-muted/50 transition-colors text-foreground"
                        onClick={() => addField(ft.type)}
                        data-ocid={`form-builder.add_field.${ft.type}`}
                      >
                        {ft.icon} {ft.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {fields.length === 0 && (
              <div
                className="text-center py-10 text-muted-foreground border-2 border-dashed border-border rounded-xl"
                data-ocid="form-builder.fields.empty_state"
              >
                <FileText size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No fields added yet</p>
                <p className="text-xs mt-0.5">
                  Click "Add Field" to start building your form
                </p>
              </div>
            )}

            <div className="space-y-3">
              {fields.map((field, i) => (
                <div
                  key={field.id}
                  className="border border-border rounded-xl p-4 space-y-3 bg-background"
                  data-ocid={`form-builder.field.${i + 1}`}
                >
                  {/* Field header */}
                  <div className="flex items-center justify-between gap-2">
                    <FieldBadge type={field.type} />
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveField(field.id, "up")}
                        disabled={i === 0}
                        className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                        aria-label="Move up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveField(field.id, "down")}
                        disabled={i === fields.length - 1}
                        className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                        aria-label="Move down"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeField(field.id)}
                        className="p-1 text-muted-foreground hover:text-destructive"
                        aria-label="Remove field"
                        data-ocid={`form-builder.field.delete.${i + 1}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="space-y-1">
                    <Label className="text-xs">Label *</Label>
                    <Input
                      placeholder="Field label"
                      value={field.label}
                      onChange={(e) =>
                        updateField(field.id, { label: e.target.value })
                      }
                      className="h-8 text-sm"
                      data-ocid={`form-builder.field.label.${i + 1}`}
                    />
                  </div>

                  {/* Placeholder (text/textarea) */}
                  {(field.type === "text" || field.type === "textarea") && (
                    <div className="space-y-1">
                      <Label className="text-xs">Placeholder</Label>
                      <Input
                        placeholder="Hint text shown inside the field"
                        value={field.placeholder}
                        onChange={(e) =>
                          updateField(field.id, { placeholder: e.target.value })
                        }
                        className="h-8 text-sm"
                        data-ocid={`form-builder.field.placeholder.${i + 1}`}
                      />
                    </div>
                  )}

                  {/* Options (dropdown) */}
                  {field.type === "dropdown" && (
                    <div className="space-y-1">
                      <Label className="text-xs">
                        Options (comma-separated)
                      </Label>
                      <Textarea
                        placeholder="Option 1, Option 2, Option 3"
                        value={field.options}
                        onChange={(e) =>
                          updateField(field.id, { options: e.target.value })
                        }
                        rows={2}
                        className="text-sm"
                        data-ocid={`form-builder.field.options.${i + 1}`}
                      />
                    </div>
                  )}

                  {/* Required toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={field.required}
                      onClick={() =>
                        updateField(field.id, { required: !field.required })
                      }
                      className={`w-9 h-5 rounded-full transition-colors relative ${field.required ? "bg-primary" : "bg-muted"}`}
                      data-ocid={`form-builder.field.required.${i + 1}`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${field.required ? "translate-x-4" : "translate-x-0.5"}`}
                      />
                    </button>
                    <span className="text-xs text-muted-foreground">
                      Required
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Audience */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <p className="font-semibold text-foreground">Target Audience</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { val: "parents", label: "All Parents", count: 162 },
                { val: "students", label: "All Students", count: 480 },
                { val: "staff", label: "All Staff", count: 32 },
                { val: "class", label: "By Class", count: null },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() =>
                    setTargetAudience(opt.val as typeof targetAudience)
                  }
                  className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors text-center ${targetAudience === opt.val ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:bg-muted/50"}`}
                  data-ocid={`form-builder.target.${opt.val}`}
                >
                  {opt.label}
                  {opt.count && (
                    <span className="block text-xs opacity-70">
                      {opt.count} recipients
                    </span>
                  )}
                </button>
              ))}
            </div>

            {targetAudience === "class" && (
              <div className="flex gap-3 flex-wrap">
                <div className="space-y-1 flex-1 min-w-32">
                  <Label className="text-xs">Class</Label>
                  <Select value={targetClass} onValueChange={setTargetClass}>
                    <SelectTrigger
                      className="h-9"
                      data-ocid="form-builder.class.select"
                    >
                      <SelectValue />
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
                <div className="space-y-1 flex-1 min-w-32">
                  <Label className="text-xs">Section</Label>
                  <Select
                    value={targetSection}
                    onValueChange={setTargetSection}
                  >
                    <SelectTrigger
                      className="h-9"
                      data-ocid="form-builder.section.select"
                    >
                      <SelectValue placeholder="All sections" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Sections</SelectItem>
                      {(targetClass === "XI" || targetClass === "XII"
                        ? ["Science", "Commerce", "Arts"]
                        : SECTIONS
                      ).map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Preview */}
        {showPreview && (
          <div className="sticky top-4">
            <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText size={15} className="text-primary" />
                </div>
                <p className="font-semibold text-foreground text-sm">
                  Form Preview
                </p>
                <Badge variant="outline" className="text-xs ml-auto">
                  Read-only
                </Badge>
              </div>

              {!title && fields.length === 0 ? (
                <div
                  className="text-center py-10 text-muted-foreground"
                  data-ocid="form-builder.preview.empty"
                >
                  <FileText size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm">
                    Add a title and fields to see the preview
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {title && (
                    <div>
                      <h2 className="text-lg font-bold text-foreground">
                        {title}
                      </h2>
                      {description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {description}
                        </p>
                      )}
                    </div>
                  )}
                  {fields.length > 0 && (
                    <div className="space-y-4">
                      {fields.map((f) => (
                        <PreviewField key={f.id} field={f} />
                      ))}
                    </div>
                  )}
                  {fields.length > 0 && (
                    <button
                      disabled
                      type="submit"
                      className="w-full h-10 rounded-xl bg-primary/30 text-primary-foreground/60 text-sm font-medium cursor-not-allowed"
                    >
                      Submit (Preview only)
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
