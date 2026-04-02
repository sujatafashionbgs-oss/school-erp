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
import { Bus, MapPin, Navigation, Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Route {
  id: string;
  name: string;
  zone: string;
  busNo: string;
  driver: string;
  driverPhone: string;
  stops: string[];
  studentsCount: number;
  status: "Active" | "Inactive";
}

const initialRoutes: Route[] = [
  {
    id: "r1",
    name: "Route A",
    zone: "North Zone",
    busNo: "BR-01-1234",
    driver: "Ram Lal",
    driverPhone: "9876543000",
    stops: ["Rajendra Nagar", "Gandhi Maidan", "Patna Junction"],
    studentsCount: 24,
    status: "Active",
  },
  {
    id: "r2",
    name: "Route B",
    zone: "East Zone",
    busNo: "BR-01-5678",
    driver: "Shyam Das",
    driverPhone: "9876543001",
    stops: ["Kankarbagh", "Boring Road", "Patliputra"],
    studentsCount: 22,
    status: "Active",
  },
  {
    id: "r3",
    name: "Route C",
    zone: "South Zone",
    busNo: "BR-01-9012",
    driver: "Mohan Singh",
    driverPhone: "9876543002",
    stops: ["Danapur", "Phulwari", "Naubatpur"],
    studentsCount: 22,
    status: "Active",
  },
];

export function RouteManagementPage() {
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);
  const [editRoute, setEditRoute] = useState<Route | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: "",
    zone: "",
    busNo: "",
    driver: "",
    driverPhone: "",
  });

  const totalStops = routes.reduce((s, r) => s + r.stops.length, 0);
  const totalStudents = routes.reduce((s, r) => s + r.studentsCount, 0);

  const handleSaveEdit = () => {
    if (!editRoute) return;
    setRoutes((prev) =>
      prev.map((r) =>
        r.id === editRoute.id
          ? {
              ...r,
              name: form.name,
              driver: form.driver,
              driverPhone: form.driverPhone,
            }
          : r,
      ),
    );
    setEditRoute(null);
    toast.success("Route updated successfully");
  };

  const handleAdd = () => {
    if (!form.name || !form.driver) {
      toast.error("Route name and driver are required");
      return;
    }
    const newRoute: Route = {
      id: `r${Date.now()}`,
      name: form.name,
      zone: form.zone,
      busNo: form.busNo,
      driver: form.driver,
      driverPhone: form.driverPhone,
      stops: [],
      studentsCount: 0,
      status: "Active",
    };
    setRoutes((prev) => [...prev, newRoute]);
    setForm({ name: "", zone: "", busNo: "", driver: "", driverPhone: "" });
    setShowAdd(false);
    toast.success(`Route "${form.name}" added`);
  };

  return (
    <div className="space-y-6" data-ocid="route-management.page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Route Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage transport routes and drivers
          </p>
        </div>
        <Button
          onClick={() => {
            setForm({
              name: "",
              zone: "",
              busNo: "",
              driver: "",
              driverPhone: "",
            });
            setShowAdd(true);
          }}
          data-ocid="route-management.primary_button"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Route
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Active Routes",
            value: routes.filter((r) => r.status === "Active").length,
            icon: Navigation,
            color: "text-green-500",
          },
          {
            label: "Total Stops",
            value: totalStops,
            icon: MapPin,
            color: "text-blue-500",
          },
          {
            label: "Students Enrolled",
            value: totalStudents,
            icon: Users,
            color: "text-purple-500",
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {routes.map((route, idx) => (
          <div
            key={route.id}
            className="bg-card border border-border rounded-2xl p-5 space-y-4"
            data-ocid={`route-management.item.${idx + 1}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{route.name}</h3>
                <Badge variant="secondary" className="mt-1">
                  {route.zone}
                </Badge>
              </div>
              <Badge
                variant={route.status === "Active" ? "default" : "secondary"}
              >
                {route.status}
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{route.busNo}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {route.driver} &bull; {route.driverPhone}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {route.studentsCount} students
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Stops</p>
              <div className="flex flex-wrap gap-1">
                {route.stops.map((stop) => (
                  <span
                    key={stop}
                    className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                  >
                    {stop}
                  </span>
                ))}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => {
                setEditRoute(route);
                setForm({
                  name: route.name,
                  zone: route.zone,
                  busNo: route.busNo,
                  driver: route.driver,
                  driverPhone: route.driverPhone,
                });
              }}
              data-ocid={`route-management.edit_button.${idx + 1}`}
            >
              Edit Route
            </Button>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editRoute}
        onOpenChange={(o) => {
          if (!o) setEditRoute(null);
        }}
      >
        <DialogContent data-ocid="route-management.dialog">
          <DialogHeader>
            <DialogTitle>Edit Route</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Route Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Driver Name</Label>
              <Input
                value={form.driver}
                onChange={(e) =>
                  setForm((p) => ({ ...p, driver: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Driver Phone</Label>
              <Input
                value={form.driverPhone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, driverPhone: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditRoute(null)}
              data-ocid="route-management.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              data-ocid="route-management.save_button"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent data-ocid="route-management.dialog">
          <DialogHeader>
            <DialogTitle>Add New Route</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Route Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Zone</Label>
              <Input
                value={form.zone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, zone: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Bus Number</Label>
              <Input
                value={form.busNo}
                onChange={(e) =>
                  setForm((p) => ({ ...p, busNo: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Driver Name</Label>
              <Input
                value={form.driver}
                onChange={(e) =>
                  setForm((p) => ({ ...p, driver: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Driver Phone</Label>
              <Input
                value={form.driverPhone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, driverPhone: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAdd(false)}
              data-ocid="route-management.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              data-ocid="route-management.submit_button"
            >
              Add Route
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
