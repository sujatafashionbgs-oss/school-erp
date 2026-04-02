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
import { AlertTriangle, Bus, CheckCircle, Plus, Wrench } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  busNo: string;
  model: string;
  registrationNo: string;
  capacity: number;
  driver: string;
  driverPhone: string;
  route: string;
  lastService: string;
  nextService: string;
  status: "Active" | "In Maintenance";
}

const initialVehicles: Vehicle[] = [
  {
    id: "v1",
    busNo: "Bus 01",
    model: "Tata Starbus",
    registrationNo: "BR-01-1234",
    capacity: 40,
    driver: "Ram Lal",
    driverPhone: "9876543000",
    route: "Route A (North Zone)",
    lastService: "2024-09-15",
    nextService: "2025-03-15",
    status: "Active",
  },
  {
    id: "v2",
    busNo: "Bus 02",
    model: "Ashok Leyland",
    registrationNo: "BR-01-5678",
    capacity: 45,
    driver: "Shyam Das",
    driverPhone: "9876543001",
    route: "Route B (East Zone)",
    lastService: "2024-10-01",
    nextService: "2025-04-01",
    status: "Active",
  },
  {
    id: "v3",
    busNo: "Bus 03",
    model: "Eicher Skyline",
    registrationNo: "BR-01-9012",
    capacity: 38,
    driver: "Mohan Singh",
    driverPhone: "9876543002",
    route: "Route C (South Zone)",
    lastService: "2024-07-20",
    nextService: "2025-01-20",
    status: "In Maintenance",
  },
];

export function VehicleManagementPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    busNo: "",
    model: "",
    registrationNo: "",
    capacity: "",
    driver: "",
    driverPhone: "",
    route: "",
  });

  const active = vehicles.filter((v) => v.status === "Active").length;
  const maintenance = vehicles.filter(
    (v) => v.status === "In Maintenance",
  ).length;

  const handleAdd = () => {
    if (!form.busNo || !form.driver) {
      toast.error("Bus number and driver are required");
      return;
    }
    const newVehicle: Vehicle = {
      id: `v${Date.now()}`,
      busNo: form.busNo,
      model: form.model,
      registrationNo: form.registrationNo,
      capacity: Number(form.capacity) || 40,
      driver: form.driver,
      driverPhone: form.driverPhone,
      route: form.route,
      lastService: new Date().toISOString().split("T")[0],
      nextService: "",
      status: "Active",
    };
    setVehicles((prev) => [...prev, newVehicle]);
    setForm({
      busNo: "",
      model: "",
      registrationNo: "",
      capacity: "",
      driver: "",
      driverPhone: "",
      route: "",
    });
    setShowAdd(false);
    toast.success(`${form.busNo} added to fleet`);
  };

  return (
    <div className="space-y-6" data-ocid="vehicle-management.page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Vehicle Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Fleet overview and service tracking
          </p>
        </div>
        <Button
          onClick={() => setShowAdd(true)}
          data-ocid="vehicle-management.primary_button"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Vehicle
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Vehicles",
            value: vehicles.length,
            icon: Bus,
            color: "text-blue-500",
          },
          {
            label: "Active",
            value: active,
            icon: CheckCircle,
            color: "text-green-500",
          },
          {
            label: "In Maintenance",
            value: maintenance,
            icon: Wrench,
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

      <div className="space-y-4">
        {vehicles.map((v, idx) => (
          <div
            key={v.id}
            className="bg-card border border-border rounded-2xl p-5"
            data-ocid={`vehicle-management.item.${idx + 1}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <Bus className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{v.busNo}</h3>
                    <Badge
                      variant={v.status === "Active" ? "default" : "secondary"}
                    >
                      {v.status}
                    </Badge>
                    {v.status === "In Maintenance" && (
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {v.model} &bull; {v.registrationNo}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  toast.success(`Service scheduled for ${v.busNo}`)
                }
                data-ocid={`vehicle-management.secondary_button.${idx + 1}`}
              >
                <Wrench className="w-3 h-3 mr-1" /> Schedule Service
              </Button>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Capacity</p>
                <p className="font-medium text-foreground">
                  {v.capacity} seats
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Driver</p>
                <p className="font-medium text-foreground">{v.driver}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Route</p>
                <p className="font-medium text-foreground">{v.route}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Next Service</p>
                <p
                  className={`font-medium ${new Date(v.nextService) < new Date() ? "text-red-500" : "text-foreground"}`}
                >
                  {v.nextService || "—"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent data-ocid="vehicle-management.dialog">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {(
              [
                { key: "busNo", label: "Bus Number" },
                { key: "model", label: "Model" },
                { key: "registrationNo", label: "Registration No." },
                { key: "capacity", label: "Capacity" },
                { key: "driver", label: "Driver Name" },
                { key: "driverPhone", label: "Driver Phone" },
                { key: "route", label: "Assigned Route" },
              ] as const
            ).map((f) => (
              <div key={f.key}>
                <Label>{f.label}</Label>
                <Input
                  value={form[f.key]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [f.key]: e.target.value }))
                  }
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAdd(false)}
              data-ocid="vehicle-management.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              data-ocid="vehicle-management.submit_button"
            >
              Add Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
