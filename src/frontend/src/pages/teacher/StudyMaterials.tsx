import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookMarked, Download, FileText, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const materials = [
  {
    id: 1,
    title: "Mathematics Chapter 5 - Quadratic Equations",
    class: "X",
    subject: "Mathematics",
    type: "PDF",
    size: "2.4 MB",
    date: "2024-11-20",
    uploader: "Sunita Devi",
  },
  {
    id: 2,
    title: "Science Notes - Chemical Reactions",
    class: "IX",
    subject: "Science",
    type: "PDF",
    size: "1.8 MB",
    date: "2024-11-18",
    uploader: "Ramesh Tiwari",
  },
  {
    id: 3,
    title: "English Grammar Practice Worksheet",
    class: "VIII",
    subject: "English",
    type: "DOCX",
    size: "520 KB",
    date: "2024-11-15",
    uploader: "Ajay Kumar",
  },
  {
    id: 4,
    title: "History Notes - Mughal Empire",
    class: "VII",
    subject: "Social Studies",
    type: "PDF",
    size: "3.1 MB",
    date: "2024-11-12",
    uploader: "Nandini Sharma",
  },
  {
    id: 5,
    title: "Computer Science - Python Basics",
    class: "XI",
    subject: "Computer",
    type: "PDF",
    size: "4.2 MB",
    date: "2024-11-10",
    uploader: "Vivek Pandey",
  },
  {
    id: 6,
    title: "Hindi Vyakaran Practice",
    class: "VI",
    subject: "Hindi",
    type: "PDF",
    size: "1.2 MB",
    date: "2024-11-08",
    uploader: "Poonam Rani",
  },
];

export function StudyMaterials() {
  const [filter, setFilter] = useState("");
  const uploadRef = useRef<HTMLInputElement>(null);
  const filtered = materials.filter((m) => !filter || m.class === filter);
  const classes = [...new Set(materials.map((m) => m.class))];

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      toast.success("File uploaded successfully!");
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-5" data-ocid="study_materials.page">
      <input
        ref={uploadRef}
        type="file"
        className="hidden"
        onChange={handleFileSelected}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Study Materials</h1>
        <Button
          onClick={() => uploadRef.current?.click()}
          data-ocid="study_materials.upload.button"
        >
          <Upload size={16} className="mr-1" /> Upload
        </Button>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setFilter("")}
          className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${!filter ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-secondary"}`}
        >
          All
        </button>
        {classes.map((c) => (
          <button
            type="button"
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${filter === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-secondary"}`}
            data-ocid="study_materials.class.tab"
          >
            Class {c}
          </button>
        ))}
      </div>
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        data-ocid="study_materials.list"
      >
        {filtered.map((m, i) => (
          <div
            key={m.id}
            className="bg-card border border-border rounded-2xl p-5"
            data-ocid={`study_materials.item.${i + 1}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <FileText size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {m.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Class {m.class} · {m.subject} · {m.size}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {m.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {m.date}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="p-2 hover:bg-secondary rounded-lg"
                onClick={() => toast.success(`Downloading "${m.title}"...`)}
                data-ocid={`study_materials.download_button.${i + 1}`}
              >
                <Download size={16} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
