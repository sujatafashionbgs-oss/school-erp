import { cn } from "@/lib/utils";
import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  navigate: (path: string) => void;
  currentPath: string;
  breadcrumbs?: { label: string }[];
}

export function Layout({
  children,
  navigate,
  currentPath,
  breadcrumbs,
}: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        navigate={navigate}
        currentPath={currentPath}
      />
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          collapsed ? "ml-16" : "ml-64",
        )}
      >
        <Header breadcrumbs={breadcrumbs} navigate={navigate} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
