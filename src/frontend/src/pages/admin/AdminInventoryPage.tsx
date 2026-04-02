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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  CheckCircle,
  Package,
  Pencil,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  supplier: string;
  unitPrice: number;
  status: "OK" | "Low Stock" | "Out of Stock";
}

const initialStock: StockItem[] = [
  {
    id: "1",
    name: "A4 Copy Paper (Ream)",
    category: "Stationery",
    quantity: 45,
    reorderLevel: 20,
    supplier: "Ratan Stationers",
    unitPrice: 350,
    status: "OK",
  },
  {
    id: "2",
    name: "Whiteboard Markers (Box)",
    category: "Stationery",
    quantity: 8,
    reorderLevel: 10,
    supplier: "Ratan Stationers",
    unitPrice: 120,
    status: "Low Stock",
  },
  {
    id: "3",
    name: "Bunsen Burner",
    category: "Lab Equipment",
    quantity: 12,
    reorderLevel: 5,
    supplier: "LabCo India",
    unitPrice: 1800,
    status: "OK",
  },
  {
    id: "4",
    name: "Microscope (Compound)",
    category: "Lab Equipment",
    quantity: 3,
    reorderLevel: 5,
    supplier: "LabCo India",
    unitPrice: 8500,
    status: "Low Stock",
  },
  {
    id: "5",
    name: "Football",
    category: "Sports",
    quantity: 6,
    reorderLevel: 4,
    supplier: "Sports World",
    unitPrice: 650,
    status: "OK",
  },
  {
    id: "6",
    name: "Badminton Racket",
    category: "Sports",
    quantity: 2,
    reorderLevel: 6,
    supplier: "Sports World",
    unitPrice: 450,
    status: "Low Stock",
  },
  {
    id: "7",
    name: "Student Chair",
    category: "Furniture",
    quantity: 60,
    reorderLevel: 20,
    supplier: "Furniture Hub",
    unitPrice: 1200,
    status: "OK",
  },
  {
    id: "8",
    name: "Classroom Blackboard",
    category: "Furniture",
    quantity: 0,
    reorderLevel: 2,
    supplier: "Furniture Hub",
    unitPrice: 3500,
    status: "Out of Stock",
  },
  {
    id: "9",
    name: "Printer Ink Cartridge",
    category: "Electronics",
    quantity: 4,
    reorderLevel: 5,
    supplier: "TechMart",
    unitPrice: 980,
    status: "Low Stock",
  },
  {
    id: "10",
    name: "Extension Cord (5m)",
    category: "Electronics",
    quantity: 18,
    reorderLevel: 5,
    supplier: "TechMart",
    unitPrice: 350,
    status: "OK",
  },
  {
    id: "11",
    name: "Broom & Dustpan Set",
    category: "Housekeeping",
    quantity: 15,
    reorderLevel: 8,
    supplier: "Clean Supplies",
    unitPrice: 180,
    status: "OK",
  },
  {
    id: "12",
    name: "Liquid Soap (500ml)",
    category: "Housekeeping",
    quantity: 3,
    reorderLevel: 10,
    supplier: "Clean Supplies",
    unitPrice: 90,
    status: "Low Stock",
  },
  {
    id: "13",
    name: "Chalk Box (White)",
    category: "Stationery",
    quantity: 25,
    reorderLevel: 15,
    supplier: "Ratan Stationers",
    unitPrice: 45,
    status: "OK",
  },
  {
    id: "14",
    name: "Cricket Bat",
    category: "Sports",
    quantity: 5,
    reorderLevel: 4,
    supplier: "Sports World",
    unitPrice: 1200,
    status: "OK",
  },
  {
    id: "15",
    name: "Projector Screen",
    category: "Electronics",
    quantity: 1,
    reorderLevel: 2,
    supplier: "TechMart",
    unitPrice: 4500,
    status: "Low Stock",
  },
];

const mockPOs = [
  {
    id: "PO001",
    supplier: "Ratan Stationers",
    items: "A4 Paper, Markers, Chalk",
    amount: 8500,
    date: "2026-03-20",
    status: "Pending",
  },
  {
    id: "PO002",
    supplier: "LabCo India",
    items: "Microscopes x5",
    amount: 42500,
    date: "2026-03-18",
    status: "Approved",
  },
  {
    id: "PO003",
    supplier: "Sports World",
    items: "Rackets, Football",
    amount: 6200,
    date: "2026-03-15",
    status: "Delivered",
  },
  {
    id: "PO004",
    supplier: "TechMart",
    items: "Ink Cartridges, Cables",
    amount: 12000,
    date: "2026-03-10",
    status: "Delivered",
  },
  {
    id: "PO005",
    supplier: "Furniture Hub",
    items: "10 Student Chairs",
    amount: 12000,
    date: "2026-03-25",
    status: "Pending",
  },
  {
    id: "PO006",
    supplier: "Clean Supplies",
    items: "Liquid Soap x20, Brooms x5",
    amount: 2700,
    date: "2026-03-28",
    status: "Approved",
  },
];

