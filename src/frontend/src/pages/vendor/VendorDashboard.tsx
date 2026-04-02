import { Package, ShoppingCart, TrendingUp, Warehouse } from "lucide-react";

interface Props {
  navigate: (path: string) => void;
}

export function VendorDashboard({ navigate }: Props) {
  return (
    <div className="space-y-6" data-ocid="vendor_dashboard.page">
      <h1 className="text-2xl font-bold text-foreground">Vendor Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Purchase Orders",
            value: "8",
            icon: <ShoppingCart size={22} />,
            color: "text-blue-600",
            bg: "bg-blue-500/10",
            path: "/vendor/orders",
          },
          {
            label: "Inventory Items",
            value: "12",
            icon: <Warehouse size={22} />,
            color: "text-purple-600",
            bg: "bg-purple-500/10",
            path: "/vendor/inventory",
          },
          {
            label: "Low Stock",
            value: "3",
            icon: <Package size={22} />,
            color: "text-orange-600",
            bg: "bg-orange-500/10",
            path: "/vendor/inventory",
          },
          {
            label: "Total Value",
            value: "₹2.4L",
            icon: <TrendingUp size={22} />,
            color: "text-green-600",
            bg: "bg-green-500/10",
            path: "/vendor/orders",
          },
        ].map((c, i) => (
          <button
            type="button"
            key={c.label}
            onClick={() => navigate(c.path)}
            data-ocid={`vendor_dashboard.stat.${i + 1}`}
            className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow text-left"
          >
            <div className={`${c.bg} ${c.color} p-3 rounded-xl`}>{c.icon}</div>
            <div>
              <p className="text-xl font-bold text-foreground">{c.value}</p>
              <p className="text-sm text-muted-foreground">{c.label}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
