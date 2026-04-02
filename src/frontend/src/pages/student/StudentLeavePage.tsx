import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { mockLeaveApplications, mockLeaveBalances } from "@/data/mockLeaves";
import type { LeaveApplication } from "@/data/mockLeaves";
import { Send } from "lucide-react";
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

export function StudentLeavePage() {
  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  const myLeaves = mockLeaveApplications.filter(
    (l) => l.applicantRole === "student",
  );
  const balance = mockLeaveBalances.find(
    (b) => b.applicantId === "student",
  ) || {
    casual: 10,
    medical: 5,
    emergency: 3,
    usedCasual: 1,
    usedMedical: 0,
    usedEmergency: 0,
  };

  const submitLeave = () => {
    if (!leaveType || !fromDate || !toDate || !reason.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success("Leave application submitted successfully");
    setLeaveType("");
    setFromDate("");
    setToDate("");
    setReason("");
  };

  return (
    <div className="space-y-6" data-ocid="student.leave.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Leave Management</h1>
        <p className="text-muted-foreground text-sm">
          Apply for leave and track your leave history
        </p>
      </div>

      {/* Leave Balance */}
      <div className="grid grid-cols-3 gap-4">
        <Card data-ocid="student.leave.casual.card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Casual Leave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {balance.casual - balance.usedCasual}
              <span className="text-sm text-muted-foreground">
                /{balance.casual}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">remaining</p>
          </CardContent>
        </Card>
        <Card data-ocid="student.leave.medical.card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Medical Leave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {balance.medical - balance.usedMedical}
              <span className="text-sm text-muted-foreground">
                /{balance.medical}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">remaining</p>
          </CardContent>
        </Card>
        <Card data-ocid="student.leave.emergency.card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Emergency Leave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {balance.emergency - balance.usedEmergency}
              <span className="text-sm text-muted-foreground">
                /{balance.emergency}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">remaining</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Apply Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Apply for Leave</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Leave Type</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger data-ocid="student.leave.type.select">
                  <SelectValue placeholder="Select leave type" />
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
                  data-ocid="student.leave.from.input"
                />
              </div>
              <div>
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  data-ocid="student.leave.to.input"
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
                data-ocid="student.leave.reason.textarea"
              />
            </div>
            <Button
              className="w-full"
              onClick={submitLeave}
              data-ocid="student.leave.submit_button"
            >
              <Send size={15} className="mr-2" /> Submit Application
            </Button>
          </CardContent>
        </Card>

        {/* Leave History */}
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground">My Leave History</h2>
          {myLeaves.length === 0 && (
            <div
              className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground"
              data-ocid="student.leave.history.empty_state"
            >
              No leave applications yet
            </div>
          )}
          {myLeaves.map((l, i) => (
            <div
              key={l.id}
              data-ocid={`student.leave.history.item.${i + 1}`}
              className="bg-card border border-border rounded-xl p-4 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    {l.leaveType} Leave
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {l.fromDate} → {l.toDate} · {l.days} day(s)
                  </p>
                </div>
                {statusBadge(l.status)}
              </div>
              <p className="text-sm text-muted-foreground">{l.reason}</p>
              {l.approvedBy && (
                <p className="text-xs text-green-600">
                  Approved by {l.approvedBy}
                </p>
              )}
              {l.rejectionReason && (
                <p className="text-xs text-red-500">
                  Rejected: {l.rejectionReason}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
