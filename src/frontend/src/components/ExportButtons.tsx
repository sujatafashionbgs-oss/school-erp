import { Button } from "@/components/ui/button";
import { FileDown, FileSpreadsheet, Printer } from "lucide-react";

interface ExportButtonsProps {
  title: string;
  data?: Record<string, unknown>[];
}

export function ExportButtons({ title, data }: ExportButtonsProps) {
  const handleExcelExport = () => {
    const filename = `${title.replace(/\s+/g, "_")}.csv`;
    if (!data || data.length === 0) {
      const blob = new Blob([`${title}\nNo data available`], {
        type: "text/csv",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    const headers = Object.keys(data[0]).join(",");
    const rows = data
      .map((row) =>
        Object.values(row)
          .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    const csvString = `${headers}\n${rows}`;
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.print()}
        data-ocid="export.print_button"
      >
        <Printer size={14} className="mr-1.5" /> Print
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.print()}
        data-ocid="export.pdf_button"
      >
        <FileDown size={14} className="mr-1.5" /> Export PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExcelExport}
        data-ocid="export.excel_button"
      >
        <FileSpreadsheet size={14} className="mr-1.5" /> Export Excel
      </Button>
    </div>
  );
}
