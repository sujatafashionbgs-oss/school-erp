import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { CLASSES } from "@/data/classConfig";
import {
  Award,
  Download,
  GraduationCap,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const BATCH_YEARS = [
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
  "2015",
];

interface Alumni {
  id: string;
  name: string;
  admNo: string;
  batchYear: string;
  lastClass: string;
  currentStatus: string;
  contact: string;
  email: string;
  remarks: string;
}

const initialAlumni: Alumni[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    admNo: "2020-0101",
    batchYear: "2024",
    lastClass: "XII",
    currentStatus: "Higher Studies",
    contact: "9876540001",
    email: "rahul.sharma@gmail.com",
    remarks: "Pursuing B.Tech at IIT Delhi",
  },
  {
    id: "2",
    name: "Ananya Singh",
    admNo: "2020-0102",
    batchYear: "2024",
    lastClass: "XII",
    currentStatus: "Working",
    contact: "9876540002",
    email: "ananya.s@gmail.com",
    remarks: "Software Engineer at TCS",
  },
  {
    id: "3",
    name: "Vikram Rao",
    admNo: "2019-0055",
    batchYear: "2023",
    lastClass: "XII",
    currentStatus: "Higher Studies",
    contact: "9876540003",
    email: "vikram.rao@gmail.com",
    remarks: "MBBS at AIIMS Jodhpur",
  },
  {
    id: "4",
    name: "Priya Nair",
    admNo: "2019-0056",
    batchYear: "2023",
    lastClass: "XII",
    currentStatus: "Working",
    contact: "9876540004",
    email: "priya.nair@gmail.com",
    remarks: "Chartered Accountant",
  },
  {
    id: "5",
    name: "Aditya Kumar",
    admNo: "2018-0088",
    batchYear: "2022",
    lastClass: "XII",
    currentStatus: "Higher Studies",
    contact: "9876540005",
    email: "aditya.k@gmail.com",
    remarks: "B.Sc Computer Science at DU",
  },
  {
    id: "6",
    name: "Sonal Gupta",
    admNo: "2018-0089",
    batchYear: "2022",
    lastClass: "XII",
    currentStatus: "Unknown",
    contact: "9876540006",
    email: "sonal.g@gmail.com",
    remarks: "",
  },
  {
    id: "7",
    name: "Manish Verma",
    admNo: "2017-0077",
    batchYear: "2021",
    lastClass: "XII",
    currentStatus: "Working",
    contact: "9876540007",
    email: "manish.v@gmail.com",
    remarks: "Bank PO at SBI",
  },
  {
    id: "8",
    name: "Kavya Joshi",
    admNo: "2017-0078",
    batchYear: "2021",
    lastClass: "XII",
    currentStatus: "Higher Studies",
    contact: "9876540008",
    email: "kavya.j@gmail.com",
    remarks: "MA in English Literature",
  },
  {
    id: "9",
    name: "Suresh Patel",
    admNo: "2016-0034",
    batchYear: "2020",
    lastClass: "XII",
    currentStatus: "Working",
    contact: "9876540009",
    email: "suresh.p@gmail.com",
    remarks: "Teacher at City School",
  },
  {
    id: "10",
    name: "Deepa Mehta",
    admNo: "2016-0035",
    batchYear: "2020",
    lastClass: "XII",
    currentStatus: "Active",
    contact: "9876540010",
    email: "deepa.m@gmail.com",
    remarks: "Civil Service preparation",
  },
  {
    id: "11",
    name: "Nitin Chaudhary",
    admNo: "2015-0022",
    batchYear: "2019",
    lastClass: "XII",
    currentStatus: "Working",
    contact: "9876540011",
    email: "nitin.c@gmail.com",
    remarks: "Marketing Manager",
  },
  {
    id: "12",
    name: "Ritu Saxena",
    admNo: "2015-0023",
    batchYear: "2019",
    lastClass: "XII",
    currentStatus: "Higher Studies",
    contact: "9876540012",
    email: "ritu.s@gmail.com",
    remarks: "PhD in Chemistry",
  },
];

