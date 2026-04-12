import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Phone,
  Send,
  Users,
} from "lucide-react";
import React from "react";
import { useState } from "react";
import { toast } from "sonner";

interface AbsenceRecord {
  id: string;
  student: string;
  studentId: string;
  className: string;
  parentName: string;
  parentMobile: string;
  date: string;
  absenceType: "Unexplained" | "Explained" | "Medical";
  alertSent: boolean;
  alertTime: string;
  reply: string;
  status: "Pending Reply" | "Explained" | "Escalated";
}

const initialAbsences: AbsenceRecord[] = [
  {
    id: "a1",
    student: "Arjun Sharma",
    studentId: "s001",
    className: "VII-A",
    parentName: "Ramesh Sharma",
    parentMobile: "9876543210",
    date: "2026-10-12",
    absenceType: "Unexplained",
    alertSent: true,
    alertTime: "08:05 AM",
    reply: "He has fever, will submit medical certificate tomorrow.",
    status: "Explained",
  },
  {
    id: "a2",
    student: "Priya Singh",
    studentId: "s002",
    className: "VI-B",
    parentName: "Vikram Singh",
    parentMobile: "9876543211",
    date: "2026-10-12",
    absenceType: "Unexplained",
    alertSent: true,
    alertTime: "08:05 AM",
    reply: "",
    status: "Pending Reply",
  },
  {
    id: "a3",
    student: "Rohan Mehta",
    studentId: "s003",
    className: "IX-C",
    parentName: "Suresh Mehta",
    parentMobile: "9876543212",
    date: "2026-10-12",
    absenceType: "Medical",
    alertSent: true,
    alertTime: "08:05 AM",
    reply: "Admitted to hospital, will share documents.",
    status: "Explained",
  },
  {
    id: "a4",
    student: "Kavya Patel",
    studentId: "s004",
    className: "VIII-B",
    parentName: "Dilip Patel",
    parentMobile: "9876543213",
    date: "2026-10-12",
    absenceType: "Unexplained",
    alertSent: false,
    alertTime: "",
    reply: "",
    status: "Pending Reply",
  },
  {
    id: "a5",
    student: "Aditya Kumar",
    studentId: "s005",
    className: "X-A",
    parentName: "Rajesh Kumar",
    parentMobile: "9876543214",
    date: "2026-10-12",
    absenceType: "Unexplained",
    alertSent: false,
    alertTime: "",
    reply: "",
    status: "Pending Reply",
  },
  {
    id: "a6",
    student: "Sneha Joshi",
    studentId: "s006",
    className: "XI-Science",
    parentName: "Prakash Joshi",
    parentMobile: "9876543215",
    date: "2026-10-11",
    absenceType: "Unexplained",
    alertSent: true,
    alertTime: "08:10 AM",
    reply: "",
    status: "Escalated",
  },
  {
    id: "a7",
    student: "Rahul Verma",
    studentId: "s007",
    className: "VII-B",
    parentName: "Mohan Verma",
    parentMobile: "9876543216",
    date: "2026-10-11",
    absenceType: "Unexplained",
    alertSent: true,
    alertTime: "08:10 AM",
    reply: "Family emergency, will be back tomorrow.",
    status: "Explained",
  },
  {
    id: "a8",
    student: "Ananya Nair",
    studentId: "s008",
    className: "VIII-A",
    parentName: "Sajan Nair",
    parentMobile: "9876543217",
    date: "2026-10-11",
    absenceType: "Unexplained",
    alertSent: false,
    alertTime: "",
    reply: "",
    status: "Pending Reply",
  },
  {
    id: "a9",
    student: "Nikhil Das",
    studentId: "s009",
    className: "VI-C",
    parentName: "Biplab Das",
    parentMobile: "9876543218",
    date: "2026-10-10",
    absenceType: "Medical",
    alertSent: true,
    alertTime: "08:15 AM",
    reply: "Doctor's certificate submitted at reception.",
    status: "Explained",
  },
  {
    id: "a10",
    student: "Pooja Reddy",
    studentId: "s010",
    className: "IX-A",
    parentName: "Venkat Reddy",
    parentMobile: "9876543219",
    date: "2026-10-10",
    absenceType: "Unexplained",
    alertSent: true,
    alertTime: "08:15 AM",
    reply: "",
    status: "Escalated",
  },
];

