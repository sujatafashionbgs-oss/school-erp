export type Scholarship = {
  id: string;
  name: string;
  type: "Merit" | "Need-Based" | "Government" | "Sports" | "Special";
  amount: number;
  criteria: string;
  maxRecipients: number;
  currentRecipients: number;
  status: "Active" | "Inactive";
};

export type ScholarshipApplication = {
  id: string;
  studentName: string;
  class: string;
  admissionNo: string;
  scholarshipId: string;
  scholarshipName: string;
  appliedDate: string;
  documents: string[];
  status: "Applied" | "Under Review" | "Approved" | "Rejected";
  concessionAmount: number;
  remarks?: string;
};

export const mockScholarships: Scholarship[] = [
  {
    id: "SCH001",
    name: "Academic Excellence Award",
    type: "Merit",
    amount: 15000,
    criteria:
      "Students scoring above 90% in annual examinations with consistent academic performance.",
    maxRecipients: 10,
    currentRecipients: 7,
    status: "Active",
  },
  {
    id: "SCH002",
    name: "PM Vidya Scholarship",
    type: "Government",
    amount: 12000,
    criteria:
      "BPL category students with family income below \u20b91.5L per annum. Valid for classes 9-12.",
    maxRecipients: 20,
    currentRecipients: 18,
    status: "Active",
  },
  {
    id: "SCH003",
    name: "Sports Star Concession",
    type: "Sports",
    amount: 8000,
    criteria:
      "Students representing school/district/state in recognized sports competitions.",
    maxRecipients: 15,
    currentRecipients: 9,
    status: "Active",
  },
  {
    id: "SCH004",
    name: "EWS Fee Concession",
    type: "Need-Based",
    amount: 20000,
    criteria:
      "Economically weaker sections with annual family income below \u20b92.5L and no other scholarship.",
    maxRecipients: 25,
    currentRecipients: 13,
    status: "Active",
  },
  {
    id: "SCH005",
    name: "Differently Abled Support",
    type: "Special",
    amount: 18000,
    criteria:
      "Students with certified physical/mental disabilities. Full fee waiver on case-by-case basis.",
    maxRecipients: 8,
    currentRecipients: 3,
    status: "Inactive",
  },
];

export const mockScholarshipApplications: ScholarshipApplication[] = [
  {
    id: "APP001",
    studentName: "Aarav Sharma",
    class: "10-A",
    admissionNo: "2024-1045",
    scholarshipId: "SCH001",
    scholarshipName: "Academic Excellence Award",
    appliedDate: "2027-03-10",
    documents: [
      "Mark Sheet 2026.pdf",
      "Identity Proof.jpg",
      "Bank Passbook.pdf",
    ],
    status: "Approved",
    concessionAmount: 15000,
    remarks: "Exceptional academic record. Top performer of Class 10.",
  },
  {
    id: "APP002",
    studentName: "Priya Patel",
    class: "9-B",
    admissionNo: "2024-1062",
    scholarshipId: "SCH002",
    scholarshipName: "PM Vidya Scholarship",
    appliedDate: "2027-03-12",
    documents: ["Income Certificate.pdf", "BPL Card.jpg", "Aadhar Card.pdf"],
    status: "Under Review",
    concessionAmount: 12000,
  },
  {
    id: "APP003",
    studentName: "Rohan Mehra",
    class: "8-C",
    admissionNo: "2024-1078",
    scholarshipId: "SCH003",
    scholarshipName: "Sports Star Concession",
    appliedDate: "2027-03-14",
    documents: ["District Certificate.pdf", "Sports ID.jpg"],
    status: "Applied",
    concessionAmount: 8000,
  },
  {
    id: "APP004",
    studentName: "Ananya Singh",
    class: "11-A",
    admissionNo: "2023-0891",
    scholarshipId: "SCH004",
    scholarshipName: "EWS Fee Concession",
    appliedDate: "2027-03-05",
    documents: [
      "EWS Certificate.pdf",
      "Income Proof.pdf",
      "Ration Card.jpg",
      "Bank Statement.pdf",
    ],
    status: "Approved",
    concessionAmount: 20000,
    remarks: "Verified EWS category. Full concession approved for 2026-27.",
  },
  {
    id: "APP005",
    studentName: "Karan Gupta",
    class: "7-B",
    admissionNo: "2024-1154",
    scholarshipId: "SCH001",
    scholarshipName: "Academic Excellence Award",
    appliedDate: "2027-03-18",
    documents: ["Mark Sheet.pdf", "Principal Recommendation.pdf"],
    status: "Rejected",
    concessionAmount: 0,
    remarks: "Score 87% \u2014 below 90% threshold. Reapply next year.",
  },
  {
    id: "APP006",
    studentName: "Meera Iyer",
    class: "12-B",
    admissionNo: "2022-0745",
    scholarshipId: "SCH002",
    scholarshipName: "PM Vidya Scholarship",
    appliedDate: "2027-03-20",
    documents: [
      "Income Certificate.pdf",
      "Caste Certificate.pdf",
      "Aadhar Card.pdf",
    ],
    status: "Applied",
    concessionAmount: 12000,
  },
  {
    id: "APP007",
    studentName: "Arjun Nair",
    class: "6-A",
    admissionNo: "2025-1201",
    scholarshipId: "SCH003",
    scholarshipName: "Sports Star Concession",
    appliedDate: "2027-03-22",
    documents: [
      "State Level Certificate.pdf",
      "Sports Authority Letter.pdf",
      "Photo ID.jpg",
    ],
    status: "Under Review",
    concessionAmount: 8000,
  },
  {
    id: "APP008",
    studentName: "Sakshi Verma",
    class: "10-B",
    admissionNo: "2024-1089",
    scholarshipId: "SCH004",
    scholarshipName: "EWS Fee Concession",
    appliedDate: "2027-03-25",
    documents: ["EWS Certificate.pdf", "Bank Passbook.pdf"],
    status: "Applied",
    concessionAmount: 20000,
  },
];