const mockIssues = [
  {
    id: "1",
    item: "A4 Copy Paper",
    qty: 10,
    dept: "Administration",
    issueDate: "2026-03-25",
    returnDate: "N/A",
    status: "Issued",
  },
  {
    id: "2",
    item: "Badminton Racket",
    qty: 4,
    dept: "Sports Dept",
    issueDate: "2026-03-20",
    returnDate: "2026-04-20",
    status: "Issued",
  },
  {
    id: "3",
    item: "Bunsen Burner",
    qty: 2,
    dept: "Chemistry Lab",
    issueDate: "2026-03-15",
    returnDate: "2026-03-30",
    status: "Returned",
  },
  {
    id: "4",
    item: "Football",
    qty: 2,
    dept: "Sports Dept",
    issueDate: "2026-03-10",
    returnDate: "2026-04-10",
    status: "Issued",
  },
  {
    id: "5",
    item: "Printer Ink",
    qty: 2,
    dept: "Office",
    issueDate: "2026-03-08",
    returnDate: "N/A",
    status: "Issued",
  },
  {
    id: "6",
    item: "Extension Cord",
    qty: 3,
    dept: "IT Lab",
    issueDate: "2026-03-05",
    returnDate: "2026-04-05",
    status: "Issued",
  },
  {
    id: "7",
    item: "Whiteboard Markers",
    qty: 5,
    dept: "Class Rooms",
    issueDate: "2026-03-01",
    returnDate: "N/A",
    status: "Issued",
  },
  {
    id: "8",
    item: "Microscope",
    qty: 3,
    dept: "Biology Lab",
    issueDate: "2026-02-28",
    returnDate: "2026-03-28",
    status: "Returned",
  },
];

