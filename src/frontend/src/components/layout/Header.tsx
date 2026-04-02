import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Bell, Menu } from "lucide-react";
import { GlobalSearch } from "./GlobalSearch";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface HeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  onMobileMenuToggle?: () => void;
  navigate?: (path: string) => void;
}

export function Header({
  breadcrumbs = [],
  onMobileMenuToggle,
  navigate,
}: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-card border-b border-border flex items-center px-4 md:px-6 gap-4 sticky top-0 z-30">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMobileMenuToggle}
        data-ocid="header.mobile_menu.button"
      >
        <Menu size={20} />
      </Button>

      <div className="flex items-center gap-1 text-sm text-muted-foreground min-w-0 flex-shrink">
        {breadcrumbs.map((b, i) => (
          <span key={b.label} className="flex items-center gap-1">
            {i > 0 && <span className="text-border">/</span>}
            <span
              className={
                i === breadcrumbs.length - 1
                  ? "text-foreground font-semibold"
                  : ""
              }
            >
              {b.label}
            </span>
          </span>
        ))}
      </div>

      <div className="flex-1 flex justify-center">
        <GlobalSearch navigate={navigate ?? (() => {})} />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          data-ocid="header.notifications.button"
        >
          <Bell size={20} />
          <Badge className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center p-0 text-[10px]">
            3
          </Badge>
        </Button>
        <div className="hidden md:flex items-center gap-2 text-sm">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-xs">
            {user?.name.charAt(0)}
          </div>
          <span className="text-sm font-medium text-foreground">
            {user?.name}
          </span>
        </div>
      </div>
    </header>
  );
}