function statusBadge(status: AbsenceRecord["status"]) {
  if (status === "Explained")
    return (
      <Badge className="bg-green-500/15 text-green-700 border-green-300">
        Explained
      </Badge>
    );
  if (status === "Escalated")
    return (
      <Badge className="bg-red-500/15 text-red-700 border-red-300">
        Escalated
      </Badge>
    );
  return (
    <Badge className="bg-yellow-500/15 text-yellow-700 border-yellow-300">
      Pending Reply
    </Badge>
  );
}

function absenceTypeBadge(type: string) {
  if (type === "Medical")
    return (
      <Badge
        variant="outline"
        className="text-blue-600 border-blue-300 text-xs"
      >
        Medical
      </Badge>
    );
  if (type === "Explained")
    return (
      <Badge
        variant="outline"
        className="text-green-600 border-green-300 text-xs"
      >
        Explained
      </Badge>
    );
  return (
    <Badge
      variant="outline"
      className="text-orange-600 border-orange-300 text-xs"
    >
      Unexplained
    </Badge>
  );
}

const ALERT_MESSAGE_TEMPLATE = (student: string, parentName: string) =>
  `Dear ${parentName}, your child ${student} was absent from school today without a prior explanation. Kindly reply with the reason for absence or contact the school office. — SmartSkale School`;

