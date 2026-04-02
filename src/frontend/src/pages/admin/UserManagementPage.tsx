import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Eye,
  EyeOff,
  KeyRound,
  Plus,
  Search,
  Shield,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ALL_MODULES = [
  "Dashboard",
  "Students",
  "Staff",
  "Attendance",
  "Fee Management",
  "Collect Fee",
  "Examinations",
  "Report Cards",
  "Communication",
  "Admissions",
  "Enquiry CRM",
  "Leave Management",
  "Reports",
  "Library",
  "Transport",
  "Scholarships",
  "Timetable",
  "Events",
  "Gallery",
  "Health Records",
  "Certificates",
  "Settings",
  "User Management",
];

const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ALL_MODULES,
  "super-admin": ALL_MODULES,
  teacher: [
    "Dashboard",
    "Attendance",
    "Examinations",
    "Report Cards",
    "Timetable",
    "Leave Management",
    "Communication",
  ],
  accountant: [
    "Dashboard",
    "Fee Management",
    "Collect Fee",
    "Reports",
    "Scholarships",
  ],
  librarian: ["Dashboard", "Library"],
  "lab-incharge": ["Dashboard", "Students"],
  "transport-manager": ["Dashboard", "Transport"],
  parent: ["Dashboard", "Students", "Fee Management", "Communication"],
  student: ["Dashboard", "Report Cards", "Examinations"],
  vendor: ["Dashboard"],
};

type UserEntry = {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  status: "Active" | "Inactive";
  lastLogin: string;
  permissions?: string[];
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  teacher: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  accountant:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  librarian:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "lab-incharge":
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "transport-manager":
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  vendor: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
};

const INITIAL_USERS: UserEntry[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@school.com",
    username: "admin",
    role: "admin",
    status: "Active",
    lastLogin: "2026-04-01",
  },
  {
    id: "2",
    name: "Super Admin",
    email: "super@school.com",
    username: "super",
    role: "admin",
    status: "Active",
    lastLogin: "2026-03-31",
  },
  {
    id: "3",
    name: "Ravi Sharma",
    email: "teacher@school.com",
    username: "teacher1",
    role: "teacher",
    status: "Active",
    lastLogin: "2026-04-01",
  },
  {
    id: "4",
    name: "Priya Mehta",
    email: "teacher2@school.com",
    username: "teacher2",
    role: "teacher",
    status: "Active",
    lastLogin: "2026-03-30",
  },
  {
    id: "5",
    name: "Anita Kulkarni",
    email: "accountant@school.com",
    username: "accountant",
    role: "accountant",
    status: "Active",
    lastLogin: "2026-03-29",
  },
  {
    id: "6",
    name: "Suresh Patil",
    email: "librarian@school.com",
    username: "librarian",
    role: "librarian",
    status: "Active",
    lastLogin: "2026-03-28",
  },
  {
    id: "7",
    name: "Dr. Kavita Nair",
    email: "lab@school.com",
    username: "lab",
    role: "lab-incharge",
    status: "Active",
    lastLogin: "2026-03-27",
  },
  {
    id: "8",
    name: "Ramesh Yadav",
    email: "transport@school.com",
    username: "transport",
    role: "transport-manager",
    status: "Active",
    lastLogin: "2026-03-25",
  },
  {
    id: "9",
    name: "Vendor Corp",
    email: "vendor@school.com",
    username: "vendor",
    role: "vendor",
    status: "Inactive",
    lastLogin: "2026-03-10",
  },
  {
    id: "10",
    name: "Sunita Joshi",
    email: "teacher3@school.com",
    username: "teacher3",
    role: "teacher",
    status: "Active",
    lastLogin: "2026-04-01",
  },
];

const ROLES = [
  "admin",
  "teacher",
  "accountant",
  "librarian",
  "lab-incharge",
  "transport-manager",
  "vendor",
];

const blankForm = {
  name: "",
  email: "",
  username: "",
  role: "teacher",
  password: "",
  status: "Active" as "Active" | "Inactive",
};

