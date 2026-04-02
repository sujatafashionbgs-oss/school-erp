import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bus, CheckCircle, Clock, Search } from "lucide-react";
import { useState } from "react";

const transportStudents = [
  {
    id: "ts1",
    name: "Aarav Sharma",
    admissionNo: "2024-1045",
    class: "VIII-A",
    route: "A",
    busStop: "Rajendra Nagar",
    pickupTime: "7:00 AM",
    dropTime: "2:15 PM",
    feeStatus: "Paid" as const,
  },
  {
    id: "ts2",
    name: "Priya Singh",
    admissionNo: "2024-1046",
    class: "IX-B",
    route: "A",
    busStop: "Gandhi Maidan",
    pickupTime: "7:10 AM",
    dropTime: "2:20 PM",
    feeStatus: "Paid" as const,
  },
  {
    id: "ts3",
    name: "Rohan Kumar",
    admissionNo: "2024-1047",
    class: "VII-A",
    route: "B",
    busStop: "Kankarbagh",
    pickupTime: "7:05 AM",
    dropTime: "2:25 PM",
    feeStatus: "Pending" as const,
  },
  {
    id: "ts4",
    name: "Ananya Verma",
    admissionNo: "2024-1048",
    class: "X-A",
    route: "C",
    busStop: "Danapur",
    pickupTime: "6:55 AM",
    dropTime: "2:30 PM",
    feeStatus: "Paid" as const,
  },
  {
    id: "ts5",
    name: "Mohammed Arif",
    admissionNo: "2024-1049",
    class: "VI-B",
    route: "A",
    busStop: "Patna Junction",
    pickupTime: "7:15 AM",
    dropTime: "2:10 PM",
    feeStatus: "Paid" as const,
  },
  {
    id: "ts6",
    name: "Sneha Jha",
    admissionNo: "2024-1050",
    class: "XI-Science",
    route: "B",
    busStop: "Boring Road",
    pickupTime: "7:00 AM",
    dropTime: "3:00 PM",
    feeStatus: "Paid" as const,
  },
  {
    id: "ts7",
    name: "Ravi Prakash",
    admissionNo: "2024-1051",
    class: "V-A",
    route: "C",
    busStop: "Phulwari",
    pickupTime: "7:00 AM",
    dropTime: "2:05 PM",
    feeStatus: "Paid" as const,
  },
  {
    id: "ts8",
    name: "Kajal Kumari",
    admissionNo: "2024-1052",
    class: "XII-Commerce",
    route: "B",
    busStop: "Patliputra",
    pickupTime: "7:05 AM",
    dropTime: "3:10 PM",
    feeStatus: "Paid" as const,
  },
  {
    id: "ts9",
    name: "Deepak Ranjan",
    admissionNo: "2024-1053",
    class: "VIII-B",
    route: "A",
    busStop: "Rajendra Nagar",
    pickupTime: "7:00 AM",
    dropTime: "2:15 PM",
    feeStatus: "Pending" as const,
  },
  {
    id: "ts10",
    name: "Nisha Kumari",
    admissionNo: "2024-1054",
    class: "VII-B",
    route: "C",
    busStop: "Naubatpur",
    pickupTime: "6:50 AM",
    dropTime: "2:40 PM",
    feeStatus: "Paid" as const,
  },
];

export function TransportStudentsPage() {
  const [search, setSearch] = useState("");

  const filtered = transportStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNo.includes(search),
  );

  const paid = transportStudents.filter((s) => s.feeStatus === "Paid").length;
  const pending = transportStudents.filter(
    (s) => s.feeStatus === "Pending",
  ).length;

  return (
    <div className="space-y-6" data-ocid="transport-students.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Transport Students
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Students enrolled in school transport
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Enrolled",
            value: transportStudents.length,
            icon: Bus,
            color: "text-blue-500",
          },
          {
            label: "Fee Paid",
            value: paid,
            icon: CheckCircle,
            color: "text-green-500",
          },
          {
            label: "Fee Pending",
            value: pending,
            icon: Clock,
            color: "text-orange-500",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="p-2 rounded-xl bg-muted">
              <s.icon className={`w-5 h-5 ${s.color}`} />
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
              placeholder="Search by name or admission number..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="transport-students.search_input"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                {[
                  "Name",
                  "Adm. No",
                  "Class",
                  "Route",
                  "Bus Stop",
                  "Pickup",
                  "Drop",
                  "Fee Status",
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
              {filtered.map((s, idx) => (
                <tr
                  key={s.id}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                  data-ocid={`transport-students.item.${idx + 1}`}
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {s.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {s.admissionNo}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.class}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">Route {s.route}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {s.busStop}
                  </td>
                  <td className="px-4 py-3 text-foreground">{s.pickupTime}</td>
                  <td className="px-4 py-3 text-foreground">{s.dropTime}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        s.feeStatus === "Paid" ? "default" : "destructive"
                      }
                    >
                      {s.feeStatus}
                    </Badge>
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
