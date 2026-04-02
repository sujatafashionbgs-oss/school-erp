import { Calendar, Clock, FlaskConical, Package } from "lucide-react";

export function LabDashboard() {
  return (
    <div className="space-y-6" data-ocid="lab_dashboard.page">
      <h1 className="text-2xl font-bold text-foreground">
        Lab Incharge Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Today's Bookings",
            value: "6",
            icon: <Calendar size={22} />,
            color: "text-blue-600",
            bg: "bg-blue-500/10",
          },
          {
            label: "Available Slots",
            value: "4",
            icon: <Clock size={22} />,
            color: "text-green-600",
            bg: "bg-green-500/10",
          },
          {
            label: "Experiments",
            value: "24",
            icon: <FlaskConical size={22} />,
            color: "text-purple-600",
            bg: "bg-purple-500/10",
          },
          {
            label: "Inventory Items",
            value: "156",
            icon: <Package size={22} />,
            color: "text-orange-600",
            bg: "bg-orange-500/10",
          },
        ].map((c, i) => (
          <div
            key={c.label}
            className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4"
            data-ocid={`lab_dashboard.stat.${i + 1}`}
          >
            <div className={`${c.bg} ${c.color} p-3 rounded-xl`}>{c.icon}</div>
            <div>
              <p className="text-xl font-bold text-foreground">{c.value}</p>
              <p className="text-sm text-muted-foreground">{c.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