export function AbsenceWorkflowPage() {
  const [absences, setAbsences] = useState<AbsenceRecord[]>(initialAbsences);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const unexplainedToday = absences.filter(
    (a) => a.date === "2026-10-12" && a.absenceType === "Unexplained",
  ).length;
  const alertsSent = absences.filter((a) => a.alertSent).length;
  const repliesReceived = absences.filter((a) => a.reply).length;
  const pendingFollowUp = absences.filter(
    (a) => a.status === "Pending Reply",
  ).length;

  const stats = [
    {
      label: "Unexplained Today",
      value: unexplainedToday,
      icon: <AlertTriangle size={20} className="text-orange-500" />,
      color: "text-orange-500",
    },
    {
      label: "SMS/Email Sent",
      value: alertsSent,
      icon: <Send size={20} className="text-blue-600" />,
      color: "text-blue-600",
    },
    {
      label: "Replies Received",
      value: repliesReceived,
      icon: <MessageSquare size={20} className="text-green-600" />,
      color: "text-green-600",
    },
    {
      label: "Pending Follow-up",
      value: pendingFollowUp,
      icon: <Bell size={20} className="text-yellow-600" />,
      color: "text-yellow-600",
    },
  ];

  const pendingAlerts = absences.filter((a) => !a.alertSent);

  const sendAlert = (id: string) => {
    const record = absences.find((a) => a.id === id);
    if (!record) return;
    const now = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setAbsences((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, alertSent: true, alertTime: now } : a,
      ),
    );
    toast.success(
      `SMS & Email sent to ${record.parentName} (${record.parentMobile})`,
    );
  };

  const sendAllPending = () => {
    if (pendingAlerts.length === 0) {
      toast.info("No pending alerts to send");
      return;
    }
    const now = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setAbsences((prev) =>
      prev.map((a) =>
        a.alertSent ? a : { ...a, alertSent: true, alertTime: now },
      ),
    );
    toast.success(`${pendingAlerts.length} absence alerts sent`);
  };

  const markAsExplained = (id: string) => {
    setAbsences((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, absenceType: "Explained", status: "Explained" }
          : a,
      ),
    );
    toast.success("Marked as Explained");
  };

  const escalate = (id: string) => {
    setAbsences((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Escalated" } : a)),
    );
    toast.warning("Absence escalated to admin");
  };

  return (
    <div className="space-y-6" data-ocid="absence-workflow.page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="text-primary" size={24} />
            Absence Communication Workflow
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Automatically notify parents for unexplained absences and track
            responses
          </p>
        </div>
        <Button
          onClick={sendAllPending}
          disabled={pendingAlerts.length === 0}
          data-ocid="absence-workflow.send_all.button"
        >
          <Send size={15} className="mr-2" />
          Send All Pending
          {pendingAlerts.length > 0 && (
            <span className="ml-1.5 bg-primary-foreground/20 text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
              {pendingAlerts.length}
            </span>
          )}
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
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground leading-tight">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-6" />
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Student
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Class
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Type
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Alert Sent
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Parent Reply
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {absences.map((abs, i) => (
                <React.Fragment key={abs.id}>
                  <tr
                    className="border-b border-border last:border-0 hover:bg-muted/20 cursor-pointer"
                    onClick={() =>
                      setExpandedRow(expandedRow === abs.id ? null : abs.id)
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      setExpandedRow(expandedRow === abs.id ? null : abs.id)
                    }
                    tabIndex={0}
                    data-ocid={`absence-workflow.row.${i + 1}`}
                  >
                    <td className="px-4 py-3 text-muted-foreground">
                      {expandedRow === abs.id ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">
                        {abs.student}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {abs.parentName}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {abs.className}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {new Date(abs.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {absenceTypeBadge(abs.absenceType)}
                    </td>
                    <td className="px-4 py-3">
                      {abs.alertSent ? (
                        <div className="flex items-center gap-1.5">
                          <CheckCircle size={14} className="text-green-600" />
                          <span className="text-xs text-green-700 font-medium">
                            {abs.alertTime}
                          </span>
                        </div>
                      ) : (
                        <div
                          className="flex items-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => sendAlert(abs.id)}
                            data-ocid={`absence-workflow.send_alert.${abs.id}`}
                          >
                            <Send size={11} className="mr-1" /> Send Alert
                          </Button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {abs.reply ? (
                        <span className="text-xs text-green-700 flex items-center gap-1">
                          <MessageSquare size={12} /> Reply received
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          No reply
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">{statusBadge(abs.status)}</td>
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <div className="flex gap-1 flex-wrap">
                        {abs.status !== "Explained" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs text-green-700 border-green-300 hover:bg-green-50"
                            onClick={() => markAsExplained(abs.id)}
                            data-ocid={`absence-workflow.explain.${abs.id}`}
                          >
                            Mark Explained
                          </Button>
                        )}
                        {abs.status !== "Escalated" &&
                          abs.status !== "Explained" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => escalate(abs.id)}
                              data-ocid={`absence-workflow.escalate.${abs.id}`}
                            >
                              Escalate
                            </Button>
                          )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => {
                            const msg = encodeURIComponent(
                              ALERT_MESSAGE_TEMPLATE(
                                abs.student,
                                abs.parentName,
                              ),
                            );
                            window.open(
                              `https://wa.me/91${abs.parentMobile}?text=${msg}`,
                              "_blank",
                            );
                          }}
                          data-ocid={`absence-workflow.whatsapp.${abs.id}`}
                          aria-label="Send WhatsApp"
                        >
                          <Phone size={12} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {expandedRow === abs.id && (
                    <tr
                      key={`${abs.id}-expanded`}
                      className="bg-muted/10 border-b border-border"
                    >
                      <td colSpan={9} className="px-8 py-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-6 flex-wrap">
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                Parent Contact
                              </p>
                              <p className="text-sm text-foreground">
                                {abs.parentName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {abs.parentMobile}
                              </p>
                            </div>
                            {abs.alertSent && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                  Alert Sent At
                                </p>
                                <p className="text-sm text-foreground">
                                  {abs.alertTime}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  SMS + Email
                                </p>
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                Alert Message Sent
                              </p>
                              <p className="text-xs text-muted-foreground bg-background border border-border rounded-lg px-3 py-2 max-w-md">
                                {ALERT_MESSAGE_TEMPLATE(
                                  abs.student,
                                  abs.parentName,
                                )}
                              </p>
                            </div>
                          </div>

                          {abs.reply ? (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                Parent Reply
                              </p>
                              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3 flex items-start gap-2">
                                <MessageSquare
                                  size={14}
                                  className="text-green-600 mt-0.5 shrink-0"
                                />
                                <p className="text-sm text-foreground">
                                  {abs.reply}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users size={14} />
                              <span>No parent reply received yet.</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
