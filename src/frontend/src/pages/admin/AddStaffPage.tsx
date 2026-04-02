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
import { ArrowLeft, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  navigate: (path: string) => void;
}

export function AddStaffPage({ navigate }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    role: "",
    subject: "",
    qualification: "",
    salary: "",
  });

  const update = (key: string, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.role) {
      toast.error("Please fill all required fields (Name, Mobile, Role)");
      return;
    }
    toast.success(`Staff member ${formData.name} added successfully!`);
    navigate("/admin/staff");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6" data-ocid="add_staff.page">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/staff")}
          data-ocid="add_staff.back_button"
        >
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <UserPlus size={22} className="text-primary" />
            Add Staff Member
          </h1>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to add a new staff member
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-card border border-border rounded-2xl p-6 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. Rajesh Kumar"
              value={formData.name}
              onChange={(e) => update("name", e.target.value)}
              data-ocid="add_staff.name.input"
            />
          </div>

          {/* Mobile */}
          <div className="space-y-1.5">
            <Label htmlFor="mobile">
              Mobile <span className="text-destructive">*</span>
            </Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="e.g. 9876543210"
              value={formData.mobile}
              onChange={(e) => update("mobile", e.target.value)}
              data-ocid="add_staff.mobile.input"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. rajesh@school.com"
              value={formData.email}
              onChange={(e) => update("email", e.target.value)}
              data-ocid="add_staff.email.input"
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label htmlFor="role">
              Role <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.role}
              onValueChange={(v) => update("role", v)}
            >
              <SelectTrigger id="role" data-ocid="add_staff.role.select">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Teacher">Teacher</SelectItem>
                <SelectItem value="Admin Staff">Admin Staff</SelectItem>
                <SelectItem value="Accountant">Accountant</SelectItem>
                <SelectItem value="Librarian">Librarian</SelectItem>
                <SelectItem value="Lab Incharge">Lab Incharge</SelectItem>
                <SelectItem value="Transport Manager">
                  Transport Manager
                </SelectItem>
                <SelectItem value="Vendor">Vendor</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="e.g. Mathematics, Science"
              value={formData.subject}
              onChange={(e) => update("subject", e.target.value)}
              data-ocid="add_staff.subject.input"
            />
          </div>

          {/* Qualification */}
          <div className="space-y-1.5">
            <Label htmlFor="qualification">Qualification</Label>
            <Input
              id="qualification"
              placeholder="e.g. B.Ed, M.Sc"
              value={formData.qualification}
              onChange={(e) => update("qualification", e.target.value)}
              data-ocid="add_staff.qualification.input"
            />
          </div>

          {/* Salary */}
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="salary">Monthly Salary (₹)</Label>
            <Input
              id="salary"
              type="number"
              placeholder="e.g. 35000"
              value={formData.salary}
              onChange={(e) => update("salary", e.target.value)}
              data-ocid="add_staff.salary.input"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/staff")}
            data-ocid="add_staff.cancel_button"
          >
            Cancel
          </Button>
          <Button type="submit" data-ocid="add_staff.submit_button">
            <UserPlus size={15} className="mr-1.5" />
            Add Staff Member
          </Button>
        </div>
      </form>
    </div>
  );
}
