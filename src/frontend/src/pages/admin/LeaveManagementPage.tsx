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
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { CLASSES, SECTIONS } from "@/data/classConfig";
import {
  type LeaveApplication,
  mockLeaveApplications,
} from "@/data/mockLeaves";
import { CheckCircle, Download, Search, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const statusBadge = (s: LeaveApplication["status"]) => {
  if (s === "Approved")
    return (
      <Badge className="bg-green-500/15 text-green-600 border-green-200">
        Approved
      </Badge>
    );
  if (s === "Rejected")
    return (
      <Badge className="bg-red-500/15 text-red-600 border-red-200">
        Rejected
      </Badge>
    );
  return (
    <Badge className="bg-yellow-500/15 text-yellow-600 border-yellow-200">
      Pending
    </Badge>
  );
};

const roleBadge = (r: LeaveApplication["applicantRole"]) =>
  r === "student" ? (
    <Badge variant="outline" className="text-blue-600 border-blue-300">
      Student
    </Badge>
  ) : (
    <Badge variant="outline" className="text-purple-600 border-purple-300">
      Staff
    </Badge>
  );

export function LeaveManagementPage() {
  const [leaves, setLeaves] = useState<LeaveApplication[]>(
    mockLeaveApplications,
  );
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterSection, setFilterSection] = useState("all");
  const [rejectDialog, setRejectDialog] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const { user: currentUser } = useAuth();

  const filtered = leaves.filter((l) => {
    const matchSearch = l.applicantName
      .toLowerCase()
      .includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (currentUser?.role === "teacher") {
      return (
        l.applicantRole === "staff" && l.applicantName === currentUser.name
      );
    }
    if (filterClass !== "all" && l.applicantRole === "student") {
      const cls = l.className ?? "";
      if (!cls.startsWith(filterClass)) return false;
      if (filterSection !== "all" && !cls.includes(`-${filterSection}`))
        return false;
    }
    return true;
  });

  const forTab = (tab: string) =>
    tab === "all"
      ? filtered
      : filtered.filter(
          (l) => l.status === tab.charAt(0).toUpperCase() + tab.slice(1),
        );

  const approve = (id: string) => {
    setLeaves((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: "Approved", approvedBy: "Admin" } : l,
      ),
    );
    toast.success("Leave approved successfully");
  };

  const openReject = (id: string) => {
    setRejectTarget(id);
    setRejectReason("");
    setRejectDialog(true);
  };

  const confirmReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    setLeaves((prev) =>
      prev.map((l) =>
        l.id === rejectTarget
          ? { ...l, status: "Rejected", rejectionReason: rejectReason }
          : l,
      ),
    );
    toast.success("Leave rejected");
    setRejectDialog(false);
  };

  const pending = leaves.filter((l) => l.status === "Pending").length;
  const approved = leaves.filter((l) => l.status === "Approved").length;
  const rejected = leaves.filter((l) => l.status === "Rejected").length;

  const LeaveTable = ({ items }: { items: LeaveApplication[] }) => (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Applicant
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Role
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Type
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                From
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                To
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Days
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Reason
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((l, i) => (
              <tr
                key={l.id}
                data-ocid={`leave.item.${i + 1}`}
                className="hover:bg-muted/20"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">
                    {l.applicantName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {l.admissionOrStaffNo}
                    {l.className ? ` · ${l.className}` : ""}
                  </p>
                </td>
                <td className="px-4 py-3">{roleBadge(l.applicantRole)}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{l.leaveType}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {l.fromDate}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{l.toDate}</td>
                <td className="px-4 py-3 text-center font-semibold text-foreground">
                  {l.days}
                </td>
                <td className="px-4 py-3 max-w-[180px]">
                  <p
                    className="text-muted-foreground truncate"
                    title={l.reason}
                  >
                    {l.reason}
                  </p>
                  {l.rejectionReason && (
                    <p className="text-xs text-red-500 mt-0.5">
                      Reason: {l.rejectionReason}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">{statusBadge(l.status)}</td>
                <td className="px-4 py-3">
                  {l.status === "Pending" && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white h-7 px-2"
                        onClick={() => approve(l.id)}
                        data-ocid={`leave.approve.button.${i + 1}`}
                      >
                        <CheckCircle size={13} className="mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 px-2"
                        onClick={() => openReject(l.id)}
                        data-ocid={`leave.reject.button.${i + 1}`}
                      >
                        <XCircle size={13} className="mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-8 text-center text-muted-foreground"
                  data-ocid="leave.empty_state"
                >
                  No leave applications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6" data-ocid="leave.page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Leave Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Review and manage leave applications from students and staff
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => toast.info("Exporting...")}
          data-ocid="leave.export.button"
        >
          <Download size={15} className="mr-2" /> Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{pending}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{approved}</p>
          <p className="text-sm text-muted-foreground">Approved</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{rejected}</p>
          <p className="text-sm text-muted-foreground">Rejected</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative w-full max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            className="pl-9"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="leave.search_input"
          />
        </div>
        <Select
          value={filterClass}
          onValueChange={(v) => {
            setFilterClass(v);
            setFilterSection("all");
          }}
        >
          <SelectTrigger className="w-36" data-ocid="leave.class_filter.select">
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
          value={filterSection}
          onValueChange={setFilterSection}
          disabled={filterClass === "all"}
        >
          <SelectTrigger
            className="w-36"
            data-ocid="leave.section_filter.select"
          >
            <SelectValue placeholder="All Sections" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            {(filterClass === "XI" || filterClass === "XII"
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

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all" data-ocid="leave.all.tab">
            All ({filtered.length})
          </TabsTrigger>
          <TabsTrigger value="pending" data-ocid="leave.pending.tab">
            Pending ({forTab("pending").length})
          </TabsTrigger>
          <TabsTrigger value="approved" data-ocid="leave.approved.tab">
            Approved ({forTab("approved").length})
          </TabsTrigger>
          <TabsTrigger value="rejected" data-ocid="leave.rejected.tab">
            Rejected ({forTab("rejected").length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <LeaveTable items={forTab("all")} />
        </TabsContent>
        <TabsContent value="pending">
          <LeaveTable items={forTab("pending")} />
        </TabsContent>
        <TabsContent value="approved">
          <LeaveTable items={forTab("approved")} />
        </TabsContent>
        <TabsContent value="rejected">
          <LeaveTable items={forTab("rejected")} />
        </TabsContent>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog} onOpenChange={setRejectDialog}>
        <DialogContent data-ocid="leave.reject.dialog">
          <DialogHeader>
            <DialogTitle>Reject Leave Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Reason for rejection</Label>
            <Textarea
              placeholder="Enter reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              data-ocid="leave.reject.textarea"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialog(false)}
              data-ocid="leave.reject.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              data-ocid="leave.reject.confirm_button"
            >
              Reject Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
