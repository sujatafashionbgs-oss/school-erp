import { Button } from "@/components/ui/button";
import {
  CLASSES as ALL_CLASSES,
  SECTIONS as ALL_SECTIONS,
} from "@/data/classConfig";
import {
  type ClassConfig,
  loadClassConfig,
  saveClassConfig,
} from "@/hooks/useClassConfig";
import { Settings2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ClassConfigPage() {
  const [config, setConfig] = useState<ClassConfig>(() => loadClassConfig());

  const toggleSection = (cls: string, section: string) => {
    setConfig((prev) => {
      const current = prev[cls] ?? [];
      const next = current.includes(section)
        ? current.filter((s) => s !== section)
        : [...current, section].sort();
      return { ...prev, [cls]: next };
    });
  };

  const handleSave = () => {
    saveClassConfig(config);
    toast.success("Class configuration saved successfully!");
  };

  return (
    <div className="space-y-6" data-ocid="class_config.page">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings2 className="text-primary" size={24} />
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Class & Section Configuration
            </h1>
            <p className="text-sm text-muted-foreground">
              Activate or deactivate sections for each class
            </p>
          </div>
        </div>
        <Button onClick={handleSave} data-ocid="class_config.save.button">
          Save Configuration
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_CLASSES.map((cls, i) => {
          const activeSections = config[cls] ?? [];
          return (
            <div
              key={cls}
              className="bg-card border border-border rounded-2xl p-4"
              data-ocid={`class_config.item.${i + 1}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">
                  {cls.startsWith("Pre-") || cls === "Nursery" || cls === "KG"
                    ? cls
                    : `Class ${cls}`}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {activeSections.length} active
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ALL_SECTIONS.map((sec) => {
                  const isActive = activeSections.includes(sec);
                  return (
                    <button
                      type="button"
                      key={sec}
                      onClick={() => toggleSection(cls, sec)}
                      className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                      data-ocid="class_config.section.toggle"
                    >
                      {sec}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <h2 className="font-semibold text-foreground mb-3">
          Configuration Summary
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Total Classes: </span>
            <span className="font-semibold">{ALL_CLASSES.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">
              Total Active Sections:{" "}
            </span>
            <span className="font-semibold">
              {Object.values(config).reduce(
                (sum, secs) => sum + secs.length,
                0,
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
