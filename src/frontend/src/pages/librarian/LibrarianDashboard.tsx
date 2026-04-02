import { BookMarked, BookOpen, TrendingUp, Users } from "lucide-react";

export function LibrarianDashboard() {
  return (
    <div className="space-y-6" data-ocid="librarian_dashboard.page">
      <h1 className="text-2xl font-bold text-foreground">
        Librarian Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Books",
            value: "1,240",
            icon: <BookOpen size={22} />,
            color: "text-blue-600",
            bg: "bg-blue-500/10",
          },
          {
            label: "Issued",
            value: "87",
            icon: <BookMarked size={22} />,
            color: "text-purple-600",
            bg: "bg-purple-500/10",
          },
          {
            label: "Members",
            value: "520",
            icon: <Users size={22} />,
            color: "text-green-600",
            bg: "bg-green-500/10",
          },
          {
            label: "Overdue",
            value: "12",
            icon: <TrendingUp size={22} />,
            color: "text-red-600",
            bg: "bg-red-500/10",
          },
        ].map((c, i) => (
          <div
            key={c.label}
            className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4"
            data-ocid={`librarian_dashboard.stat.${i + 1}`}
          >
            <div className={`${c.bg} ${c.color} p-3 rounded-xl`}>{c.icon}</div>
            <div>
              <p className="text-xl font-bold text-foreground">{c.value}</p>
              <p className="text-sm text-muted-foreground">{c.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
