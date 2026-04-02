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
import { Bell, Plus, Settings, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DEFAULT_CATEGORIES = [
  "Event",
  "Meeting",
  "Holiday",
  "Fee",
  "Exam",
  "General",
  "Exam Notice",
  "Fee Reminder",
  "Holiday Announcement",
];

const initialNotices = [
  {
    id: 1,
    title: "Annual Sports Day",
    body: "Annual Sports Day will be held on December 15, 2024. All students are required to participate.",
    date: "2024-11-28",
    type: "Event",
    author: "Principal",
  },
  {
    id: 2,
    title: "Parent-Teacher Meeting",
    body: "PTM scheduled for December 10, 2024 from 9 AM to 1 PM. Parents are requested to attend.",
    date: "2024-11-26",
    type: "Meeting",
    author: "Admin",
  },
  {
    id: 3,
    title: "Winter Vacation Notice",
    body: "School will remain closed from December 25, 2024 to January 5, 2025 for winter vacation.",
    date: "2024-11-20",
    type: "Holiday",
    author: "Admin",
  },
  {
    id: 4,
    title: "Fee Submission Deadline",
    body: "Last date for fee submission is December 31, 2024. Late fee ₹50/day after deadline.",
    date: "2024-11-18",
    type: "Fee Reminder",
    author: "Accountant",
  },
  {
    id: 5,
    title: "Exam Schedule Released",
    body: "Half-yearly exam schedule has been released. Check the exam section for details.",
    date: "2024-11-15",
    type: "Exam Notice",
    author: "Principal",
  },
];

export function NoticesPage() {
  const [notices, setNotices] = useState(initialNotices);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [addOpen, setAddOpen] = useState(false);
  const [manageCatOpen, setManageCatOpen] = useState(false);
  const [newCatInput, setNewCatInput] = useState("");
  const [form, setForm] = useState({
    title: "",
    body: "",
    type: "General",
    author: "",
  });
  const [deleteNotice, setDeleteNotice] = useState<
    (typeof initialNotices)[0] | null
  >(null);

  const handlePostSubmit = () => {
    if (!form.title || !form.body || !form.author) {
      toast.error("Please fill all required fields");
      return;
    }
    const newNotice = {
      id: Date.now(),
      title: form.title,
      body: form.body,
      type: form.type,
      author: form.author,
      date: new Date().toISOString().split("T")[0],
    };
    setNotices((prev) => [newNotice, ...prev]);
    toast.success("Notice posted");
    setAddOpen(false);
    setForm({
      title: "",
      body: "",
      type: categories[0] || "General",
      author: "",
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteNotice) return;
    setNotices((prev) => prev.filter((x) => x.id !== deleteNotice.id));
    toast.success("Notice deleted");
    setDeleteNotice(null);
  };

  const addCategory = () => {
    const trimmed = newCatInput.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      toast.error("Category already exists");
      return;
    }
    setCategories((prev) => [...prev, trimmed]);
    setNewCatInput("");
    toast.success(`Category "${trimmed}" added`);
  };

  const removeCategory = (cat: string) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
  };

  return (
    <div className="space-y-5" data-ocid="notices.page">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Notices</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setManageCatOpen(true)}
            data-ocid="notices.manage_categories.button"
          >
            <Settings size={15} className="mr-1" /> Manage Categories
          </Button>
          <Button
            onClick={() => setAddOpen(true)}
            data-ocid="notices.add.button"
          >
            <Plus size={16} className="mr-1" /> Post Notice
          </Button>
        </div>
      </div>
      <div className="space-y-3" data-ocid="notices.list">
        {notices.map((n, i) => (
          <div
            key={n.id}
            className="bg-card border border-border rounded-2xl p-5"
            data-ocid={`notices.item.${i + 1}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary mt-0.5">
                  <Bell size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {n.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{n.body}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {n.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {n.date}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      by {n.author}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeleteNotice(n)}
                className="p-1.5 hover:bg-destructive/10 rounded-lg"
                data-ocid={`notices.delete_button.${i + 1}`}
              >
                <Trash2 size={14} className="text-destructive" />
              </button>
            </div>
          </div>
        ))}
        {notices.length === 0 && (
          <div
            className="text-center py-10 text-muted-foreground"
            data-ocid="notices.empty_state"
          >
            No notices yet.
          </div>
        )}
      </div>

      {/* Post Notice Dialog */}
      <Dialog
        open={addOpen}
        onOpenChange={(open) => {
          setAddOpen(open);
          if (!open)
            setForm({
              title: "",
              body: "",
              type: categories[0] || "General",
              author: "",
            });
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Post New Notice</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Title *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Notice title"
                data-ocid="notices.add.title.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Message *</Label>
              <Textarea
                value={form.body}
                onChange={(e) =>
                  setForm((p) => ({ ...p, body: e.target.value }))
                }
                placeholder="Write the notice content here..."
                rows={4}
                data-ocid="notices.add.body.textarea"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Category</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}
                >
                  <SelectTrigger data-ocid="notices.add.type.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Author *</Label>
                <Input
                  value={form.author}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, author: e.target.value }))
                  }
                  placeholder="e.g. Principal"
                  data-ocid="notices.add.author.input"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              data-ocid="notices.add.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePostSubmit}
              data-ocid="notices.add.submit_button"
            >
              Post Notice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Categories Dialog */}
      <Dialog open={manageCatOpen} onOpenChange={setManageCatOpen}>
        <DialogContent
          className="max-w-md"
          data-ocid="notices.categories.dialog"
        >
          <DialogHeader>
            <DialogTitle>Manage Notice Categories</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newCatInput}
                onChange={(e) => setNewCatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCategory()}
                placeholder="New category name"
                data-ocid="notices.categories.input"
              />
              <Button
                onClick={addCategory}
                data-ocid="notices.categories.add_button"
              >
                <Plus size={14} className="mr-1" /> Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full text-sm"
                >
                  {cat}
                  <button
                    type="button"
                    onClick={() => removeCategory(cat)}
                    className="text-muted-foreground hover:text-destructive"
                    data-ocid="notices.categories.delete_button"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setManageCatOpen(false)}
              data-ocid="notices.categories.close_button"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteNotice}
        onOpenChange={(open) => !open && setDeleteNotice(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Notice</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete the notice{" "}
            <span className="font-semibold text-foreground">
              "{deleteNotice?.title}"
            </span>
            ?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteNotice(null)}
              data-ocid="notices.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              data-ocid="notices.delete.confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