export function UserManagementPage() {
  const [users, setUsers] = useState<UserEntry[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Permissions state keyed by user id
  const [userPermissions, setUserPermissions] = useState<
    Record<string, string[]>
  >(
    Object.fromEntries(
      INITIAL_USERS.map((u) => [
        u.id,
        DEFAULT_ROLE_PERMISSIONS[u.role] ?? ["Dashboard"],
      ]),
    ),
  );

  // Add/Edit dialog
  const [editingUser, setEditingUser] = useState<UserEntry | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState(blankForm);
  const [showPw, setShowPw] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [draftPermissions, setDraftPermissions] = useState<string[]>([]);

  // Reset password dialog
  const [resetUser, setResetUser] = useState<UserEntry | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Delete dialog
  const [deleteUser, setDeleteUser] = useState<UserEntry | null>(null);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const openAdd = () => {
    setEditingUser(null);
    setForm(blankForm);
    setShowPw(false);
    setPermissionsOpen(false);
    setDraftPermissions(DEFAULT_ROLE_PERMISSIONS.teacher ?? ["Dashboard"]);
    setIsAddOpen(true);
  };

  const openEdit = (u: UserEntry) => {
    setEditingUser(u);
    setForm({
      name: u.name,
      email: u.email,
      username: u.username,
      role: u.role,
      password: "",
      status: u.status,
    });
    setShowPw(false);
    setPermissionsOpen(false);
    setDraftPermissions(
      userPermissions[u.id] ??
        DEFAULT_ROLE_PERMISSIONS[u.role] ?? ["Dashboard"],
    );
    setIsAddOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email || !form.username) {
      toast.error("Name, email, and username are required");
      return;
    }
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: form.name,
                email: form.email,
                username: form.username,
                role: form.role,
                status: form.status,
              }
            : u,
        ),
      );
      setUserPermissions((prev) => ({
        ...prev,
        [editingUser.id]: draftPermissions,
      }));
      toast.success("User updated");
    } else {
      if (!form.password) {
        toast.error("Password is required for new users");
        return;
      }
      const newId = `u-${Date.now()}`;
      const newUser: UserEntry = {
        id: newId,
        name: form.name,
        email: form.email,
        username: form.username,
        role: form.role,
        status: form.status,
        lastLogin: "Never",
      };
      setUsers((prev) => [...prev, newUser]);
      setUserPermissions((prev) => ({ ...prev, [newId]: draftPermissions }));
      toast.success("User added successfully");
    }
    setIsAddOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleteUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
    toast.success("User deleted");
    setDeleteUser(null);
  };

  function handleResetPassword() {
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success(`Password reset for ${resetUser?.name}`);
    setResetUser(null);
    setNewPassword("");
    setConfirmPassword("");
  }

  function toggleStatus(id: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
          : u,
      ),
    );
  }

  // When role changes in the form, reset draft permissions to defaults for that role
  function handleRoleChange(val: string) {
    setForm((prev) => ({ ...prev, role: val }));
    setDraftPermissions(DEFAULT_ROLE_PERMISSIONS[val] ?? ["Dashboard"]);
    toast.info(
      "Permissions reset to defaults for new role. Customize as needed.",
    );
  }

  function toggleModule(mod: string) {
    setDraftPermissions((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod],
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield className="text-primary" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage system users and their access
            </p>
          </div>
        </div>
        <Button onClick={openAdd} data-ocid="usermgmt.add.button">
          <Plus size={16} className="mr-1" /> Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.length },
          {
            label: "Active",
            value: users.filter((u) => u.status === "Active").length,
          },
          {
            label: "Inactive",
            value: users.filter((u) => u.status === "Inactive").length,
          },
          {
            label: "Roles",
            value: [...new Set(users.map((u) => u.role))].length,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border bg-card p-4 text-center"
          >
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <Input
            className="pl-9"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="users.search_input"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48" data-ocid="users.role_filter.select">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email / Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-10"
                  data-ocid="users.empty_state"
                >
                  No users found
                </TableCell>
              </TableRow>
            )}
            {filtered.map((u, i) => (
              <TableRow key={u.id} data-ocid={`users.item.${i + 1}`}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  <div>{u.email}</div>
                  <div className="text-xs opacity-70">@{u.username}</div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      ROLE_COLORS[u.role] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {u.role}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={u.status === "Active"}
                      onCheckedChange={() => toggleStatus(u.id)}
                      data-ocid={`users.status.switch.${i + 1}`}
                    />
                    <Badge
                      variant={u.status === "Active" ? "default" : "secondary"}
                      className={
                        u.status === "Active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0"
                          : ""
                      }
                    >
                      {u.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {u.lastLogin}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {userPermissions[u.id]?.length ?? 0}/{ALL_MODULES.length}{" "}
                    modules
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => openEdit(u)}
                      data-ocid={`usermgmt.edit.button.${u.id}`}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setResetUser(u);
                        setNewPassword("");
                        setConfirmPassword("");
                        setShowNew(false);
                        setShowConfirm(false);
                      }}
                      data-ocid={`users.reset_password.button.${i + 1}`}
                    >
                      <KeyRound size={14} className="mr-1" />
                      Reset
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleteUser(u)}
                      data-ocid={`users.delete_button.${i + 1}`}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit User Dialog */}
      <Dialog
        open={isAddOpen}
        onOpenChange={(open) => !open && setIsAddOpen(false)}
      >
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="users.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editingUser ? `Edit User — ${editingUser.name}` : "Add New User"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label>Full Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="John Doe"
                  data-ocid="users.name.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="user@school.com"
                  data-ocid="users.email.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Username *</Label>
                <Input
                  value={form.username}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, username: e.target.value }))
                  }
                  placeholder="username"
                  data-ocid="users.username.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(val) => handleRoleChange(val)}
                >
                  <SelectTrigger data-ocid="users.role.select">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <div className="flex items-center gap-2 h-10">
                  <Switch
                    checked={form.status === "Active"}
                    onCheckedChange={(checked) =>
                      setForm((p) => ({
                        ...p,
                        status: checked ? "Active" : "Inactive",
                      }))
                    }
                    data-ocid="users.status_toggle.switch"
                  />
                  <span className="text-sm">{form.status}</span>
                </div>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>
                  {editingUser
                    ? "New Password (leave blank to keep)"
                    : "Password *"}
                </Label>
                <div className="relative">
                  <Input
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, password: e.target.value }))
                    }
                    placeholder="Min 6 characters"
                    data-ocid="users.password.input"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPw((v) => !v)}
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Permissions Panel */}
            <div className="border border-border rounded-xl overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-3 bg-secondary/40 hover:bg-secondary/60 transition-colors text-sm font-semibold"
                onClick={() => setPermissionsOpen((v) => !v)}
                data-ocid="users.permissions.toggle"
              >
                <span>
                  Permissions ({draftPermissions.length}/{ALL_MODULES.length}{" "}
                  modules enabled)
                </span>
                {permissionsOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              {permissionsOpen && (
                <div className="p-4">
                  <div className="flex gap-2 mb-3">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="text-xs h-7"
                      onClick={() => setDraftPermissions([...ALL_MODULES])}
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="text-xs h-7"
                      onClick={() => setDraftPermissions([])}
                    >
                      Clear All
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="text-xs h-7"
                      onClick={() =>
                        setDraftPermissions(
                          DEFAULT_ROLE_PERMISSIONS[form.role] ?? ["Dashboard"],
                        )
                      }
                    >
                      Reset to Role Defaults
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {ALL_MODULES.map((mod) => (
                      <label
                        key={mod}
                        className="flex items-center gap-2 text-xs cursor-pointer p-1.5 rounded hover:bg-secondary/50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={draftPermissions.includes(mod)}
                          onChange={() => toggleModule(mod)}
                          className="w-3.5 h-3.5 cursor-pointer"
                        />
                        <span>{mod}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddOpen(false)}
              data-ocid="users.dialog.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              data-ocid={
                editingUser
                  ? "usermgmt.edit.save_button"
                  : "usermgmt.add.save_button"
              }
            >
              {editingUser ? "Save Changes" : "Add User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteUser}
        onOpenChange={(open) => !open && setDeleteUser(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {deleteUser?.name}
            </span>
            ? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteUser(null)}
              data-ocid="users.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              data-ocid="users.delete.confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog
        open={!!resetUser}
        onOpenChange={(open) => !open && setResetUser(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password — {resetUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Set a new password for <strong>{resetUser?.email}</strong>.
            </p>
            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Input
                  type={showNew ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  data-ocid="users.reset.new_password.input"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowNew((v) => !v)}
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  data-ocid="users.reset.confirm_password.input"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowConfirm((v) => !v)}
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResetUser(null)}
              data-ocid="users.reset.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleResetPassword}
              data-ocid="users.reset.save_button"
            >
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
