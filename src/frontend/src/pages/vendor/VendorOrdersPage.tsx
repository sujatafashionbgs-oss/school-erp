import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

const orders = [
  {
    id: "PO-001",
    item: "A4 Paper Ream",
    category: "Stationery",
    qty: 100,
    unitPrice: 250,
    total: 25000,
    status: "Delivered",
    date: "2024-11-01",
  },
  {
    id: "PO-002",
    item: "Whiteboard Marker Set",
    category: "Stationery",
    qty: 50,
    unitPrice: 120,
    total: 6000,
    status: "Delivered",
    date: "2024-11-05",
  },
  {
    id: "PO-003",
    item: "Student Desks",
    category: "Furniture",
    qty: 20,
    unitPrice: 2500,
    total: 50000,
    status: "Approved",
    date: "2024-11-10",
  },
  {
    id: "PO-004",
    item: "Chemistry Lab Glassware",
    category: "Lab Equipment",
    qty: 10,
    unitPrice: 3500,
    total: 35000,
    status: "Pending",
    date: "2024-11-15",
  },
  {
    id: "PO-005",
    item: "Football",
    category: "Sports",
    qty: 5,
    unitPrice: 800,
    total: 4000,
    status: "Approved",
    date: "2024-11-18",
  },
  {
    id: "PO-006",
    item: "Printer Toner",
    category: "Stationery",
    qty: 10,
    unitPrice: 1200,
    total: 12000,
    status: "Delivered",
    date: "2024-11-20",
  },
  {
    id: "PO-007",
    item: "Science Lab Microscopes",
    category: "Lab Equipment",
    qty: 5,
    unitPrice: 8000,
    total: 40000,
    status: "Pending",
    date: "2024-11-22",
  },
  {
    id: "PO-008",
    item: "Teachers' Chairs",
    category: "Furniture",
    qty: 10,
    unitPrice: 1800,
    total: 18000,
    status: "Rejected",
    date: "2024-11-25",
  },
];

const statusVariant = (s: string) =>
  s === "Delivered"
    ? "default"
    : s === "Approved"
      ? "secondary"
      : s === "Pending"
        ? "outline"
        : "destructive";

export function VendorOrdersPage() {
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    approved: orders.filter((o) => o.status === "Approved").length,
    totalValue: orders.reduce((a, o) => a + o.total, 0),
  };

  return (
    <div className="space-y-5" data-ocid="vendor_orders.page">
      <h1 className="text-2xl font-bold text-foreground">Purchase Orders</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Orders",
            value: stats.total,
            color: "text-foreground",
          },
          { label: "Pending", value: stats.pending, color: "text-orange-600" },
          { label: "Approved", value: stats.approved, color: "text-green-600" },
          {
            label: "Total Value",
            value: `₹${(stats.totalValue / 1000).toFixed(0)}k`,
            color: "text-primary",
          },
        ].map((s, i) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-2xl p-5"
            data-ocid={`vendor_orders.stat.${i + 1}`}
          >
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" data-ocid="vendor_orders.table">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                {[
                  "Order ID",
                  "Item",
                  "Category",
                  "Qty",
                  "Unit Price",
                  "Total",
                  "Status",
                  "Date",
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
              {orders.map((o, i) => (
                <tr
                  key={o.id}
                  className="border-b border-border hover:bg-secondary/30"
                  data-ocid={`vendor_orders.item.${i + 1}`}
                >
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                    {o.id}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {o.item}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {o.category}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{o.qty}</td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    ₹{o.unitPrice}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-foreground">
                    ₹{o.total.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={statusVariant(o.status) as any}
                      className="text-xs"
                    >
                      {o.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {o.date}
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
