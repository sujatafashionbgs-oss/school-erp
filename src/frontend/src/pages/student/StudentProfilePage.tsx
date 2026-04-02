import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { mockStudents } from "@/data/mockStudents";
import { BookOpen, Phone, User } from "lucide-react";

export function StudentProfilePage() {
  const { user } = useAuth();
  const student = mockStudents.find(
    (s) => s.admissionNo === user?.admissionNo || s.admissionNo === user?.email,
  );

  if (!student) {
    return (
      <div className="max-w-4xl space-y-5" data-ocid="student_profile.page">
        <div className="bg-card border border-border rounded-2xl p-6 text-center text-muted-foreground">
          Student profile not found. Please contact your school administrator.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-5" data-ocid="student_profile.page">
      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
          {student.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{student.name}</h1>
          <p className="text-muted-foreground">
            Class {student.className}-{student.section} · Roll No.{" "}
            {student.rollNo}
          </p>
          <p className="text-sm text-muted-foreground">
            Admission No:{" "}
            <span className="font-mono font-medium text-foreground">
              {student.admissionNo}
            </span>
          </p>
        </div>
        <Badge className="text-sm px-3 py-1">{student.status}</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-sm text-muted-foreground">Attendance</p>
          <p
            className={`text-3xl font-bold mt-1 ${
              student.attendance >= 75 ? "text-green-600" : "text-destructive"
            }`}
          >
            {student.attendance}%
          </p>
          <div className="mt-2 h-2 bg-secondary rounded-full">
            <div
              className="h-2 rounded-full bg-green-500"
              style={{ width: `${student.attendance}%` }}
            />
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-sm text-muted-foreground">Fee Due</p>
          <p
            className={`text-3xl font-bold mt-1 ${
              student.feeDue > 0 ? "text-destructive" : "text-green-600"
            }`}
          >
            {student.feeDue > 0 ? `₹${student.feeDue}` : "Paid"}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {student.feeDue > 0 ? "Please clear dues" : "All fees cleared"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Personal Info */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <User size={16} className="text-primary" /> Personal
          </h2>
          <div className="space-y-3 text-sm">
            {[
              { label: "Date of Birth", value: student.dob },
              { label: "Gender", value: student.gender },
              { label: "Blood Group", value: student.bloodGroup },
              { label: "Religion", value: student.religion },
              { label: "Category", value: student.category },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="font-medium text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Phone size={16} className="text-primary" /> Contact
          </h2>
          <div className="space-y-3 text-sm">
            {[
              { label: "Father's Name", value: student.fatherName },
              { label: "Mother's Name", value: student.motherName },
              { label: "Mobile", value: student.mobile },
              { label: "City", value: student.city },
              { label: "State", value: student.state },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="font-medium text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Info */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <BookOpen size={16} className="text-primary" /> Academic
          </h2>
          <div className="space-y-3 text-sm">
            {[
              { label: "Class", value: `Class ${student.className}` },
              { label: "Section", value: student.section },
              { label: "Roll No", value: student.rollNo },
              { label: "Admission Date", value: student.admissionDate },
              {
                label: "Previous School",
                value: student.previousSchool || "N/A",
              },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="font-medium text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