export function AdminInventoryPage() {
  const [stock, setStock] = useState<StockItem[]>(initialStock);
  const [editItem, setEditItem] = useState<StockItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
    reorderLevel: "",
    supplier: "",
    unitPrice: "",
  });

  const lowStockCount = stock.filter(
    (s) => s.status === "Low Stock" || s.status === "Out of Stock",
  ).length;

  const statusBadge = (s: string) => {
    if (s === "OK")
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 gap-1">
          <CheckCircle size={11} />
          OK
        </Badge>
      );
    if (s === "Low Stock")
      return (
        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 gap-1">
          <AlertTriangle size={11} />
          Low Stock
        </Badge>
      );
    return (
      <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 gap-1">
        <AlertTriangle size={11} />
        Out of Stock
      </Badge>
    );
  };

  const poBadge = (s: string) => {
    if (s === "Delivered")
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
          {s}
        </Badge>
      );
    if (s === "Approved")
      return (
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
          {s}
        </Badge>
      );
    return (
      <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
        {s}
      </Badge>
    );
  };

  const handleSaveEdit = () => {
    if (!editItem) return;
    setStock((prev) =>
      prev.map((s) =>
        s.id === editItem.id
          ? {
              ...editItem,
              status:
                editItem.quantity <= 0
                  ? "Out of Stock"
                  : editItem.quantity <= editItem.reorderLevel
                    ? "Low Stock"
                    : "OK",
            }
          : s,
      ),
    );
    setEditItem(null);
    toast.success("Item updated");
  };

  const handleAdd = () => {
    if (!newItem.name || !newItem.category) {
      toast.error("Name and category required");
      return;
    }
    const qty = Number(newItem.quantity);
    const rl = Number(newItem.reorderLevel);
    const item: StockItem = {
      id: String(Date.now()),
      name: newItem.name,
      category: newItem.category,
      quantity: qty,
      reorderLevel: rl,
      supplier: newItem.supplier,
      unitPrice: Number(newItem.unitPrice),
      status: qty <= 0 ? "Out of Stock" : qty <= rl ? "Low Stock" : "OK",
    };
    setStock((prev) => [item, ...prev]);
    setAddOpen(false);
    setNewItem({
      name: "",
      category: "",
      quantity: "",
      reorderLevel: "",
      supplier: "",
      unitPrice: "",
    });
    toast.success("Item added");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground text-sm">
            Track stock, purchase orders, and department issues
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Items",
            value: stock.length,
            icon: <Package size={18} />,
            color: "text-blue-500",
          },
          {
            label: "Low Stock / Out",
            value: lowStockCount,
            icon: <AlertTriangle size={18} />,
            color: "text-red-500",
          },
          {
            label: "Purchase Orders",
            value: mockPOs.length,
            icon: <ShoppingCart size={18} />,
            color: "text-yellow-500",
          },
          {
            label: "Departments",
            value: 6,
            icon: <Package size={18} />,
            color: "text-green-500",
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

      <Tabs defaultValue="stock">
        <TabsList>
          <TabsTrigger value="stock">
            Stock Items{" "}
            <Badge className="ml-2 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
              {lowStockCount} low
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="po">Purchase Orders</TabsTrigger>
          <TabsTrigger value="issues">Issue Tracker</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => setAddOpen(true)}
              data-ocid="inventory.add.button"
            >
              <Plus size={14} className="mr-2" /> Add Item
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Reorder Level</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stock.map((item, i) => (
                  <TableRow
                    key={item.id}
                    data-ocid={`inventory.item.${i + 1}`}
                    className={
                      item.status !== "OK"
                        ? "border-l-2 border-l-yellow-400 dark:border-l-yellow-600"
                        : ""
                    }
                  >
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.reorderLevel}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>₹{item.unitPrice}</TableCell>
                    <TableCell>{statusBadge(item.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => setEditItem({ ...item })}
                          data-ocid={`inventory.edit_button.${i + 1}`}
                        >
                          <Pencil size={12} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-destructive"
                          onClick={() => setDeleteId(item.id)}
                          data-ocid={`inventory.delete_button.${i + 1}`}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="po" className="mt-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPOs.map((po, i) => (
                  <TableRow
                    key={po.id}
                    data-ocid={`inventory.po.item.${i + 1}`}
                  >
                    <TableCell className="font-mono">{po.id}</TableCell>
                    <TableCell>{po.supplier}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {po.items}
                    </TableCell>
                    <TableCell>₹{po.amount.toLocaleString()}</TableCell>
                    <TableCell>{po.date}</TableCell>
                    <TableCell>{poBadge(po.status)}</TableCell>
                    <TableCell>
                      {po.status === "Pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => toast.success(`PO ${po.id} approved`)}
                          data-ocid={`inventory.po.approve.button.${i + 1}`}
                        >
                          Approve
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="mt-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty Issued</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockIssues.map((issue, i) => (
                  <TableRow
                    key={issue.id}
                    data-ocid={`inventory.issue.item.${i + 1}`}
                  >
                    <TableCell className="font-medium">{issue.item}</TableCell>
                    <TableCell>{issue.qty}</TableCell>
                    <TableCell>{issue.dept}</TableCell>
                    <TableCell>{issue.issueDate}</TableCell>
                    <TableCell>{issue.returnDate}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          issue.status === "Returned"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        }
                      >
                        {issue.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      {editItem && (
        <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
          <DialogContent data-ocid="inventory.edit.dialog">
            <DialogHeader>
              <DialogTitle>Edit Stock Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div className="grid gap-1">
                <Label>Item Name</Label>
                <Input
                  value={editItem.name}
                  onChange={(e) =>
                    setEditItem((p) => (p ? { ...p, name: e.target.value } : p))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={editItem.quantity}
                    onChange={(e) =>
                      setEditItem((p) =>
                        p ? { ...p, quantity: Number(e.target.value) } : p,
                      )
                    }
                  />
                </div>
                <div className="grid gap-1">
                  <Label>Reorder Level</Label>
                  <Input
                    type="number"
                    value={editItem.reorderLevel}
                    onChange={(e) =>
                      setEditItem((p) =>
                        p ? { ...p, reorderLevel: Number(e.target.value) } : p,
                      )
                    }
                  />
                </div>
              </div>
              <div className="grid gap-1">
                <Label>Supplier</Label>
                <Input
                  value={editItem.supplier}
                  onChange={(e) =>
                    setEditItem((p) =>
                      p ? { ...p, supplier: e.target.value } : p,
                    )
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditItem(null)}
                data-ocid="inventory.edit.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                data-ocid="inventory.edit.save_button"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent data-ocid="inventory.add.dialog">
          <DialogHeader>
            <DialogTitle>Add Stock Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            {(
              [
                { label: "Item Name *", key: "name" },
                { label: "Category *", key: "category" },
                { label: "Quantity", key: "quantity" },
                { label: "Reorder Level", key: "reorderLevel" },
                { label: "Supplier", key: "supplier" },
                { label: "Unit Price (₹)", key: "unitPrice" },
              ] as { label: string; key: keyof typeof newItem }[]
            ).map(({ label, key }) => (
              <div key={key} className="grid gap-1">
                <Label>{label}</Label>
                <Input
                  value={newItem[key]}
                  onChange={(e) =>
                    setNewItem((p) => ({ ...p, [key]: e.target.value }))
                  }
                  type={
                    ["quantity", "reorderLevel", "unitPrice"].includes(key)
                      ? "number"
                      : "text"
                  }
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              data-ocid="inventory.add.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={handleAdd} data-ocid="inventory.add.save_button">
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent data-ocid="inventory.delete.dialog">
          <DialogHeader>
            <DialogTitle>Remove Item?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              data-ocid="inventory.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setStock((p) => p.filter((i) => i.id !== deleteId));
                setDeleteId(null);
                toast.success("Item removed");
              }}
              data-ocid="inventory.delete.confirm_button"
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
