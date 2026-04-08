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
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import type { AuditRecord } from "../../backend.d.ts";

// ─── Mock data ───────────────────────────────────────────────────────────────
function ts(dateStr: string): bigint {
  return BigInt(new Date(dateStr).getTime());
}

const MOCK_RECORDS: AuditRecord[] = [
  {
    id: "a001",
    timestamp: ts("2026-04-08T14:32:15"),
    actorId: "admin@smartskale.in",
    action: "Create",
    resourceType: "User",
    resourceId: "USR-0042",
    beforeValue: "",
    afterValue: '{"name":"Riya Sharma","role":"teacher"}',
    status: "Success",
  },
  {
    id: "a002",
    timestamp: ts("2026-04-08T13:15:00"),
    actorId: "superadmin@smartskale.in",
    action: "Permission Changed",
    resourceType: "User",
    resourceId: "USR-0038",
    beforeValue: '["Dashboard","Students"]',
    afterValue: '["Dashboard","Students","Fee Management","Reports"]',
    status: "Success",
  },
  {
    id: "a003",
    timestamp: ts("2026-04-08T11:50:30"),
    actorId: "admin@smartskale.in",
    action: "Edit",
    resourceType: "User",
    resourceId: "USR-0025",
    beforeValue: '{"role":"teacher"}',
    afterValue: '{"role":"admin"}',
    status: "Success",
  },
  {
    id: "a004",
    timestamp: ts("2026-04-07T16:45:00"),
    actorId: "admin@smartskale.in",
    action: "Delete",
    resourceType: "User",
    resourceId: "USR-0010",
    beforeValue: '{"name":"Rahul Verma","role":"librarian"}',
    afterValue: "",
    status: "Success",
  },
  {
    id: "a005",
    timestamp: ts("2026-04-07T14:20:10"),
    actorId: "superadmin@smartskale.in",
    action: "Permission Changed",
    resourceType: "Role",
    resourceId: "teacher",
    beforeValue: '["Dashboard","Classes"]',
    afterValue: '["Dashboard","Classes","Attendance","Exams","Lesson Plans"]',
    status: "Success",
  },
  {
    id: "a006",
    timestamp: ts("2026-04-07T10:05:00"),
    actorId: "admin@smartskale.in",
    action: "Create",
    resourceType: "User",
    resourceId: "USR-0055",
    beforeValue: "",
    afterValue: '{"name":"Deepak Nair","role":"accountant"}',
    status: "Success",
  },
  {
    id: "a007",
    timestamp: ts("2026-04-06T17:30:00"),
    actorId: "admin@smartskale.in",
    action: "Edit",
    resourceType: "User",
    resourceId: "USR-0033",
    beforeValue: '{"status":"active"}',
    afterValue: '{"status":"inactive"}',
    status: "Success",
  },
  {
    id: "a008",
    timestamp: ts("2026-04-06T15:12:45"),
    actorId: "superadmin@smartskale.in",
    action: "Permission Changed",
    resourceType: "User",
    resourceId: "USR-0018",
    beforeValue: '["Dashboard","Students","Fee Management"]',
    afterValue: '["Dashboard"]',
    status: "Success",
  },
  {
    id: "a009",
    timestamp: ts("2026-04-06T09:00:00"),
    actorId: "admin@smartskale.in",
    action: "Create",
    resourceType: "User",
    resourceId: "USR-0056",
    beforeValue: "",
    afterValue: '{"name":"Ananya Iyer","role":"parent"}',
    status: "Success",
  },
  {
    id: "a010",
    timestamp: ts("2026-04-05T16:00:00"),
    actorId: "admin@smartskale.in",
    action: "Delete",
    resourceType: "User",
    resourceId: "USR-0007",
    beforeValue: '{"name":"Vikram Joshi","role":"vendor"}',
    afterValue: "",
    status: "Success",
  },
  {
    id: "a011",
    timestamp: ts("2026-04-05T14:22:30"),
    actorId: "superadmin@smartskale.in",
    action: "Edit",
    resourceType: "User",
    resourceId: "USR-0044",
    beforeValue: '{"name":"Priya Mehta"}',
    afterValue: '{"name":"Priya Mehta Sharma"}',
    status: "Success",
  },
  {
    id: "a012",
    timestamp: ts("2026-04-05T11:10:00"),
    actorId: "admin@smartskale.in",
    action: "Permission Changed",
    resourceType: "User",
    resourceId: "USR-0030",
    beforeValue: '["Dashboard","Academics"]',
    afterValue: '["Dashboard","Academics","Communication","Reports"]',
    status: "Success",
  },
  {
    id: "a013",
    timestamp: ts("2026-04-04T15:45:00"),
    actorId: "admin@smartskale.in",
    action: "Create",
    resourceType: "User",
    resourceId: "USR-0057",
    beforeValue: "",
    afterValue: '{"name":"Suresh Kumar","role":"transport-manager"}',
    status: "Success",
  },
  {
    id: "a014",
    timestamp: ts("2026-04-04T13:30:00"),
    actorId: "superadmin@smartskale.in",
    action: "Edit",
    resourceType: "Role",
    resourceId: "accountant",
    beforeValue: '{"permissions":["Dashboard","Fees"]}',
    afterValue: '{"permissions":["Dashboard","Fees","Salary","Reports"]}',
    status: "Success",
  },
  {
    id: "a015",
    timestamp: ts("2026-04-03T10:00:00"),
    actorId: "admin@smartskale.in",
    action: "Delete",
    resourceType: "User",
    resourceId: "USR-0002",
    beforeValue: '{"name":"Pooja Das","role":"lab-incharge"}',
    afterValue: "",
    status: "Failed",
  },
  {
    id: "a016",
    timestamp: ts("2026-04-03T09:15:00"),
    actorId: "superadmin@smartskale.in",
    action: "Create",
    resourceType: "User",
    resourceId: "USR-0058",
    beforeValue: "",
    afterValue: '{"name":"Kavya Nair","role":"librarian"}',
    status: "Success",
  },
  {
    id: "a017",
    timestamp: ts("2026-04-02T16:55:00"),
    actorId: "admin@smartskale.in",
    action: "Permission Changed",
    resourceType: "User",
    resourceId: "USR-0020",
    beforeValue: '["Dashboard","Students","Staff"]',
    afterValue:
      '["Dashboard","Students","Staff","Fee Management","Academics","Reports"]',
    status: "Success",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatTimestamp(ts: bigint): string {
  const d = new Date(Number(ts));
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

const ACTION_COLORS: Record<string, string> = {
  Create: "bg-green-500/15 text-green-600 border-green-500/30",
  Edit: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  Delete: "bg-red-500/15 text-red-600 border-red-500/30",
  "Permission Changed": "bg-orange-500/15 text-orange-600 border-orange-500/30",
};

const PAGE_SIZE = 20;

// ─── Component ───────────────────────────────────────────────────────────────
export function AuditLogPage() {
  const { actor, isFetching } = useActor(createActor);
  const [records, setRecords] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [filterAction, setFilterAction] = useState("All");
  const [filterActor, setFilterActor] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (isFetching) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        if (!actor) throw new Error("no actor");
        const result = await actor.loadAuditRecords();
        if (!cancelled) {
          if (result.length > 0) {
            setRecords(result);
            setUsingDemo(false);
          } else {
            setRecords(MOCK_RECORDS);
            setUsingDemo(true);
          }
        }
      } catch {
        if (!cancelled) {
          setRecords(MOCK_RECORDS);
          setUsingDemo(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [actor, isFetching]);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (filterAction !== "All" && r.action !== filterAction) return false;
      if (
        filterActor.trim() &&
        !r.actorId.toLowerCase().includes(filterActor.toLowerCase())
      )
        return false;
      if (filterFrom) {
        const from = new Date(filterFrom).getTime();
        if (Number(r.timestamp) < from) return false;
      }
      if (filterTo) {
        const to = new Date(`${filterTo}T23:59:59`).getTime();
        if (Number(r.timestamp) > to) return false;
      }
      return true;
    });
  }, [records, filterAction, filterActor, filterFrom, filterTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetPage() {
    setPage(1);
  }

  function exportCSV() {
    const header = [
      "Timestamp",
      "Action",
      "Actor",
      "Resource Type",
      "Resource ID",
      "Before Value",
      "After Value",
      "Status",
    ];
    const rows = filtered.map((r) =>
      [
        formatTimestamp(r.timestamp),
        r.action,
        r.actorId,
        r.resourceType,
        r.resourceId,
        r.beforeValue.replace(/"/g, '""'),
        r.afterValue.replace(/"/g, '""'),
        r.status,
      ]
        .map((v) => `"${v}"`)
        .join(","),
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit-log.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} records to audit-log.csv`);
  }

  const SKELETON_ROWS = ["r0", "r1", "r2", "r3", "r4", "r5", "r6", "r7"];
  const SKELETON_COLS = ["c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Log</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track who changed what permissions and when
          </p>
        </div>
        <div className="flex items-center gap-2">
          {usingDemo && (
            <Badge
              variant="outline"
              className="border-orange-500/40 text-orange-600 bg-orange-500/10"
            >
              Using demo data
            </Badge>
          )}
          <Button
            onClick={exportCSV}
            variant="outline"
            size="sm"
            data-ocid="audit-log.export.button"
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Action
            </Label>
            <Select
              value={filterAction}
              onValueChange={(v) => {
                setFilterAction(v);
                resetPage();
              }}
            >
              <SelectTrigger data-ocid="audit-log.filter-action.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Actions</SelectItem>
                <SelectItem value="Create">Create</SelectItem>
                <SelectItem value="Edit">Edit</SelectItem>
                <SelectItem value="Delete">Delete</SelectItem>
                <SelectItem value="Permission Changed">
                  Permission Changed
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Actor
            </Label>
            <Input
              placeholder="Search by actor..."
              value={filterActor}
              onChange={(e) => {
                setFilterActor(e.target.value);
                resetPage();
              }}
              data-ocid="audit-log.filter-actor.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              From Date
            </Label>
            <Input
              type="date"
              value={filterFrom}
              onChange={(e) => {
                setFilterFrom(e.target.value);
                resetPage();
              }}
              data-ocid="audit-log.filter-from.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              To Date
            </Label>
            <Input
              type="date"
              value={filterTo}
              onChange={(e) => {
                setFilterTo(e.target.value);
                resetPage();
              }}
              data-ocid="audit-log.filter-to.input"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">
                  Timestamp
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                  Action
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                  Actor
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">
                  Resource Type
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">
                  Resource ID
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">
                  Before Value
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">
                  After Value
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                SKELETON_ROWS.map((rk) => (
                  <tr key={rk} className="border-b border-border/50">
                    {SKELETON_COLS.map((ck) => (
                      <td key={ck} className="px-4 py-3">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No audit records match the current filters.
                  </td>
                </tr>
              ) : (
                paginated.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    data-ocid={`audit-log.row.${r.id}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {formatTimestamp(r.timestamp)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${ACTION_COLORS[r.action] ?? "bg-muted text-muted-foreground border-border"}`}
                      >
                        {r.action}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3 text-foreground font-medium max-w-[160px] truncate"
                      title={r.actorId}
                    >
                      {r.actorId}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {r.resourceType}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {r.resourceId}
                    </td>
                    <td className="px-4 py-3 max-w-[160px]">
                      {r.beforeValue ? (
                        <span
                          className="block truncate text-xs font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded"
                          title={r.beforeValue}
                        >
                          {r.beforeValue}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/40 text-xs">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-[160px]">
                      {r.afterValue ? (
                        <span
                          className="block truncate text-xs font-mono text-foreground bg-muted/50 px-1.5 py-0.5 rounded"
                          title={r.afterValue}
                        >
                          {r.afterValue}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/40 text-xs">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                          r.status === "Success"
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : "bg-red-500/10 text-red-600 border-red-500/20"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {filtered.length}
              </span>{" "}
              records
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                data-ocid="audit-log.pagination.prev"
              >
                Previous
              </Button>
              <span className="text-xs text-muted-foreground px-1">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                data-ocid="audit-log.pagination.next"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
