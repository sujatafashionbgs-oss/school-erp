import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, UserCheck, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Member {
  id: string;
  name: string;
  type: "Student" | "Staff";
  memberId: string;
  class?: string;
  booksIssued: number;
  memberSince: string;
  status: "Active" | "Suspended";
}

const initialMembers: Member[] = [
  {
    id: "m1",
    name: "Aarav Sharma",
    type: "Student",
    memberId: "LIB-2024-001",
    class: "VIII-A",
    booksIssued: 2,
    memberSince: "2024-04-01",
    status: "Active",
  },
  {
    id: "m2",
    name: "Priya Singh",
    type: "Student",
    memberId: "LIB-2024-002",
    class: "IX-B",
    booksIssued: 1,
    memberSince: "2024-04-01",
    status: "Active",
  },
  {
    id: "m3",
    name: "Rohan Kumar",
    type: "Student",
    memberId: "LIB-2024-003",
    class: "VII-A",
    booksIssued: 3,
    memberSince: "2023-04-01",
    status: "Suspended",
  },
  {
    id: "m4",
    name: "Ananya Verma",
    type: "Student",
    memberId: "LIB-2024-004",
    class: "X-A",
    booksIssued: 0,
    memberSince: "2022-04-01",
    status: "Active",
  },
  {
    id: "m5",
    name: "Mohammed Arif",
    type: "Student",
    memberId: "LIB-2024-005",
    class: "VI-B",
    booksIssued: 1,
    memberSince: "2024-04-01",
    status: "Active",
  },
  {
    id: "m6",
    name: "Sneha Jha",
    type: "Student",
    memberId: "LIB-2024-006",
    class: "XI-Science",
    booksIssued: 1,
    memberSince: "2021-04-01",
    status: "Active",
  },
  {
    id: "m7",
    name: "Ravi Prakash",
    type: "Student",
    memberId: "LIB-2024-007",
    class: "V-A",
    booksIssued: 1,
    memberSince: "2024-04-01",
    status: "Active",
  },
  {
    id: "m8",
    name: "Dr. Anand Kumar",
    type: "Staff",
    memberId: "LIB-STAFF-001",
    booksIssued: 0,
    memberSince: "2019-04-01",
    status: "Active",
  },
  {
    id: "m9",
    name: "Mrs. Priya Sharma",
    type: "Staff",
    memberId: "LIB-STAFF-002",
    booksIssued: 2,
    memberSince: "2020-04-01",
    status: "Active",
  },
  {
    id: "m10",
    name: "Mr. Rajesh Verma",
    type: "Staff",
    memberId: "LIB-STAFF-003",
    booksIssued: 1,
    memberSince: "2021-04-01",
    status: "Active",
  },
  {
    id: "m11",
    name: "Ms. Sunita Jha",
    type: "Staff",
    memberId: "LIB-STAFF-004",
    booksIssued: 0,
    memberSince: "2022-04-01",
    status: "Active",
  },
  {
    id: "m12",
    name: "Kajal Kumari",
    type: "Student",
    memberId: "LIB-2024-012",
    class: "XII-Commerce",
    booksIssued: 1,
    memberSince: "2020-04-01",
    status: "Active",
  },
];

export function LibraryMembersPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [search, setSearch] = useState("");

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.memberId.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleStatus = (
    id: string,
    name: string,
    current: "Active" | "Suspended",
  ) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: current === "Active" ? "Suspended" : "Active" }
          : m,
      ),
    );
    toast.success(
      `${name} has been ${current === "Active" ? "suspended" : "reactivated"}`,
    );
  };

  const students = members.filter((m) => m.type === "Student").length;
  const staff = members.filter((m) => m.type === "Staff").length;

  return (
    <div className="space-y-6" data-ocid="library-members.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Library Members</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Students and staff registered with the library
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Members", value: members.length, icon: Users },
          { label: "Students", value: students, icon: BookOpen },
          { label: "Staff", value: staff, icon: UserCheck },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="p-2 rounded-xl bg-muted">
              <s.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or member ID..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="library-members.search_input"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                {[
                  "Name",
                  "Type",
                  "Member ID",
                  "Class",
                  "Books Issued",
                  "Member Since",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-muted-foreground font-medium whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, idx) => (
                <tr
                  key={m.id}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                  data-ocid={`library-members.item.${idx + 1}`}
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {m.name}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={m.type === "Staff" ? "secondary" : "outline"}
                    >
                      {m.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {m.memberId}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {m.class || "—"}
                  </td>
                  <td className="px-4 py-3 text-foreground">{m.booksIssued}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {m.memberSince}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        m.status === "Active" ? "default" : "destructive"
                      }
                    >
                      {m.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className={
                        m.status === "Active"
                          ? "text-orange-600 border-orange-300"
                          : "text-green-600 border-green-300"
                      }
                      onClick={() => toggleStatus(m.id, m.name, m.status)}
                      data-ocid={`library-members.toggle.${idx + 1}`}
                    >
                      {m.status === "Active" ? "Suspend" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
