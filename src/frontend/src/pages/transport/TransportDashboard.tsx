import { Bus, MapPin, Navigation, Users } from "lucide-react";

export function TransportDashboard() {
  return (
    <div className="space-y-6" data-ocid="transport_dashboard.page">
      <h1 className="text-2xl font-bold text-foreground">
        Transport Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Active Routes",
            value: "3",
            icon: <Navigation size={22} />,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Vehicles",
            value: "3",
            icon: <Bus size={22} />,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Bus Stops",
            value: "9",
            icon: <MapPin size={22} />,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            label: "Students",
            value: "68",
            icon: <Users size={22} />,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
        ].map((c, i) => (
          <div
            key={c.label}
            className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4"
            data-ocid={`transport_dashboard.stat.${i + 1}`}
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
