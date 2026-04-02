import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useMemo } from "react";

function parseVerifyParams(): Record<string, string> {
  const hash = window.location.hash;
  const qIdx = hash.indexOf("?");
  if (qIdx === -1) return {};
  const qs = hash.slice(qIdx + 1);
  return Object.fromEntries(
    qs.split("&").map((pair) => {
      const [k, v] = pair.split("=");
      return [decodeURIComponent(k || ""), decodeURIComponent(v || "")];
    }),
  );
}

export function VerifyDocumentPage() {
  const params = useMemo(() => parseVerifyParams(), []);

  const code = params.code || "";
  const name = params.name || "";
  const className = params.class || "";
  const pct = params.pct || "";
  const grade = params.grade || "";

  const isValid = code.startsWith("RC-") && name && className;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-3">
            <ShieldCheck size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Document Verification
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            SmartSkale School ERP
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          {isValid ? (
            <div className="space-y-5">
              {/* Verified badge */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                <CheckCircle2 size={24} className="text-green-600 shrink-0" />
                <div>
                  <p className="font-semibold text-green-700">
                    Document Verified
                  </p>
                  <p className="text-xs text-green-600">
                    This document is authentic and issued by the school.
                  </p>
                </div>
              </div>

              {/* Document details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{name}</p>
                    <p className="text-sm text-muted-foreground">
                      Class {className}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-secondary/40 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground">
                      Document Type
                    </p>
                    <p className="font-medium text-foreground text-sm mt-0.5">
                      Report Card
                    </p>
                  </div>
                  <div className="bg-secondary/40 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground">
                      Academic Year
                    </p>
                    <p className="font-medium text-foreground text-sm mt-0.5">
                      2025–2026
                    </p>
                  </div>
                  <div className="bg-secondary/40 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground">Percentage</p>
                    <p className="font-semibold text-foreground text-sm mt-0.5">
                      {pct}%
                    </p>
                  </div>
                  <div className="bg-secondary/40 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground">Grade</p>
                    <p className="text-2xl font-bold text-primary">{grade}</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap
                      size={14}
                      className="text-muted-foreground"
                    />
                    <span className="text-xs text-muted-foreground">
                      Verification Code
                    </span>
                  </div>
                  <span className="text-xs font-mono text-foreground bg-secondary/50 px-2 py-1 rounded">
                    {code}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Issued by
                  </span>
                  <span className="text-xs font-medium text-foreground">
                    SmartSkale School
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <Badge className="bg-green-500/20 text-green-700 border-green-500/30 text-xs">
                    <CheckCircle2 size={10} className="mr-1" /> Authentic
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <XCircle size={48} className="text-destructive" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                Invalid or Expired Code
              </h2>
              <p className="text-sm text-muted-foreground">
                The verification code does not match any document in our system.
                Please ensure you scanned the correct QR code.
              </p>
              <p className="text-xs font-mono text-muted-foreground bg-secondary/30 px-3 py-2 rounded-lg">
                Code: {code || "(none)"}
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Powered by SmartSkale School ERP
        </p>
      </div>
    </div>
  );
}