export function AlumniPage() {
  const [alumni, setAlumni] = useState<Alumni[]>(initialAlumni);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [certAlumni, setCertAlumni] = useState<Alumni | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    admNo: "",
    batchYear: "",
    lastClass: "XII",
    currentStatus: "",
    contact: "",
    email: "",
    remarks: "",
  });

  const filtered = alumni.filter((a) => {
    const q = search.toLowerCase();
    if (
      q &&
      !a.name.toLowerCase().includes(q) &&
      !a.batchYear.includes(q) &&
      !a.currentStatus.toLowerCase().includes(q)
    )
      return false;
    if (yearFilter !== "all" && a.batchYear !== yearFilter) return false;
    if (classFilter !== "all" && a.lastClass !== classFilter) return false;
    if (statusFilter !== "all" && a.currentStatus !== statusFilter)
      return false;
    return true;
  });

  const handleAdd = () => {
    if (!form.name || !form.admNo || !form.batchYear) {
      toast.error("Name, Adm. No, and Batch Year are required");
      return;
    }
    setAlumni((prev) => [{ ...form, id: String(Date.now()) }, ...prev]);
    setAddOpen(false);
    setForm({
      name: "",
      admNo: "",
      batchYear: "",
      lastClass: "XII",
      currentStatus: "",
      contact: "",
      email: "",
      remarks: "",
    });
    toast.success("Alumni record added");
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      Working: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      "Higher Studies":
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      Active:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      Unknown: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    };
    return <Badge className={map[s] ?? "bg-gray-100 text-gray-600"}>{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Alumni Management</h1>
          <p className="text-muted-foreground text-sm">
            Manage passed-out students, issue certificates, track current status
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          data-ocid="alumni.open_modal_button"
        >
          <Plus size={16} className="mr-2" /> Add Alumni
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Alumni",
            value: "842",
            icon: <GraduationCap size={18} />,
            color: "text-blue-500",
          },
          {
            label: "This Year Passout",
            value: "68",
            icon: <Users size={18} />,
            color: "text-green-500",
          },
          {
            label: "Verified",
            value: "312",
            icon: <Award size={18} />,
            color: "text-purple-500",
          },
          {
            label: "Certificates Issued",
            value: "156",
            icon: <Download size={18} />,
            color: "text-orange-500",
          },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={s.color}>{s.icon}</div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search by name, year, status..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="alumni.search_input"
          />
        </div>
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-36" data-ocid="alumni.year.select">
            <SelectValue placeholder="Batch Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {BATCH_YEARS.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger
            className="w-36"
            data-ocid="alumni.class_filter.select"
          >
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40" data-ocid="alumni.status.select">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {["Active", "Working", "Higher Studies", "Unknown"].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Adm. No</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Last Class</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a, i) => (
                <TableRow key={a.id} data-ocid={`alumni.item.${i + 1}`}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell>{a.admNo}</TableCell>
                  <TableCell>{a.batchYear}</TableCell>
                  <TableCell>{a.lastClass}</TableCell>
                  <TableCell>{statusBadge(a.currentStatus)}</TableCell>
                  <TableCell>{a.contact}</TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => setCertAlumni(a)}
                        data-ocid={`alumni.certificate.button.${i + 1}`}
                      >
                        <Award size={12} className="mr-1" /> Certificate
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        data-ocid={`alumni.edit_button.${i + 1}`}
                      >
                        <Pencil size={12} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-destructive"
                        onClick={() => setDeleteId(a.id)}
                        data-ocid={`alumni.delete_button.${i + 1}`}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg" data-ocid="alumni.dialog">
          <DialogHeader>
            <DialogTitle>Add Alumni Record</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            {(
              [
                { label: "Full Name *", key: "name", type: "text" },
                { label: "Admission No *", key: "admNo", type: "text" },
                { label: "Batch Year *", key: "batchYear", type: "text" },
                { label: "Last Class", key: "lastClass", type: "text" },
                { label: "Contact", key: "contact", type: "text" },
                { label: "Email", key: "email", type: "email" },
              ] as { label: string; key: keyof typeof form; type: string }[]
            ).map(({ label, key, type }) => (
              <div key={key} className="grid gap-1">
                <Label>{label}</Label>
                <Input
                  type={type}
                  value={form[key]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [key]: e.target.value }))
                  }
                />
              </div>
            ))}
            <div className="col-span-2 grid gap-1">
              <Label>Current Status</Label>
              <Select
                value={form.currentStatus}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, currentStatus: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {["Active", "Working", "Higher Studies", "Unknown"].map(
                    (s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 grid gap-1">
              <Label>Remarks</Label>
              <Textarea
                value={form.remarks}
                onChange={(e) =>
                  setForm((p) => ({ ...p, remarks: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              data-ocid="alumni.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={handleAdd} data-ocid="alumni.submit_button">
              Add Alumni
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certificate Dialog */}
      <Dialog open={!!certAlumni} onOpenChange={() => setCertAlumni(null)}>
        <DialogContent
          className="max-w-lg"
          data-ocid="alumni.certificate.dialog"
        >
          <DialogHeader>
            <DialogTitle>Alumni Certificate</DialogTitle>
          </DialogHeader>
          {certAlumni && (
            <div className="border-2 border-yellow-400 dark:border-yellow-600 rounded-xl p-6 space-y-3 text-center bg-yellow-50 dark:bg-yellow-950/30">
              <p className="font-bold text-lg">Sunrise Public School</p>
              <p className="text-sm text-muted-foreground">
                Certificate of Alumni
              </p>
              <div className="border-t border-b border-yellow-300 dark:border-yellow-700 py-4 space-y-2">
                <p className="text-sm">This is to certify that</p>
                <p className="font-bold text-xl">{certAlumni.name}</p>
                <p className="text-sm">
                  was a student of this institution and passed out in the year{" "}
                  <strong>{certAlumni.batchYear}</strong> from Class{" "}
                  <strong>{certAlumni.lastClass}</strong>.
                </p>
                <p className="text-sm text-muted-foreground">
                  Admission No: {certAlumni.admNo}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Issued on: {new Date().toLocaleDateString("en-IN")}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCertAlumni(null)}
              data-ocid="alumni.certificate.close_button"
            >
              Close
            </Button>
            <Button
              onClick={() => toast.success("Alumni certificate downloaded")}
              data-ocid="alumni.certificate.confirm_button"
            >
              <Download size={14} className="mr-2" /> Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent data-ocid="alumni.delete.dialog">
          <DialogHeader>
            <DialogTitle>Delete Alumni Record?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently remove the record.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              data-ocid="alumni.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setAlumni((p) => p.filter((a) => a.id !== deleteId));
                setDeleteId(null);
                toast.success("Record deleted");
              }}
              data-ocid="alumni.delete.confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
