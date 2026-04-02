import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  type LeaveApplication,
  mockLeaveApplications,
} from "@/data/mockLeaves";
import { CheckCircle, Send, XCircle } from "lucide-react";
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

export function TeacherLeavePage() {
  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  const studentLeaves = mockLeaveApplications.filter(
    (l) => l.applicantRole === "student" && l.status === "Pending",
  );
  const [leaves, setLeaves] = useState<LeaveApplication[]>(studentLeaves);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const submitLeave = () => {
    if (!leaveType || !fromDate || !toDate || !reason.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success("Leave application submitted");
    setLeaveType("");
    setFromDate("");
    setToDate("");
    setReason("");
  };

  const approve = (id: string) => {
    setLeaves((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: "Approved", approvedBy: "Teacher" } : l,
      ),
    );
    toast.success("Leave approved");
  };

  const openReject = (id: string) => {
    setRejectTarget(id);
    setRejectReason("");
    setRejectDialog(true);
  };

  const confirmReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason");
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

  return (
    <div className="space-y-6" data-ocid="teacher.leave.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Leave Management</h1>
        <p className="text-muted-foreground text-sm">
          Apply for your leave and review student leave requests
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Apply for Leave */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Apply for Leave</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Leave Type</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger data-ocid="teacher.leave.type.select">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Casual">Casual Leave</SelectItem>
                  <SelectItem value="Medical">Medical Leave</SelectItem>
                  <SelectItem value="Emergency">Emergency Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>From Date</Label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  data-ocid="teacher.leave.from.input"
                />
              </div>
              <div>
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  data-ocid="teacher.leave.to.input"
                />
              </div>
            </div>
            <div>
              <Label>Reason</Label>
              <Textarea
                placeholder="Describe the reason for leave..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                data-ocid="teacher.leave.reason.textarea"
              />
            </div>
            <Button
              className="w-full"
              onClick={submitLeave}
              data-ocid="teacher.leave.submit_button"
            >
              <Send size={15} className="mr-2" /> Submit Application
            </Button>
          </CardContent>
        </Card>

        {/* Student Leave Requests */}
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground">
            Student Leave Requests
          </h2>
          {leaves.length === 0 && (
            <div
              className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground"
              data-ocid="teacher.student_leave.empty_state"
            >
              No pending student leave requests
            </div>
          )}
          {leaves.map((l, i) => (
            <div
              key={l.id}
              data-ocid={`teacher.student_leave.item.${i + 1}`}
              className="bg-card border border-border rounded-xl p-4 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    {l.applicantName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {l.className} · {l.admissionOrStaffNo}
                  </p>
                </div>
                {statusBadge(l.status)}
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>
                  <Badge variant="outline" className="mr-1 text-xs">
                    {l.leaveType}
                  </Badge>
                </span>
                <span>
                  {l.fromDate} → {l.toDate} ({l.days}d)
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{l.reason}</p>
              {l.status === "Pending" && (
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => approve(l.id)}
                    data-ocid={`teacher.student_leave.approve.button.${i + 1}`}
                  >
                    <CheckCircle size={13} className="mr-1" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => openReject(l.id)}
                    data-ocid={`teacher.student_leave.reject.button.${i + 1}`}
                  >
                    <XCircle size={13} className="mr-1" /> Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={rejectDialog} onOpenChange={setRejectDialog}>
        <DialogContent data-ocid="teacher.leave.reject.dialog">
          <DialogHeader>
            <DialogTitle>Reject Leave</DialogTitle>
          </DialogHeader>
          <div>
            <Label>Reason for rejection</Label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason..."
              rows={3}
              data-ocid="teacher.leave.reject.textarea"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialog(false)}
              data-ocid="teacher.leave.reject.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              data-ocid="teacher.leave.reject.confirm_button"
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
