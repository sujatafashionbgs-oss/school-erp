import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package } from "lucide-react";

const inventory = [
  {
    id: "INV-001",
    name: "A4 Paper",
    category: "Stationery",
    unit: "Ream",
    stock: 45,
    minStock: 20,
    lastUpdated: "2024-11-25",
  },
  {
    id: "INV-002",
    name: "Whiteboard Markers",
    category: "Stationery",
    unit: "Box",
    stock: 8,
    minStock: 10,
    lastUpdated: "2024-11-20",
  },
  {
    id: "INV-003",
    name: "Student Desks",
    category: "Furniture",
    unit: "Piece",
    stock: 0,
    minStock: 5,
    lastUpdated: "2024-11-10",
  },
  {
    id: "INV-004",
    name: "Lab Glassware Set",
    category: "Lab Equipment",
    unit: "Set",
    stock: 12,
    minStock: 5,
    lastUpdated: "2024-11-15",
  },
  {
    id: "INV-005",
    name: "Footballs",
    category: "Sports",
    unit: "Piece",
    stock: 8,
    minStock: 5,
    lastUpdated: "2024-11-18",
  },
  {
    id: "INV-006",
    name: "Printer Toner",
    category: "Stationery",
    unit: "Cartridge",
    stock: 4,
    minStock: 5,
    lastUpdated: "2024-11-22",
  },
  {
    id: "INV-007",
    name: "Microscopes",
    category: "Lab Equipment",
    unit: "Piece",
    stock: 10,
    minStock: 5,
    lastUpdated: "2024-11-20",
  },
  {
    id: "INV-008",
    name: "Pens",
    category: "Stationery",
    unit: "Box",
    stock: 25,
    minStock: 10,
    lastUpdated: "2024-11-24",
  },
  {
    id: "INV-009",
    name: "Notebooks",
    category: "Stationery",
    unit: "Bundle",
    stock: 60,
    minStock: 30,
    lastUpdated: "2024-11-23",
  },
  {
    id: "INV-010",
    name: "Badminton Rackets",
    category: "Sports",
    unit: "Piece",
    stock: 0,
    minStock: 4,
    lastUpdated: "2024-11-10",
  },
  {
    id: "INV-011",
    name: "Chess Sets",
    category: "Sports",
    unit: "Set",
    stock: 6,
    minStock: 4,
    lastUpdated: "2024-11-15",
  },
  {
    id: "INV-012",
    name: "Lab Chemicals",
    category: "Lab Equipment",
    unit: "Kit",
    stock: 3,
    minStock: 5,
    lastUpdated: "2024-11-20",
  },
];

const getStatus = (stock: number, min: number) =>
  stock === 0 ? "Out of Stock" : stock < min ? "Low Stock" : "In Stock";

const statusStyle = (s: string) =>
  s === "In Stock"
    ? "default"
    : s === "Low Stock"
      ? "secondary"
      : "destructive";

export function VendorInventoryPage() {
  const lowStock = inventory.filter(
    (i) => i.stock > 0 && i.stock < i.minStock,
  ).length;
  const outOfStock = inventory.filter((i) => i.stock === 0).length;

  return (
    <div className="space-y-5" data-ocid="vendor_inventory.page">
      <h1 className="text-2xl font-bold text-foreground">Inventory</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-2xl font-bold text-foreground">
            {inventory.length}
          </p>
          <p className="text-sm text-muted-foreground">Total Items</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-2xl font-bold text-orange-600">{lowStock}</p>
          <p className="text-sm text-muted-foreground">Low Stock</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-2xl font-bold text-destructive">{outOfStock}</p>
          <p className="text-sm text-muted-foreground">Out of Stock</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" data-ocid="vendor_inventory.table">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                {[
                  "Item ID",
                  "Name",
                  "Category",
                  "Unit",
                  "Stock",
                  "Min Stock",
                  "Status",
                  "Last Updated",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, i) => {
                const status = getStatus(item.stock, item.minStock);
                return (
                  <tr
                    key={item.id}
                    className="border-b border-border hover:bg-secondary/30"
                    data-ocid={`vendor_inventory.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                      {item.id}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {item.unit}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-foreground">
                      {item.stock}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {item.minStock}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={statusStyle(status) as any}
                        className="text-xs"
                      >
                        {status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {item.lastUpdated}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
