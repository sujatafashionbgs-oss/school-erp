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
import { Building2, Palette, Upload } from "lucide-react";
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

export function SettingsPage() {
  // School Profile
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

  // Branding
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
        </TabsList>

        {/* ─────────────────── SCHOOL PROFILE TAB ─────────────────── */}
        <TabsContent value="profile" className="space-y-5">
          {/* Basic Info */}
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

          {/* Academic & Type */}
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

          {/* Principal */}
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

          {/* Logo + Color Theme */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-semibold text-foreground">
              Logo & Color Theme
            </h2>
            <div className="flex items-center gap-6 flex-wrap">
              {/* Logo preview circle */}
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

              {/* Color swatches */}
              <div className="space-y-2">
                <Label>School Color Theme</Label>
                <div className="flex gap-3 flex-wrap">
                  {COLOR_SWATCHES.map((swatch) => (
                    <button
                      key={swatch.id}
                      type="button"
                      title={swatch.label}
                      onClick={() => setColorTheme(swatch.id)}
                      className={`w-8 h-8 rounded-full ${swatch.bg} transition-all ring-offset-2 ring-offset-background ${
                        colorTheme === swatch.id ? `ring-2 ${swatch.ring}` : ""
                      }`}
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
          {/* App Theme */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-foreground">
              App Theme
            </h2>
            <div className="flex gap-4 flex-wrap">
              {["Light", "Dark", "System"].map((t) => (
                <label
                  key={t}
                  className={`flex flex-col items-center gap-2 cursor-pointer p-4 rounded-xl border-2 transition-colors ${
                    appTheme === t
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}
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
                    className={`w-12 h-8 rounded-md border ${
                      t === "Light"
                        ? "bg-white border-gray-200"
                        : t === "Dark"
                          ? "bg-gray-900 border-gray-700"
                          : "bg-gradient-to-r from-white to-gray-900 border-gray-300"
                    }`}
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

          {/* Accent Color */}
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
                  className={`w-9 h-9 rounded-full ${swatch.bg} transition-all ring-offset-2 ring-offset-background ${
                    accentColor === swatch.id ? `ring-2 ${swatch.ring}` : ""
                  }`}
                  data-ocid={`settings.accent_color_${swatch.id}.swatch`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Selected: {selectedAccent?.label}
            </p>
          </div>

          {/* Report Card Header Preview */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-foreground">
              Report Card Header Preview
            </h2>
            <p className="text-xs text-muted-foreground">
              This is how your school header will appear on report cards and
              certificates.
            </p>
            <div className="border border-border rounded-xl overflow-hidden">
              <div
                className={`p-5 flex items-center gap-4 ${
                  accentColor === "blue"
                    ? "bg-blue-500"
                    : accentColor === "green"
                      ? "bg-green-500"
                      : accentColor === "purple"
                        ? "bg-purple-500"
                        : accentColor === "orange"
                          ? "bg-orange-500"
                          : accentColor === "red"
                            ? "bg-red-500"
                            : "bg-teal-500"
                }`}
              >
                {/* Logo */}
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
                {/* Text */}
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
      </Tabs>
    </div>
  );
}
