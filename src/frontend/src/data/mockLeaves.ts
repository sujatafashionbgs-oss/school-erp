export type LeaveType = "Casual" | "Medical" | "Emergency";

export type LeaveApplication = {
  id: string;
  applicantName: string;
  applicantRole: "student" | "staff";
  admissionOrStaffNo: string;
  className?: string;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  approvedBy?: string;
  rejectionReason?: string;
  appliedAt: string;
};

export type LeaveBalance = {
  applicantId: string;
  casual: number;
  medical: number;
  emergency: number;
  usedCasual: number;
  usedMedical: number;
  usedEmergency: number;
};

export const mockLeaveApplications: LeaveApplication[] = [
  {
    id: "la1",
    applicantName: "Aarav Sharma",
    applicantRole: "student",
    admissionOrStaffNo: "2024-1045",
    className: "VIII-A",
    leaveType: "Casual",
    fromDate: "2026-03-10",
    toDate: "2026-03-11",
    days: 2,
    reason: "Family function at home town",
    status: "Approved",
    approvedBy: "Mr. Ramesh",
    appliedAt: "2026-03-08",
  },
  {
    id: "la2",
    applicantName: "Rohan Kumar",
    applicantRole: "student",
    admissionOrStaffNo: "2024-1047",
    className: "VII-A",
    leaveType: "Medical",
    fromDate: "2026-03-15",
    toDate: "2026-03-17",
    days: 3,
    reason: "Fever and throat infection",
    status: "Approved",
    approvedBy: "Mrs. Sunita",
    appliedAt: "2026-03-14",
  },
  {
    id: "la3",
    applicantName: "Priya Singh",
    applicantRole: "student",
    admissionOrStaffNo: "2024-1046",
    className: "IX-B",
    leaveType: "Casual",
    fromDate: "2026-04-05",
    toDate: "2026-04-05",
    days: 1,
    reason: "Sister's wedding ceremony",
    status: "Pending",
    appliedAt: "2026-04-02",
  },
  {
    id: "la4",
    applicantName: "Akash Yadav",
    applicantRole: "student",
    admissionOrStaffNo: "2024-1057",
    className: "IX-A",
    leaveType: "Emergency",
    fromDate: "2026-03-20",
    toDate: "2026-03-22",
    days: 3,
    reason: "Grandfather passed away",
    status: "Approved",
    approvedBy: "Mr. Ramesh",
    appliedAt: "2026-03-20",
  },
  {
    id: "la5",
    applicantName: "Mohammed Arif",
    applicantRole: "student",
    admissionOrStaffNo: "2024-1049",
    className: "VI-B",
    leaveType: "Medical",
    fromDate: "2026-04-08",
    toDate: "2026-04-10",
    days: 3,
    reason: "Dengue fever, doctor's certificate attached",
    status: "Pending",
    appliedAt: "2026-04-07",
  },
  {
    id: "la6",
    applicantName: "Sneha Jha",
    applicantRole: "student",
    admissionOrStaffNo: "2024-1050",
    className: "XI-Science",
    leaveType: "Casual",
    fromDate: "2026-03-25",
    toDate: "2026-03-25",
    days: 1,
    reason: "State-level debate competition",
    status: "Rejected",
    rejectionReason: "Exam week, cannot grant leave",
    appliedAt: "2026-03-22",
  },
  {
    id: "la7",
    applicantName: "Supriya Devi",
    applicantRole: "staff",
    admissionOrStaffNo: "STF-005",
    leaveType: "Medical",
    fromDate: "2026-03-12",
    toDate: "2026-03-14",
    days: 3,
    reason: "Scheduled surgery and recovery",
    status: "Approved",
    approvedBy: "Principal",
    appliedAt: "2026-03-10",
  },
  {
    id: "la8",
    applicantName: "Ramesh Kumar",
    applicantRole: "staff",
    admissionOrStaffNo: "STF-001",
    leaveType: "Casual",
    fromDate: "2026-04-10",
    toDate: "2026-04-11",
    days: 2,
    reason: "Personal family matter",
    status: "Pending",
    appliedAt: "2026-04-08",
  },
  {
    id: "la9",
    applicantName: "Priti Sharma",
    applicantRole: "staff",
    admissionOrStaffNo: "STF-008",
    leaveType: "Emergency",
    fromDate: "2026-03-28",
    toDate: "2026-03-30",
    days: 3,
    reason: "Father hospitalized",
    status: "Approved",
    approvedBy: "Principal",
    appliedAt: "2026-03-28",
  },
  {
    id: "la10",
    applicantName: "Sunita Mishra",
    applicantRole: "staff",
    admissionOrStaffNo: "STF-012",
    leaveType: "Casual",
    fromDate: "2026-04-14",
    toDate: "2026-04-14",
    days: 1,
    reason: "Personal work",
    status: "Pending",
    appliedAt: "2026-04-11",
  },
  {
    id: "la11",
    applicantName: "Ritu Rani",
    applicantRole: "student",
    admissionOrStaffNo: "2024-1056",
    className: "X-B",
    leaveType: "Casual",
    fromDate: "2026-04-02",
    toDate: "2026-04-03",
    days: 2,
    reason: "Religious festival at home",
    status: "Pending",
    appliedAt: "2026-03-31",
  },
  {
    id: "la12",
    applicantName: "Devraj Tiwari",
    applicantRole: "staff",
    admissionOrStaffNo: "STF-003",
    leaveType: "Medical",
    fromDate: "2026-02-20",
    toDate: "2026-02-22",
    days: 3,
    reason: "Viral fever",
    status: "Rejected",
    rejectionReason: "Annual exams in progress",
    appliedAt: "2026-02-19",
  },
];

export const mockLeaveBalances: LeaveBalance[] = [
  {
    applicantId: "2024-1045",
    casual: 10,
    medical: 5,
    emergency: 3,
    usedCasual: 2,
    usedMedical: 0,
    usedEmergency: 0,
  },
  {
    applicantId: "2024-1046",
    casual: 10,
    medical: 5,
    emergency: 3,
    usedCasual: 0,
    usedMedical: 0,
    usedEmergency: 0,
  },
  {
    applicantId: "student",
    casual: 10,
    medical: 5,
    emergency: 3,
    usedCasual: 1,
    usedMedical: 0,
    usedEmergency: 0,
  },
  {
    applicantId: "teacher",
    casual: 12,
    medical: 6,
    emergency: 3,
    usedCasual: 2,
    usedMedical: 1,
    usedEmergency: 0,
  },
];
