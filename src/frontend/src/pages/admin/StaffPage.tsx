import { ExportButtons } from "@/components/ExportButtons";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { type Staff, mockStaff } from "@/data/mockStaff";
import { useLoadingData } from "@/hooks/useLoadingData";
import {
  Archive,
  Edit,
  LayoutGrid,
  LayoutList,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  navigate?: (path: string) => void;
}

interface StaffWithArchive extends Staff {
  archived?: boolean;
  archiveType?: "Retirement" | "Transfer" | "Resignation";
  archiveDate?: string;
  archiveDestination?: string;
  archiveRemarks?: string;
}

export function StaffPage({ navigate }: Props) {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "table">("list");
  const { loading } = useLoadingData(null);

  const [staff, setStaff] = useState<StaffWithArchive[]>(
    mockStaff.map((s) => ({ ...s, archived: false })),
  );
  const [editStaff, setEditStaff] = useState<StaffWithArchive | null>(null);
  const [deleteStaff, setDeleteStaff] = useState<StaffWithArchive | null>(null);
  const [archiveStaff, setArchiveStaff] = useState<StaffWithArchive | null>(
    null,
  );
  const [editForm, setEditForm] = useState<Partial<Staff>>({});

  const [archiveType, setArchiveType] = useState<
    "Retirement" | "Transfer" | "Resignation"
  >("Retirement");
  const [archiveDate, setArchiveDate] = useState("");
  const [archiveDest, setArchiveDest] = useState("");
  const [archiveRemarks, setArchiveRemarks] = useState("");

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
        <Skeleton className="h-9 w-full" />
        {["sk0", "sk1", "sk2", "sk3", "sk4", "sk5"].map((k) => (
          <Skeleton key={k} className="h-16 rounded-2xl" />
        ))}
      </div>
    );
  }

  const visibleStaff = showAll ? staff : staff.filter((s) => !s.archived);
  const filtered = visibleStaff.filter(
    (s) =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.staffId.toLowerCase().includes(search.toLowerCase()) ||
      (s.subject || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.mobile || "").includes(search),
  );

  const handleEditOpen = (s: StaffWithArchive) => {
    setEditStaff(s);
    setEditForm({ ...s });
  };

  const handleEditSave = () => {
    if (!editStaff) return;
    setStaff((prev) =>
      prev.map((s) =>
        s.id === editStaff.id ? ({ ...s, ...editForm } as StaffWithArchive) : s,
      ),
    );
    toast.success("Staff updated");
    setEditStaff(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteStaff) return;
    setStaff((prev) => prev.filter((s) => s.id !== deleteStaff.id));
    toast.success("Staff member deleted");
    setDeleteStaff(null);
  };

  const handleArchiveSubmit = () => {
    if (!archiveStaff || !archiveDate) {
      toast.error("Please fill all required fields");
      return;
    }
    setStaff((prev) =>
      prev.map((s) =>
        s.id === archiveStaff.id
          ? {
              ...s,
              archived: true,
              status: "Inactive" as const,
              archiveType,
              archiveDate,
              archiveDestination: archiveDest,
              archiveRemarks,
            }
          : s,
      ),
    );
    toast.success(`${archiveStaff.name} marked as ${archiveType}`);
    setArchiveStaff(null);
    setArchiveDate("");
    setArchiveDest("");
    setArchiveRemarks("");
    setArchiveType("Retirement");
  };

  const exportData = filtered.map((s) => ({
    Name: s.name,
    "Staff ID": s.staffId,
    Designation: s.designation,
    Department: s.department,
    Subject: s.subject ?? "",
    Mobile: s.mobile,
    Status: s.status,
  }));

  return (
    <div className="space-y-5" data-ocid="staff.page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff</h1>
          <p className="text-muted-foreground text-sm">
            {filtered.length} staff members
          </p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <ExportButtons title="Staff_Report" data={exportData} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? "Active Only" : "Show All"}
          </Button>
          {/* View mode toggle */}
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="rounded-none h-9 w-9"
              onClick={() => setViewMode("list")}
              data-ocid="staff.view_list.toggle"
              title="List View"
            >
              <LayoutList size={16} />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="icon"
              className="rounded-none h-9 w-9"
              onClick={() => setViewMode("table")}
              data-ocid="staff.view_table.toggle"
              title="Table View"
            >
              <LayoutGrid size={16} />
            </Button>
          </div>
          <Button
            data-ocid="staff.add.button"
            onClick={() => navigate?.("/admin/staff/add")}
          >
            <Plus size={16} className="mr-1" /> Add Staff
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          className="pl-9"
          placeholder="Search by name, ID, subject, or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-ocid="staff.search_input"
        />
      </div>

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-2" data-ocid="staff.list">
          {filtered.map((s, i) => (
            <div
              key={s.staffId}
              data-ocid={`staff.item.${i + 1}`}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border rounded-2xl px-5 py-3 ${
                s.archived ? "border-border opacity-60" : "border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {s.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.staffId} · {s.designation}
                    {s.subject ? ` · ${s.subject}` : ""}
                  </p>
                  {s.archived && (
                    <p className="text-xs text-muted-foreground">
                      {s.archiveType} · {s.archiveDate}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={s.status === "Active" ? "secondary" : "outline"}
                  className="text-xs"
                >
                  {s.archived ? "ARCHIVED" : s.status}
                </Badge>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditOpen(s)}
                    data-ocid={`staff.edit_button.${i + 1}`}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-amber-500 hover:text-amber-600"
                    onClick={() => setArchiveStaff(s)}
                    disabled={s.archived}
                    data-ocid={`staff.archive_button.${i + 1}`}
                  >
                    <Archive size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleteStaff(s)}
                    data-ocid={`staff.delete_button.${i + 1}`}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div
              className="text-center py-10 text-muted-foreground"
              data-ocid="staff.empty_state"
            >
              No staff found.
            </div>
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div
          className="rounded-xl border overflow-hidden"
          data-ocid="staff.table"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Staff ID</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground py-10"
                    data-ocid="staff.empty_state"
                  >
                    No staff found.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((s, i) => (
                <TableRow
                  key={s.staffId}
                  data-ocid={`staff.item.${i + 1}`}
                  className={s.archived ? "opacity-60" : ""}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {s.name.charAt(0)}
                      </div>
                      <span className="font-medium">{s.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {s.staffId}
                  </TableCell>
                  <TableCell className="text-sm">{s.designation}</TableCell>
                  <TableCell className="text-sm">{s.department}</TableCell>
                  <TableCell className="text-sm">{s.subject ?? "—"}</TableCell>
                  <TableCell className="text-sm">{s.mobile}</TableCell>
                  <TableCell>
                    <Badge
                      variant={s.status === "Active" ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {s.archived ? "ARCHIVED" : s.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditOpen(s)}
                        data-ocid={`staff.edit_button.${i + 1}`}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-amber-500 hover:text-amber-600"
                        onClick={() => setArchiveStaff(s)}
                        disabled={s.archived}
                        data-ocid={`staff.archive_button.${i + 1}`}
                      >
                        <Archive size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteStaff(s)}
                        data-ocid={`staff.delete_button.${i + 1}`}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog
        open={!!editStaff}
        onOpenChange={(open) => !open && setEditStaff(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>
          {editStaff && (
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  ["name", "Name"],
                  ["designation", "Designation"],
                  ["department", "Department"],
                  ["subject", "Subject"],
                  ["mobile", "Mobile"],
                  ["email", "Email"],
                  ["qualification", "Qualification"],
                  ["experience", "Experience"],
                ] as [keyof Staff, string][]
              ).map(([field, label]) => (
                <div key={field} className="space-y-1">
                  <Label className="text-xs">{label}</Label>
                  <Input
                    value={(editForm[field] as string) ?? ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                    className="h-8 text-sm"
                    data-ocid={`staff.edit.${field}.input`}
                  />
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditStaff(null)}
              data-ocid="staff.edit.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={handleEditSave} data-ocid="staff.edit.save_button">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Dialog */}
      <Dialog
        open={!!archiveStaff}
        onOpenChange={(open) => !open && setArchiveStaff(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Archive Staff — {archiveStaff?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Event Type *</Label>
              <select
                value={archiveType}
                onChange={(e) =>
                  setArchiveType(
                    e.target.value as "Retirement" | "Transfer" | "Resignation",
                  )
                }
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                data-ocid="staff.archive.type.select"
              >
                <option value="Retirement">Retirement</option>
                <option value="Transfer">Transfer</option>
                <option value="Resignation">Resignation</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Effective Date *</Label>
              <Input
                type="date"
                value={archiveDate}
                onChange={(e) => setArchiveDate(e.target.value)}
                data-ocid="staff.archive.date.input"
              />
            </div>
            {archiveType === "Transfer" && (
              <div className="space-y-1.5">
                <Label>Destination School</Label>
                <Input
                  value={archiveDest}
                  onChange={(e) => setArchiveDest(e.target.value)}
                  placeholder="School name / location"
                  data-ocid="staff.archive.destination.input"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Remarks</Label>
              <Textarea
                value={archiveRemarks}
                onChange={(e) => setArchiveRemarks(e.target.value)}
                rows={3}
                placeholder="Any additional notes..."
                data-ocid="staff.archive.remarks.textarea"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setArchiveStaff(null)}
              data-ocid="staff.archive.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleArchiveSubmit}
              data-ocid="staff.archive.confirm_button"
            >
              Archive Staff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={!!deleteStaff}
        onOpenChange={(open) => !open && setDeleteStaff(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Staff Member</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {deleteStaff?.name}
            </span>
            ? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteStaff(null)}
              data-ocid="staff.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              data-ocid="staff.delete.confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
