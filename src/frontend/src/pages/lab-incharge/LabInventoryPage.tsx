import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  FlaskConical,
  Package,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

const inventory = [
  {
    id: "i1",
    name: "Beakers (250ml)",
    category: "Equipment" as const,
    unit: "pieces",
    quantity: 45,
    minQuantity: 20,
    location: "Lab 1",
    lastChecked: "2024-11-10",
  },
  {
    id: "i2",
    name: "Bunsen Burners",
    category: "Equipment" as const,
    unit: "pieces",
    quantity: 12,
    minQuantity: 8,
    location: "Lab 1",
    lastChecked: "2024-11-08",
  },
  {
    id: "i3",
    name: "Microscopes",
    category: "Equipment" as const,
    unit: "pieces",
    quantity: 10,
    minQuantity: 10,
    location: "Lab 2",
    lastChecked: "2024-11-05",
  },
  {
    id: "i4",
    name: "Hydrochloric Acid (HCl)",
    category: "Chemical" as const,
    unit: "litres",
    quantity: 3,
    minQuantity: 5,
    location: "Storage",
    lastChecked: "2024-11-12",
  },
  {
    id: "i5",
    name: "Sodium Hydroxide (NaOH)",
    category: "Chemical" as const,
    unit: "kg",
    quantity: 2,
    minQuantity: 4,
    location: "Storage",
    lastChecked: "2024-11-12",
  },
  {
    id: "i6",
    name: "Test Tubes",
    category: "Equipment" as const,
    unit: "pieces",
    quantity: 120,
    minQuantity: 60,
    location: "Lab 1",
    lastChecked: "2024-11-11",
  },
  {
    id: "i7",
    name: "Safety Goggles",
    category: "Consumable" as const,
    unit: "pairs",
    quantity: 8,
    minQuantity: 15,
    location: "Lab 1",
    lastChecked: "2024-11-09",
  },
  {
    id: "i8",
    name: "pH Paper",
    category: "Consumable" as const,
    unit: "packs",
    quantity: 5,
    minQuantity: 10,
    location: "Storage",
    lastChecked: "2024-11-10",
  },
  {
    id: "i9",
    name: "Centrifuge Machine",
    category: "Equipment" as const,
    unit: "pieces",
    quantity: 2,
    minQuantity: 2,
    location: "Lab 2",
    lastChecked: "2024-10-30",
  },
  {
    id: "i10",
    name: "Ethanol (95%)",
    category: "Chemical" as const,
    unit: "litres",
    quantity: 0,
    minQuantity: 3,
    location: "Storage",
    lastChecked: "2024-11-01",
  },
  {
    id: "i11",
    name: "Distilled Water",
    category: "Chemical" as const,
    unit: "litres",
    quantity: 50,
    minQuantity: 20,
    location: "Lab 2",
    lastChecked: "2024-11-13",
  },
  {
    id: "i12",
    name: "Latex Gloves",
    category: "Consumable" as const,
    unit: "boxes",
    quantity: 3,
    minQuantity: 6,
    location: "Lab 1",
    lastChecked: "2024-11-10",
  },
];

const catColor: Record<string, string> = {
  Equipment: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Chemical: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  Consumable: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
};

function getStatus(item: (typeof inventory)[0]) {
  if (item.quantity === 0) return "out";
  if (item.quantity < item.minQuantity) return "low";
  return "ok";
}

export function LabInventoryPage() {
  const outOfStock = inventory.filter((i) => i.quantity === 0).length;
  const lowStock = inventory.filter(
    (i) => i.quantity > 0 && i.quantity < i.minQuantity,
  ).length;

  return (
    <div className="space-y-6" data-ocid="lab-inventory.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lab Inventory</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Equipment, chemicals, and consumables tracking
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Items",
            value: inventory.length,
            icon: Package,
            color: "text-blue-500",
          },
          {
            label: "Low Stock",
            value: lowStock,
            icon: AlertTriangle,
            color: "text-orange-500",
          },
          {
            label: "Out of Stock",
            value: outOfStock,
            icon: ShieldAlert,
            color: "text-red-500",
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

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="bg-muted/50">
              {[
                "Item Name",
                "Category",
                "Qty",
                "Min Qty",
                "Unit",
                "Location",
                "Status",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-muted-foreground font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, idx) => {
              const status = getStatus(item);
              return (
                <tr
                  key={item.id}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                  data-ocid={`lab-inventory.item.${idx + 1}`}
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 text-muted-foreground" />
                      {item.name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${catColor[item.category]}`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 font-semibold ${status !== "ok" ? "text-red-500" : "text-foreground"}`}
                  >
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.minQuantity}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.unit}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.location}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={status === "ok" ? "default" : "destructive"}
                    >
                      {status === "out"
                        ? "Out of Stock"
                        : status === "low"
                          ? "Low Stock"
                          : "In Stock"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {status !== "ok" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-orange-600 border-orange-300"
                        onClick={() =>
                          toast.success(`Restock request sent for ${item.name}`)
                        }
                        data-ocid={`lab-inventory.secondary_button.${idx + 1}`}
                      >
                        Request Restock
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
