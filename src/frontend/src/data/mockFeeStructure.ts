export type FeeCategory = {
  id: string;
  name: string;
  amount: number;
  forClass: string;
  frequency: "Annual" | "Term" | "Monthly";
};

export type Discount = {
  id: string;
  name: string;
  type: "Percentage" | "Fixed";
  value: number;
  appliedTo: string;
};

export type FeePayment = {
  id: string;
  studentName: string;
  admissionNo: string;
  className: string;
  totalFee: number;
  paidAmount: number;
  dueAmount: number;
  lastPaymentDate: string;
  installmentPlan: "Full" | "Quarterly" | "Monthly";
  status: "Paid" | "Partial" | "Overdue";
  parentName: string;
};

export const mockFeeCategories: FeeCategory[] = [
  {
    id: "fc1",
    name: "Tuition Fee",
    amount: 12000,
    forClass: "All",
    frequency: "Annual",
  },
  {
    id: "fc2",
    name: "Exam Fee",
    amount: 1500,
    forClass: "All",
    frequency: "Term",
  },
  {
    id: "fc3",
    name: "Sports Fee",
    amount: 800,
    forClass: "All",
    frequency: "Annual",
  },
  {
    id: "fc4",
    name: "Library Fee",
    amount: 600,
    forClass: "All",
    frequency: "Annual",
  },
  {
    id: "fc5",
    name: "Lab Fee",
    amount: 2000,
    forClass: "IX",
    frequency: "Annual",
  },
];

export const mockDiscounts: Discount[] = [
  {
    id: "d1",
    name: "Sibling Discount",
    type: "Percentage",
    value: 10,
    appliedTo: "All",
  },
  {
    id: "d2",
    name: "Merit Scholarship",
    type: "Percentage",
    value: 25,
    appliedTo: "Sneha Jha",
  },
  {
    id: "d3",
    name: "Need Based Assistance",
    type: "Fixed",
    value: 3000,
    appliedTo: "Ravi Prakash",
  },
  {
    id: "d4",
    name: "Staff Ward Concession",
    type: "Percentage",
    value: 50,
    appliedTo: "Ananya Verma",
  },
];

export const mockFeePayments: FeePayment[] = [
  {
    id: "fp1",
    studentName: "Aarav Sharma",
    admissionNo: "2024-1045",
    className: "VIII-A",
    totalFee: 14900,
    paidAmount: 12400,
    dueAmount: 2500,
    lastPaymentDate: "2027-01-15",
    installmentPlan: "Quarterly",
    status: "Partial",
    parentName: "Vikram Sharma",
  },
  {
    id: "fp2",
    studentName: "Priya Singh",
    admissionNo: "2024-1046",
    className: "IX-B",
    totalFee: 16900,
    paidAmount: 16900,
    dueAmount: 0,
    lastPaymentDate: "2027-03-01",
    installmentPlan: "Full",
    status: "Paid",
    parentName: "Rajendra Singh",
  },
  {
    id: "fp3",
    studentName: "Rohan Kumar",
    admissionNo: "2024-1047",
    className: "VII-A",
    totalFee: 14900,
    paidAmount: 10400,
    dueAmount: 4500,
    lastPaymentDate: "2026-12-10",
    installmentPlan: "Quarterly",
    status: "Overdue",
    parentName: "Suresh Kumar",
  },
  {
    id: "fp4",
    studentName: "Ananya Verma",
    admissionNo: "2024-1048",
    className: "X-A",
    totalFee: 7450,
    paidAmount: 7450,
    dueAmount: 0,
    lastPaymentDate: "2027-04-01",
    installmentPlan: "Full",
    status: "Paid",
    parentName: "Amit Verma",
  },
  {
    id: "fp5",
    studentName: "Mohammed Arif",
    admissionNo: "2024-1049",
    className: "VI-B",
    totalFee: 14900,
    paidAmount: 13400,
    dueAmount: 1500,
    lastPaymentDate: "2027-02-20",
    installmentPlan: "Monthly",
    status: "Partial",
    parentName: "Abdul Karim",
  },
  {
    id: "fp6",
    studentName: "Ravi Prakash",
    admissionNo: "2024-1051",
    className: "V-A",
    totalFee: 11900,
    paidAmount: 5900,
    dueAmount: 6000,
    lastPaymentDate: "2026-11-05",
    installmentPlan: "Quarterly",
    status: "Overdue",
    parentName: "Ram Prakash",
  },
  {
    id: "fp7",
    studentName: "Akash Yadav",
    admissionNo: "2024-1057",
    className: "IX-A",
    totalFee: 16900,
    paidAmount: 9400,
    dueAmount: 7500,
    lastPaymentDate: "2026-10-15",
    installmentPlan: "Quarterly",
    status: "Overdue",
    parentName: "Rakesh Yadav",
  },
  {
    id: "fp8",
    studentName: "Ritu Rani",
    admissionNo: "2024-1056",
    className: "X-B",
    totalFee: 14900,
    paidAmount: 9900,
    dueAmount: 5000,
    lastPaymentDate: "2027-01-28",
    installmentPlan: "Monthly",
    status: "Partial",
    parentName: "Pramod Kumar",
  },
];
