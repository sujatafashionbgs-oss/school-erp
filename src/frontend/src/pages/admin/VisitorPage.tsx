import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Visitor, mockVisitors } from "@/data/mockVisitors";
import { Camera, Printer, Search, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function generateGatePassNo(counter: number): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `GP${y}${m}${d}-${String(counter).padStart(3, "0")}`;
}

function getCurrentTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function getCurrentDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function StatusBadge({ status }: { status: Visitor["status"] }) {
  if (status === "In Campus") {
    return (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        In Campus
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="text-muted-foreground">
      Checked Out
    </Badge>
  );
}

function GatePassModal({ visitor }: { visitor: Visitor }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2"
          data-ocid="visitor.print_button"
          title="Print Gate Pass"
        >
          <Printer size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm" data-ocid="visitor.modal">
        <DialogHeader>
          <DialogTitle>Gate Pass</DialogTitle>
        </DialogHeader>
        <div
          id="gate-pass-print"
          className="border-2 border-border rounded-lg p-4 space-y-3 bg-card"
        >
          <div className="text-center border-b pb-3">
            <div className="text-base font-bold text-foreground">
              Springfield Public School
            </div>
            <div className="text-xs text-muted-foreground">
              Visitor Gate Pass
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-16 h-16 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted shrink-0">
              <Camera size={24} className="text-muted-foreground" />
            </div>
            <div className="space-y-1 text-xs">
              <div>
                <span className="text-muted-foreground">Pass No:</span>{" "}
                <span className="font-semibold">{visitor.gatePassNo}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Name:</span>{" "}
                <span className="font-semibold">{visitor.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Purpose:</span>{" "}
                {visitor.purpose}
              </div>
              <div>
                <span className="text-muted-foreground">Meeting:</span>{" "}
                {visitor.meetingWith}
              </div>
              <div>
                <span className="text-muted-foreground">In Time:</span>{" "}
                {visitor.inTime}
              </div>
              <div>
                <span className="text-muted-foreground">Date:</span>{" "}
                {visitor.date}
              </div>
            </div>
          </div>
          {/* Decorative QR-like grid */}
          <div className="flex justify-center pt-1">
            <div
              className="grid gap-px"
              style={{ gridTemplateColumns: "repeat(8, 8px)" }}
            >
              {Array.from({ length: 64 }, (_, i) => i).map((i) => (
                <div
                  key={`qr-cell-${i}`}
                  className="w-2 h-2 rounded-[1px]"
                  style={{
                    backgroundColor:
                      (i + Math.floor(i / 8)) % 3 === 0
                        ? "hsl(var(--foreground))"
                        : i % 5 === 0
                          ? "hsl(var(--muted-foreground))"
                          : "hsl(var(--muted))",
                  }}
                />
              ))}
            </div>
          </div>
          <div className="text-center text-[10px] text-muted-foreground">
            Valid for today only · {visitor.date}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            data-ocid="visitor.cancel_button"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
          <Button
            size="sm"
            data-ocid="visitor.confirm_button"
            onClick={() => {
              window.print();
            }}
          >
            <Printer size={14} className="mr-1" />
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function VisitorPage() {
  const [visitors, setVisitors] = useState<Visitor[]>(mockVisitors);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [counter, setCounter] = useState(11);

  // Check-in form state
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    purpose: "" as Visitor["purpose"] | "",
    meetingWith: "",
    idProofType: "",
    idNumber: "",
  });

  // History filters
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [filterPurpose, setFilterPurpose] = useState("all");
  const [filterName, setFilterName] = useState("");
  const [todaySearch, setTodaySearch] = useState("");

  const todayVisitors = visitors.filter((v) => {
    const isToday = v.date === "2026-04-01" || v.date === getCurrentDate();
    if (!isToday) return false;
    const q = todaySearch.toLowerCase();
    return (
      !q ||
      v.name.toLowerCase().includes(q) ||
      v.mobile.includes(q) ||
      v.purpose.toLowerCase().includes(q)
    );
  });
  const inCampusCount = todayVisitors.filter(
    (v) => v.status === "In Campus",
  ).length;

  function handleCheckIn() {
    if (!form.name || !form.mobile || !form.purpose || !form.meetingWith) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const newVisitor: Visitor = {
      id: `v${Date.now()}`,
      name: form.name,
      mobile: form.mobile,
      purpose: form.purpose as Visitor["purpose"],
      meetingWith: form.meetingWith,
      inTime: getCurrentTime(),
      date: getCurrentDate(),
      status: "In Campus",
      idProof: `${form.idProofType}: ${form.idNumber}`,
      gatePassNo: generateGatePassNo(counter),
    };
    setVisitors((prev) => [newVisitor, ...prev]);
    setCounter((c) => c + 1);
    setForm({
      name: "",
      mobile: "",
      purpose: "",
      meetingWith: "",
      idProofType: "",
      idNumber: "",
    });
    setCheckInOpen(false);
    toast.success(`Visitor checked in. Gate Pass: ${newVisitor.gatePassNo}`);
  }

  function handleCheckOut(id: string) {
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, outTime: getCurrentTime(), status: "Checked Out" }
          : v,
      ),
    );
    toast.success("Visitor checked out successfully.");
  }

  const filteredHistory = visitors.filter((v) => {
    if (filterFrom && v.date < filterFrom) return false;
    if (filterTo && v.date > filterTo) return false;
    if (filterPurpose !== "all" && v.purpose !== filterPurpose) return false;
    if (filterName && !v.name.toLowerCase().includes(filterName.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6" data-ocid="visitors.page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Visitor / Gate Pass
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage campus visitors and gate passes
          </p>
        </div>
      </div>

      <Tabs defaultValue="today" data-ocid="visitors.tab">
        <TabsList>
          <TabsTrigger value="today" data-ocid="visitors.today.tab">
            Today's Visitors
          </TabsTrigger>
          <TabsTrigger value="history" data-ocid="visitors.history.tab">
            Visitor History
          </TabsTrigger>
        </TabsList>

        {/* TAB 1 — Today's Visitors */}
        <TabsContent value="today" className="space-y-5 mt-5">
          {/* Today search bar */}
          <div className="relative max-w-sm">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 pl-9 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Search by name, mobile, or purpose..."
              value={todaySearch}
              onChange={(e) => setTodaySearch(e.target.value)}
              data-ocid="visitors.search_input"
            />
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-1 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Currently In Campus
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-3xl font-bold text-green-600">
                  {inCampusCount}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Today's Total
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-3xl font-bold">{todayVisitors.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-3xl font-bold">67</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Avg Visit Duration
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-3xl font-bold">
                  28{" "}
                  <span className="text-base font-normal text-muted-foreground">
                    min
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table header with Check In button */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Today's Visitor Log</h2>
            <Dialog open={checkInOpen} onOpenChange={setCheckInOpen}>
              <DialogTrigger asChild>
                <Button size="sm" data-ocid="visitors.open_modal_button">
                  <UserPlus size={15} className="mr-1.5" />
                  Check In New Visitor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md" data-ocid="visitors.dialog">
                <DialogHeader>
                  <DialogTitle>Check In New Visitor</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="v-name">Name *</Label>
                      <Input
                        id="v-name"
                        placeholder="Full name"
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        data-ocid="visitors.input"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="v-mobile">Mobile *</Label>
                      <Input
                        id="v-mobile"
                        placeholder="10-digit number"
                        value={form.mobile}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, mobile: e.target.value }))
                        }
                        data-ocid="visitors.input"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Purpose *</Label>
                    <Select
                      value={form.purpose}
                      onValueChange={(val) =>
                        setForm((f) => ({
                          ...f,
                          purpose: val as Visitor["purpose"],
                        }))
                      }
                    >
                      <SelectTrigger data-ocid="visitors.select">
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Meeting">Meeting</SelectItem>
                        <SelectItem value="Delivery">Delivery</SelectItem>
                        <SelectItem value="Parent">Parent</SelectItem>
                        <SelectItem value="Official">Official</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="v-meeting">Meeting With *</Label>
                    <Input
                      id="v-meeting"
                      placeholder="Staff name and designation"
                      value={form.meetingWith}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, meetingWith: e.target.value }))
                      }
                      data-ocid="visitors.input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>ID Proof Type</Label>
                      <Select
                        value={form.idProofType}
                        onValueChange={(val) =>
                          setForm((f) => ({ ...f, idProofType: val }))
                        }
                      >
                        <SelectTrigger data-ocid="visitors.select">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Aadhar">Aadhar</SelectItem>
                          <SelectItem value="PAN">PAN</SelectItem>
                          <SelectItem value="Passport">Passport</SelectItem>
                          <SelectItem value="Driving License">
                            Driving License
                          </SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="v-idnum">ID Number</Label>
                      <Input
                        id="v-idnum"
                        placeholder="ID number"
                        value={form.idNumber}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, idNumber: e.target.value }))
                        }
                        data-ocid="visitors.input"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setCheckInOpen(false)}
                    data-ocid="visitors.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCheckIn}
                    data-ocid="visitors.submit_button"
                  >
                    Check In
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Visitors table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Gate Pass #</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Purpose</TableHead>
                  <TableHead className="font-semibold">Meeting With</TableHead>
                  <TableHead className="font-semibold">In Time</TableHead>
                  <TableHead className="font-semibold">Out Time</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayVisitors.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground py-8"
                      data-ocid="visitors.empty_state"
                    >
                      No visitors today.
                    </TableCell>
                  </TableRow>
                ) : (
                  todayVisitors.map((v, idx) => (
                    <TableRow key={v.id} data-ocid={`visitors.item.${idx + 1}`}>
                      <TableCell className="font-mono text-xs">
                        {v.gatePassNo}
                      </TableCell>
                      <TableCell className="font-medium">{v.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {v.purpose}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{v.meetingWith}</TableCell>
                      <TableCell className="tabular-nums">{v.inTime}</TableCell>
                      <TableCell className="tabular-nums text-muted-foreground">
                        {v.outTime ?? "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={v.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {v.status === "In Campus" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => handleCheckOut(v.id)}
                              data-ocid={`visitors.secondary_button.${idx + 1}`}
                            >
                              Check Out
                            </Button>
                          )}
                          <GatePassModal visitor={v} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* TAB 2 — Visitor History */}
        <TabsContent value="history" className="space-y-5 mt-5">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="space-y-1">
              <Label className="text-xs">From Date</Label>
              <Input
                type="date"
                className="h-8 w-36 text-sm"
                value={filterFrom}
                onChange={(e) => setFilterFrom(e.target.value)}
                data-ocid="visitors.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">To Date</Label>
              <Input
                type="date"
                className="h-8 w-36 text-sm"
                value={filterTo}
                onChange={(e) => setFilterTo(e.target.value)}
                data-ocid="visitors.input"
              />
            </div>
            <div className="space-y-1 w-36">
              <Label className="text-xs">Purpose</Label>
              <Select value={filterPurpose} onValueChange={setFilterPurpose}>
                <SelectTrigger
                  className="h-8 text-sm"
                  data-ocid="visitors.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Purposes</SelectItem>
                  <SelectItem value="Meeting">Meeting</SelectItem>
                  <SelectItem value="Delivery">Delivery</SelectItem>
                  <SelectItem value="Parent">Parent</SelectItem>
                  <SelectItem value="Official">Official</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 flex-1 min-w-40">
              <Label className="text-xs">Search by Name</Label>
              <Input
                className="h-8 text-sm"
                placeholder="Visitor name..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                data-ocid="visitors.search_input"
              />
            </div>
            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                data-ocid="visitors.secondary_button"
                onClick={() => toast.info("Exporting to Excel...")}
              >
                Export Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                data-ocid="visitors.secondary_button"
                onClick={() => toast.info("Generating PDF...")}
              >
                Export PDF
              </Button>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Gate Pass #</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Mobile</TableHead>
                  <TableHead className="font-semibold">Purpose</TableHead>
                  <TableHead className="font-semibold">Meeting With</TableHead>
                  <TableHead className="font-semibold">In Time</TableHead>
                  <TableHead className="font-semibold">Out Time</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">ID Proof</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-muted-foreground py-8"
                      data-ocid="visitors.history.empty_state"
                    >
                      No visitor records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHistory.map((v, idx) => (
                    <TableRow
                      key={v.id}
                      data-ocid={`visitors.history.item.${idx + 1}`}
                    >
                      <TableCell className="font-mono text-xs">
                        {v.gatePassNo}
                      </TableCell>
                      <TableCell className="font-medium">{v.name}</TableCell>
                      <TableCell className="tabular-nums text-sm">
                        {v.mobile}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {v.purpose}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{v.meetingWith}</TableCell>
                      <TableCell className="tabular-nums">{v.inTime}</TableCell>
                      <TableCell className="tabular-nums text-muted-foreground">
                        {v.outTime ?? "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={v.status} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {v.idProof}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
