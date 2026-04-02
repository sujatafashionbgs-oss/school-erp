import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

interface Props {
  navigate: (path: string) => void;
}

export function NotFoundPage({ navigate }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <GraduationCap
          size={48}
          className="text-muted-foreground mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <p className="text-muted-foreground mb-6">Page not found</p>
        <Button
          onClick={() => navigate("/login")}
          data-ocid="not_found.home.button"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}
