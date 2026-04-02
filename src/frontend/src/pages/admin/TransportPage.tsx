import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bus, MapPin, Pencil, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Route = {
  id: number;
  name: string;
  driver: string;
  vehicle: string;
  students: number;
  stops: string[];
};

const initialRoutes: Route[] = [
  {
    id: 1,
    name: "Route 1 - Boring Road",
    driver: "Raju Singh",
    vehicle: "UP32-AB-1234",
    students: 28,
    stops: ["Gandhi Maidan", "Boring Road", "Patliputra"],
  },
  {
    id: 2,
    name: "Route 2 - Kankarbagh",
    driver: "Mohan Das",
    vehicle: "UP32-CD-5678",
    students: 22,
    stops: ["Kankarbagh", "Rajendra Nagar", "Anisabad"],
  },
  {
    id: 3,
    name: "Route 3 - Danapur",
    driver: "Suresh Pal",
    vehicle: "UP32-EF-9012",
    students: 18,
    stops: ["Danapur", "Khagaul", "Patna Sahib"],
  },
];

const emptyForm = { name: "", driver: "", vehicle: "", stops: "" };

export function TransportPage() {
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  function openAdd() {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(route: Route) {
    setEditId(route.id);
    setForm({
      name: route.name,
      driver: route.driver,
      vehicle: route.vehicle,
      stops: route.stops.join(", "),
    });
    setDialogOpen(true);
  }

  function handleSubmit() {
    if (!form.name || !form.driver || !form.vehicle) {
      toast.error("Please fill all required fields");
      return;
    }
    const stops = form.stops
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (editId !== null) {
      setRoutes((prev) =>
        prev.map((r) =>
          r.id === editId
            ? {
                ...r,
                name: form.name,
                driver: form.driver,
                vehicle: form.vehicle,
                stops,
              }
            : r,
        ),
      );
      toast.success("Route updated successfully!");
    } else {
      const newRoute: Route = {
        id: Date.now(),
        name: form.name,
        driver: form.driver,
        vehicle: form.vehicle,
        students: 0,
        stops,
      };
      setRoutes((prev) => [...prev, newRoute]);
      toast.success("Route added successfully!");
    }
    setDialogOpen(false);
  }

  function handleDelete(id: number, name: string) {
    if (window.confirm(`Delete route "${name}"?`)) {
      setRoutes((prev) => prev.filter((r) => r.id !== id));
      toast.success("Route deleted.");
    }
  }

  return (
    <div className="space-y-5" data-ocid="transport.page">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Transport Management
        </h1>
        <Button onClick={openAdd} data-ocid="transport.add.button">
          <Plus size={16} className="mr-1" /> Add Route
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {routes.map((r, i) => (
          <div
            key={r.id}
            className="bg-card border border-border rounded-2xl p-5"
            data-ocid={`transport.item.${i + 1}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center">
                  <Bus size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {r.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{r.vehicle}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => openEdit(r)}
                  data-ocid={`transport.edit_button.${i + 1}`}
                >
                  <Pencil size={13} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(r.id, r.name)}
                  data-ocid={`transport.delete_button.${i + 1}`}
                >
                  <Trash2 size={13} />
                </Button>
              </div>
            </div>
            <div className="space-y-1.5 text-sm">
              <p className="text-muted-foreground">
                Driver: <span className="text-foreground">{r.driver}</span>
              </p>
              <p className="text-muted-foreground flex items-center gap-1">
                <Users size={12} /> {r.students} students
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {r.stops.map((s) => (
                  <Badge key={s} variant="outline" className="text-xs">
                    <MapPin size={10} className="mr-1" />
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-ocid="transport.dialog">
          <DialogHeader>
            <DialogTitle>
              {editId !== null ? "Edit Route" : "Add New Route"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Route Name</Label>
              <Input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Route 4 - Ashiana"
                data-ocid="transport.name.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Driver Name</Label>
                <Input
                  value={form.driver}
                  onChange={(e) => update("driver", e.target.value)}
                  placeholder="Driver name"
                  data-ocid="transport.driver.input"
                />
              </div>
              <div className="space-y-1">
                <Label>Vehicle Number</Label>
                <Input
                  value={form.vehicle}
                  onChange={(e) => update("vehicle", e.target.value)}
                  placeholder="e.g. UP32-XY-1234"
                  data-ocid="transport.vehicle.input"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Stops (comma-separated)</Label>
              <Textarea
                value={form.stops}
                onChange={(e) => update("stops", e.target.value)}
                placeholder="Stop 1, Stop 2, Stop 3"
                rows={3}
                data-ocid="transport.stops.textarea"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="transport.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} data-ocid="transport.submit_button">
              {editId !== null ? "Save Changes" : "Add Route"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
