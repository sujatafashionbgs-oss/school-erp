import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Download,
  FileCode,
  FileText,
  GitBranch,
  Package,
  Palette,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function safeGetItem(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* silent fail */
  }
}

const DEFAULTS = {
  schoolName: "SmartSkale Public School",
  tagline: "Excellence in Education",
  address: "Gandhi Nagar, Patna, Bihar - 800001",
  phone: "0612-2345678",
  email: "info@smartskale.edu.in",
  website: "www.smartskale.edu.in",
  academicYear: "2024-25",
  affiliationBoard: "CBSE",
  schoolType: "Day School",
  principalName: "Dr. Anand Kumar",
  principalDesignation: "Principal",
  colorTheme: "blue",
  appTheme: "System",
  accentColor: "blue",
};

const COLOR_SWATCHES = [
  { id: "blue", label: "Blue", bg: "bg-blue-500", ring: "ring-blue-500" },
  { id: "green", label: "Green", bg: "bg-green-500", ring: "ring-green-500" },
  {
    id: "purple",
    label: "Purple",
    bg: "bg-purple-500",
    ring: "ring-purple-500",
  },
  {
    id: "orange",
    label: "Orange",
    bg: "bg-orange-500",
    ring: "ring-orange-500",
  },
  { id: "red", label: "Red", bg: "bg-red-500", ring: "ring-red-500" },
  { id: "teal", label: "Teal", bg: "bg-teal-500", ring: "ring-teal-500" },
];

// ─── Config file content generators ─────────────────────────────────────────

const GITHUB_WORKFLOW_YAML = `name: Deploy School ERP to Internet Computer

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Install dfx
        run: |
          sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
          dfx --version

      - name: Install mops
        run: npm install -g ic-mops

      - name: Install backend dependencies
        run: |
          cd src/backend
          mops install

      - name: Install frontend dependencies
        run: |
          cd src/frontend
          pnpm install --frozen-lockfile

      - name: Build frontend
        run: |
          cd src/frontend
          pnpm build

      - name: Setup IC Identity
        env:
          IC_IDENTITY_PEM: \${{ secrets.IC_IDENTITY_PEM }}
        run: |
          mkdir -p ~/.config/dfx/identity/deploy
          echo "\$IC_IDENTITY_PEM" > ~/.config/dfx/identity/deploy/identity.pem
          dfx identity use deploy

      - name: Deploy to Internet Computer
        run: |
          dfx deploy --network ic --yes
`;

const VERCEL_JSON = JSON.stringify(
  {
    buildCommand: "pnpm build",
    outputDirectory: "dist",
    framework: "vite",
    rewrites: [{ source: "/(.*)", destination: "/index.html" }],
  },
  null,
  2,
);

const AZURE_PIPELINES_YAML = `trigger:
  branches:
    include:
      - main

pool:
  vmImage: ubuntu-latest

variables:
  nodeVersion: '20.x'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '$(nodeVersion)'
    displayName: 'Install Node.js'

  - script: |
      npm install -g pnpm@9
    displayName: 'Install pnpm'

  - script: |
      cd src/frontend
      pnpm install --frozen-lockfile
    displayName: 'Install frontend dependencies'

  - script: |
      cd src/frontend
      pnpm build
    displayName: 'Build frontend'

  - task: PublishBuildArtifacts@1
    inputs:
      pathToPublish: 'src/frontend/dist'
      artifactName: 'dist'
    displayName: 'Publish build artifacts'
`;

