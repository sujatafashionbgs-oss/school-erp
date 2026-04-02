import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, FlaskConical } from "lucide-react";
import { toast } from "sonner";

const experiments = [
  {
    id: "e1",
    title: "Verification of Ohm's Law",
    subject: "Physics",
    class: "10-A",
    date: "2024-11-18",
    time: "09:00 AM",
    duration: "90 min",
    lab: "Lab 1",
    status: "Completed" as const,
    materials: [
      "Resistors",
      "Ammeter",
      "Voltmeter",
      "Battery",
      "Connecting wires",
    ],
  },
  {
    id: "e2",
    title: "Acid-Base Titration",
    subject: "Chemistry",
    class: "11-Science",
    date: "2024-11-19",
    time: "11:00 AM",
    duration: "120 min",
    lab: "Lab 1",
    status: "Scheduled" as const,
    materials: [
      "Burette",
      "NaOH solution",
      "HCl solution",
      "Phenolphthalein",
      "Conical flask",
    ],
  },
  {
    id: "e3",
    title: "Observation of Onion Cells",
    subject: "Biology",
    class: "9-B",
    date: "2024-11-20",
    time: "10:00 AM",
    duration: "60 min",
    lab: "Lab 2",
    status: "Scheduled" as const,
    materials: [
      "Microscope",
      "Onion",
      "Iodine solution",
      "Glass slides",
      "Cover slips",
    ],
  },
  {
    id: "e4",
    title: "Simple Pendulum Experiment",
    subject: "Physics",
    class: "9-A",
    date: "2024-11-21",
    time: "09:00 AM",
    duration: "90 min",
    lab: "Lab 1",
    status: "Scheduled" as const,
    materials: ["Pendulum bob", "String", "Stopwatch", "Stand"],
  },
  {
    id: "e5",
    title: "Preparation of Iron Sulphide",
    subject: "Chemistry",
    class: "8-A",
    date: "2024-11-15",
    time: "02:00 PM",
    duration: "60 min",
    lab: "Lab 1",
    status: "Completed" as const,
    materials: ["Iron filings", "Sulphur", "Test tube", "Bunsen burner"],
  },
  {
    id: "e6",
    title: "Photosynthesis Demonstration",
    subject: "Biology",
    class: "8-B",
    date: "2024-11-14",
    time: "11:00 AM",
    duration: "90 min",
    lab: "Lab 2",
    status: "Completed" as const,
    materials: ["Aquatic plant", "Beaker", "Funnel", "Test tube", "NaHCO3"],
  },
  {
    id: "e7",
    title: "Magnetic Field Mapping",
    subject: "Physics",
    class: "10-B",
    date: "2024-11-25",
    time: "10:00 AM",
    duration: "60 min",
    lab: "Lab 1",
    status: "Scheduled" as const,
    materials: ["Bar magnet", "Iron filings", "Paper", "Compass"],
  },
  {
    id: "e8",
    title: "Chromatography of Ink",
    subject: "Chemistry",
    class: "10-A",
    date: "2024-11-22",
    time: "02:00 PM",
    duration: "60 min",
    lab: "Lab 2",
    status: "Cancelled" as const,
    materials: ["Filter paper", "Ink samples", "Water", "Beaker"],
  },
];

const subjectColor: Record<string, string> = {
  Physics: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Chemistry: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  Biology: "bg-green-500/10 text-green-600 dark:text-green-400",
};

export function LabExperimentsPage() {
  const completed = experiments.filter((e) => e.status === "Completed").length;
  const upcoming = experiments.filter((e) => e.status === "Scheduled").length;

  return (
    <div className="space-y-6" data-ocid="lab-experiments.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lab Experiments</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Scheduled experiments per class
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total This Month",
            value: experiments.length,
            icon: FlaskConical,
            color: "text-blue-500",
          },
          {
            label: "Completed",
            value: completed,
            icon: CheckCircle,
            color: "text-green-500",
          },
          {
            label: "Upcoming",
            value: upcoming,
            icon: Clock,
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

      {/* Experiment list */}
      <div className="space-y-3">
        {experiments.map((exp, idx) => (
          <div
            key={exp.id}
            className="bg-card border border-border rounded-2xl p-4"
            data-ocid={`lab-experiments.item.${idx + 1}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  <FlaskConical className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{exp.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${subjectColor[exp.subject]}`}
                    >
                      {exp.subject}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Class {exp.class}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {exp.lab}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right text-sm">
                  <p className="text-foreground font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {exp.date}
                  </p>
                  <p className="text-muted-foreground">
                    {exp.time} &bull; {exp.duration}
                  </p>
                </div>
                <Badge
                  variant={
                    exp.status === "Completed"
                      ? "default"
                      : exp.status === "Scheduled"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {exp.status}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    toast.info(`Materials: ${exp.materials.join(", ")}`)
                  }
                  data-ocid={`lab-experiments.secondary_button.${idx + 1}`}
                >
                  View Materials
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