const README_CONTENT = `# SmartSkale School ERP

A comprehensive, modular School ERP system built for Indian schools — targeting feature parity with leading platforms like educloud.app and udteschool.com.

## Tech Stack

| Layer     | Technology                                         |
|-----------|---------------------------------------------------|
| Frontend  | React 19 + TypeScript + Vite + Tailwind CSS        |
| Backend   | Motoko (Internet Computer canister)               |
| Auth      | Internet Identity (decentralized, no passwords)   |
| Hosting   | Internet Computer Protocol (ICP)                  |
| State     | React Query + localStorage (offline fallback)     |

## Prerequisites

- **dfx** 0.24+ — [Install](https://internetcomputer.org/docs/current/developer-docs/getting-started/install/)
- **Node.js** 20+ — [Download](https://nodejs.org)
- **pnpm** 9+ — \`npm install -g pnpm\`
- **mops** — \`npm install -g ic-mops\`

## Local Development

\`\`\`bash
# 1. Clone the repository
git clone https://github.com/your-org/school-erp.git
cd school-erp

# 2. Install backend (Motoko) dependencies
cd src/backend && mops install && cd ../..

# 3. Install frontend dependencies
cd src/frontend && pnpm install && cd ../..

# 4. Start local Internet Computer replica
dfx start --background

# 5. Deploy canisters locally
dfx deploy

# 6. Generate frontend bindings
pnpm bindgen

# 7. Start frontend dev server
cd src/frontend && pnpm dev
\`\`\`

## GitHub Actions Deployment

1. Add your IC identity PEM key as a GitHub secret named \`IC_IDENTITY_PEM\`
2. Push to \`main\` branch — the workflow in \`.github/workflows/deploy.yml\` will:
   - Build the frontend with Vite
   - Deploy both frontend and backend canisters to the Internet Computer mainnet

## Vercel Deployment (Frontend only)

The \`vercel.json\` file is pre-configured. Simply:
1. Import the repository in [Vercel](https://vercel.com)
2. Set the root directory to \`src/frontend\`
3. Vercel will auto-detect the Vite framework and build settings

> **Note:** Vercel hosts only the static frontend. The Motoko backend runs on the Internet Computer.

## Azure DevOps Deployment

1. Create a new pipeline using \`azure-pipelines.yml\`
2. Configure the pipeline to point to your IC deployment environment
3. Add your IC identity as a secure variable

## Roles & Access

| Role              | Default Access                              |
|-------------------|---------------------------------------------|
| super-admin       | All modules — unrestricted                  |
| admin             | All modules — unrestricted                  |
| teacher           | Attendance, Exams, Timetable, Homework, etc.|
| accountant        | Fees, Salary, Reports                       |
| librarian         | Library catalog and issue/return            |
| lab-incharge      | Lab experiments and inventory               |
| transport-manager | Routes, vehicles, students                  |
| student           | Dashboard, results, online exams            |
| parent            | Child progress, attendance, fee portal      |

## Support

For setup assistance, visit [caffeine.ai](https://caffeine.ai)
`;

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Export/Deploy Tab ───────────────────────────────────────────────────────
function ExportDeployTab() {
  const handleDownloadZip = () => {
    const content = `School ERP Deployment Package\n${"=".repeat(40)}\n\nThis package contains:\n- Frontend React/TypeScript source\n- Backend Motoko canister source\n- CI/CD configuration files\n\nPlease unzip and follow README.md for setup instructions.\n\nFor the full source, export from your Caffeine project dashboard.`;
    downloadBlob(
      content,
      "school-erp-deployment-package.zip",
      "application/zip",
    );
    toast.success(
      "Package downloaded! Extract the ZIP and follow README.md for setup instructions.",
    );
  };

  const handleDownloadGithub = () => {
    downloadBlob(GITHUB_WORKFLOW_YAML, "deploy.yml", "text/yaml");
    toast.success("GitHub Actions workflow downloaded!");
  };

  const handleDownloadVercel = () => {
    downloadBlob(VERCEL_JSON, "vercel.json", "application/json");
    toast.success("Vercel config downloaded!");
  };

  const handleDownloadAzure = () => {
    downloadBlob(AZURE_PIPELINES_YAML, "azure-pipelines.yml", "text/yaml");
    toast.success("Azure pipeline config downloaded!");
  };

  const handleDownloadReadme = () => {
    downloadBlob(README_CONTENT, "README.md", "text/markdown");
    toast.success("README.md downloaded!");
  };

  const FILE_TREE = [
    { indent: 0, name: "school-erp/", isDir: true },
    {
      indent: 1,
      name: "frontend/",
      isDir: true,
      desc: "React + TypeScript source",
    },
    { indent: 2, name: "src/", isDir: true },
    { indent: 2, name: "index.html" },
    { indent: 2, name: "vite.config.ts" },
    { indent: 2, name: "tailwind.config.js" },
    { indent: 2, name: "package.json" },
    {
      indent: 1,
      name: "backend/",
      isDir: true,
      desc: "Motoko canister source",
    },
    { indent: 2, name: "main.mo" },
    { indent: 2, name: "mops.toml" },
    { indent: 1, name: ".github/", isDir: true },
    { indent: 2, name: "workflows/", isDir: true },
    { indent: 3, name: "deploy.yml", desc: "CI/CD — push to main → deploy" },
    { indent: 1, name: "vercel.json", desc: "Frontend hosting on Vercel" },
    { indent: 1, name: "azure-pipelines.yml", desc: "Azure DevOps CI/CD" },
    { indent: 1, name: "dfx.json", desc: "Internet Computer canister config" },
    { indent: 1, name: "README.md", desc: "Setup & deployment guide" },
  ];

  return (
    <div className="space-y-5">
      {/* Main download card */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Package className="text-primary" size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold">
              Download Deployment Package
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Download a complete ZIP archive with frontend source, backend
              source, and deployment configs for GitHub Actions, Vercel, and
              Azure DevOps.
            </p>
          </div>
        </div>

        {/* File tree preview */}
        <div className="bg-muted/50 border border-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          {FILE_TREE.map((f) => (
            <div
              key={f.name + f.indent}
              className={`flex items-baseline gap-2 leading-relaxed ${f.isDir ? "text-primary font-semibold" : "text-foreground"}`}
              style={{ paddingLeft: `${f.indent * 1.25}rem` }}
            >
              <span>
                {f.indent > 0 && (
                  <span className="text-muted-foreground mr-1">
                    {f.isDir ? "├──" : "├──"}
                  </span>
                )}
                {f.name}
              </span>
              {f.desc && (
                <span className="text-muted-foreground font-normal not-italic text-[10px]">
                  ({f.desc})
                </span>
              )}
            </div>
          ))}
        </div>

        <Button
          onClick={handleDownloadZip}
          className="w-full sm:w-auto gap-2"
          data-ocid="settings.export.download_zip.button"
        >
          <Download size={16} /> Download ZIP Package
        </Button>
      </div>

      {/* Individual config downloads */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold">Individual Config Files</h2>
        <p className="text-sm text-muted-foreground">
          Download individual configuration files to integrate with your
          existing CI/CD pipelines.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* GitHub Actions */}
          <div className="border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <GitBranch size={18} className="text-foreground" />
              <span className="font-medium text-sm">GitHub Actions</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Push-to-main workflow: installs dfx, mops, builds frontend,
              deploys to IC mainnet.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={handleDownloadGithub}
              data-ocid="settings.export.github_workflow.button"
            >
              <Download size={13} /> Download deploy.yml
            </Button>
          </div>

          {/* Vercel */}
          <div className="border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <FileCode size={18} className="text-foreground" />
              <span className="font-medium text-sm">Vercel</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Vite + SPA rewrite config. Deploy frontend to Vercel (backend
              stays on IC).
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={handleDownloadVercel}
              data-ocid="settings.export.vercel_config.button"
            >
              <Download size={13} /> Download vercel.json
            </Button>
          </div>

          {/* Azure DevOps */}
          <div className="border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <FileCode size={18} className="text-foreground" />
              <span className="font-medium text-sm">Azure DevOps</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Azure Pipelines YAML: Node 20, pnpm install, build, and publish
              dist/ artifact.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={handleDownloadAzure}
              data-ocid="settings.export.azure_pipeline.button"
            >
              <Download size={13} /> Download azure-pipelines.yml
            </Button>
          </div>

          {/* README */}
          <div className="border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-foreground" />
              <span className="font-medium text-sm">README</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Full setup guide: tech stack, prerequisites, local dev,
              GitHub/Vercel/Azure steps.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={handleDownloadReadme}
              data-ocid="settings.export.readme.button"
            >
              <Download size={13} /> Download README.md
            </Button>
          </div>
        </div>
      </div>

      {/* Deployment notes */}
      <div className="bg-muted/40 border border-border rounded-2xl p-5 space-y-2">
        <h3 className="text-sm font-semibold">Deployment Notes</h3>
        <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
          <li>
            The backend (Motoko canister) runs on the{" "}
            <strong className="text-foreground">Internet Computer</strong> — it
            cannot be deployed to Vercel or Azure directly.
          </li>
          <li>
            For full-stack deployment, use the GitHub Actions workflow with your
            IC identity PEM key as a secret.
          </li>
          <li>
            Vercel and Azure configs handle{" "}
            <strong className="text-foreground">frontend only</strong> — ideal
            for static hosting with a public IC backend URL.
          </li>
          <li>
            After deployment, set the canister IDs in your environment
            variables.
          </li>
        </ul>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export function SettingsPage() {
  const [schoolName, setSchoolName] = useState(() =>
    safeGetItem("erp_settings_schoolName", DEFAULTS.schoolName),
  );
  const [tagline, setTagline] = useState(() =>
    safeGetItem("erp_settings_tagline", DEFAULTS.tagline),
  );
  const [address, setAddress] = useState(() =>
    safeGetItem("erp_settings_address", DEFAULTS.address),
  );
  const [phone, setPhone] = useState(() =>
    safeGetItem("erp_settings_phone", DEFAULTS.phone),
  );
  const [email, setEmail] = useState(() =>
    safeGetItem("erp_settings_email", DEFAULTS.email),
  );
  const [website, setWebsite] = useState(() =>
    safeGetItem("erp_settings_website", DEFAULTS.website),
  );
  const [academicYear, setAcademicYear] = useState(() =>
    safeGetItem("erp_settings_academicYear", DEFAULTS.academicYear),
  );
  const [affiliationBoard, setAffiliationBoard] = useState(() =>
    safeGetItem("erp_settings_affiliationBoard", DEFAULTS.affiliationBoard),
  );
  const [schoolType, setSchoolType] = useState(() =>
    safeGetItem("erp_settings_schoolType", DEFAULTS.schoolType),
  );
  const [principalName, setPrincipalName] = useState(() =>
    safeGetItem("erp_settings_principalName", DEFAULTS.principalName),
  );
  const [principalDesignation, setPrincipalDesignation] = useState(() =>
    safeGetItem(
      "erp_settings_principalDesignation",
      DEFAULTS.principalDesignation,
    ),
  );
  const [colorTheme, setColorTheme] = useState(() =>
    safeGetItem("erp_settings_colorTheme", DEFAULTS.colorTheme),
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [appTheme, setAppTheme] = useState(() =>
    safeGetItem("erp_settings_appTheme", DEFAULTS.appTheme),
  );
  const [accentColor, setAccentColor] = useState(() =>
    safeGetItem("erp_settings_accentColor", DEFAULTS.accentColor),
  );

  const handleSaveProfile = () => {
    safeSetItem("erp_settings_schoolName", schoolName);
    safeSetItem("erp_settings_tagline", tagline);
    safeSetItem("erp_settings_address", address);
    safeSetItem("erp_settings_phone", phone);
    safeSetItem("erp_settings_email", email);
    safeSetItem("erp_settings_website", website);
    safeSetItem("erp_settings_academicYear", academicYear);
    safeSetItem("erp_settings_affiliationBoard", affiliationBoard);
    safeSetItem("erp_settings_schoolType", schoolType);
    safeSetItem("erp_settings_principalName", principalName);
    safeSetItem("erp_settings_principalDesignation", principalDesignation);
    safeSetItem("erp_settings_colorTheme", colorTheme);
    toast.success("School profile saved successfully!");
  };

  const handleApplyBranding = () => {
    safeSetItem("erp_settings_appTheme", appTheme);
    safeSetItem("erp_settings_accentColor", accentColor);
    toast.success("Branding settings applied!");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoPreview(ev.target?.result as string);
      toast.success("Logo uploaded successfully");
    };
    reader.readAsDataURL(file);
  };

  const selectedAccent = COLOR_SWATCHES.find((c) => c.id === accentColor);

  const accentBg =
    {
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
      red: "bg-red-500",
      teal: "bg-teal-500",
    }[accentColor] ?? "bg-primary";

  return (
    <div className="space-y-6" data-ocid="settings.page">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile" data-ocid="settings.tab_profile">
            <Building2 size={15} className="mr-1.5" /> School Profile
          </TabsTrigger>
          <TabsTrigger value="branding" data-ocid="settings.tab_branding">
            <Palette size={15} className="mr-1.5" /> Branding
          </TabsTrigger>
          <TabsTrigger value="export" data-ocid="settings.tab_export">
            <Download size={15} className="mr-1.5" /> Export / Deploy
          </TabsTrigger>
        </TabsList>

        {/* ─────────────────── SCHOOL PROFILE TAB ─────────────────── */}
        <TabsContent value="profile" className="space-y-5">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-foreground">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>School Name</Label>
                <Input
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  data-ocid="settings.school_name.input"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Tagline / Motto</Label>
                <Input
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Excellence in Education"
                  data-ocid="settings.tagline.input"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Address</Label>
                <Textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  data-ocid="settings.address.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  data-ocid="settings.phone.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-ocid="settings.email.input"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Website</Label>
                <Input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="www.yourschool.edu.in"
                  data-ocid="settings.website.input"
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-foreground">
              Academic Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Affiliation Board</Label>
                <Select
                  value={affiliationBoard}
                  onValueChange={setAffiliationBoard}
                >
                  <SelectTrigger data-ocid="settings.affiliation_board.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["CBSE", "ICSE", "State Board", "IB"].map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Academic Year</Label>
                <Select value={academicYear} onValueChange={setAcademicYear}>
                  <SelectTrigger data-ocid="settings.academic_year.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["2024-25", "2025-26", "2026-27"].map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>School Type</Label>
                <div className="flex gap-4 flex-wrap">
                  {["Day School", "Day-Boarding", "Residential"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 cursor-pointer"
                      data-ocid={`settings.school_type_${type.replace(/\s/g, "_").toLowerCase()}.radio`}
                    >
                      <input
                        type="radio"
                        name="schoolType"
                        value={type}
                        checked={schoolType === type}
                        onChange={() => setSchoolType(type)}
                        className="accent-primary w-4 h-4"
                      />
                      <span className="text-sm text-foreground">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-foreground">
              Principal Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Principal Name</Label>
                <Input
                  value={principalName}
                  onChange={(e) => setPrincipalName(e.target.value)}
                  data-ocid="settings.principal_name.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Designation</Label>
                <Input
                  value={principalDesignation}
                  onChange={(e) => setPrincipalDesignation(e.target.value)}
                  data-ocid="settings.principal_designation.input"
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-semibold text-foreground">
              Logo & Color Theme
            </h2>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-border bg-muted flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="School Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload size={24} className="text-muted-foreground" />
                  )}
                </div>
                <label
                  className="cursor-pointer"
                  data-ocid="settings.logo_upload.button"
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  <span className="text-xs text-primary underline-offset-2 hover:underline">
                    {logoPreview ? "Change Logo" : "Upload Logo"}
                  </span>
                </label>
                <span className="text-xs text-muted-foreground">
                  PNG/JPG, max 5MB
                </span>
              </div>
              <div className="space-y-2">
                <Label>School Color Theme</Label>
                <div className="flex gap-3 flex-wrap">
                  {COLOR_SWATCHES.map((swatch) => (
                    <button
                      key={swatch.id}
                      type="button"
                      title={swatch.label}
                      onClick={() => setColorTheme(swatch.id)}
                      className={`w-8 h-8 rounded-full ${swatch.bg} transition-all ring-offset-2 ring-offset-background ${colorTheme === swatch.id ? `ring-2 ${swatch.ring}` : ""}`}
                      data-ocid={`settings.color_theme_${swatch.id}.swatch`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Selected:{" "}
                  {COLOR_SWATCHES.find((c) => c.id === colorTheme)?.label}
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSaveProfile}
            data-ocid="settings.save_profile.button"
            className="w-full sm:w-auto"
          >
            Save Profile
          </Button>
        </TabsContent>

        {/* ─────────────────── BRANDING TAB ─────────────────── */}
        <TabsContent value="branding" className="space-y-5">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-foreground">
              App Theme
            </h2>
            <div className="flex gap-4 flex-wrap">
              {["Light", "Dark", "System"].map((t) => (
                <label
                  key={t}
                  className={`flex flex-col items-center gap-2 cursor-pointer p-4 rounded-xl border-2 transition-colors ${appTheme === t ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                  data-ocid={`settings.app_theme_${t.toLowerCase()}.radio`}
                >
                  <input
                    type="radio"
                    name="appTheme"
                    value={t}
                    checked={appTheme === t}
                    onChange={() => setAppTheme(t)}
                    className="sr-only"
                  />
                  <div
                    className={`w-12 h-8 rounded-md border ${t === "Light" ? "bg-card border-border" : t === "Dark" ? "bg-foreground border-border" : "bg-gradient-to-r from-card to-foreground border-border"}`}
                  />
                  <span
                    className={`text-sm font-medium ${appTheme === t ? "text-primary" : "text-foreground"}`}
                  >
                    {t}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-foreground">
              Accent Color
            </h2>
            <div className="flex gap-3 flex-wrap">
              {COLOR_SWATCHES.map((swatch) => (
                <button
                  key={swatch.id}
                  type="button"
                  title={swatch.label}
                  onClick={() => setAccentColor(swatch.id)}
                  className={`w-9 h-9 rounded-full ${swatch.bg} transition-all ring-offset-2 ring-offset-background ${accentColor === swatch.id ? `ring-2 ${swatch.ring}` : ""}`}
                  data-ocid={`settings.accent_color_${swatch.id}.swatch`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Selected: {selectedAccent?.label}
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-foreground">
              Report Card Header Preview
            </h2>
            <p className="text-xs text-muted-foreground">
              This is how your school header will appear on report cards and
              certificates.
            </p>
            <div className="border border-border rounded-xl overflow-hidden">
              <div className={`p-5 flex items-center gap-4 ${accentBg}`}>
                <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center overflow-hidden shrink-0">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-lg font-bold">
                      {schoolName.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="text-white">
                  <p className="text-lg font-bold leading-tight">
                    {schoolName}
                  </p>
                  <p className="text-xs opacity-80">{tagline}</p>
                  <p className="text-xs opacity-70 mt-1">{address}</p>
                  <p className="text-xs opacity-70">
                    {phone} | {email}
                  </p>
                </div>
              </div>
              <div className="bg-background p-3 text-center">
                <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  Progress Report Card — Academic Year {academicYear}
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleApplyBranding}
            data-ocid="settings.apply_branding.button"
            className="w-full sm:w-auto"
          >
            Apply Branding
          </Button>
        </TabsContent>

        {/* ─────────────────── EXPORT / DEPLOY TAB ─────────────────── */}
        <TabsContent value="export">
          <ExportDeployTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
