export type Grievance = {
  id: string;
  ticketNo: string;
  submittedBy: string;
  role: "Student" | "Parent" | "Staff";
  category:
    | "Academic"
    | "Infrastructure"
    | "Administrative"
    | "Behavioral"
    | "Other";
  subject: string;
  description: string;
  submittedDate: string;
  status: "Open" | "Under Review" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High";
  assignedTo?: string;
  resolution?: string;
  resolvedDate?: string;
};

export const mockGrievances: Grievance[] = [
  {
    id: "g1",
    ticketNo: "GRV-20260710-001",
    submittedBy: "Aarav Sharma",
    role: "Student",
    category: "Academic",
    subject: "Incorrect marks in Science exam",
    description:
      "My Science paper was marked incorrectly. I answered Q5 correctly but got 0 marks.",
    submittedDate: "2026-07-10",
    status: "Under Review",
    priority: "High",
    assignedTo: "Amit Verma",
  },
  {
    id: "g2",
    ticketNo: "GRV-20260815-002",
    submittedBy: "Ramesh Gupta",
    role: "Parent",
    category: "Administrative",
    subject: "Fee receipt not issued",
    description:
      "Paid fees for August but did not receive a receipt. Need it urgently for bank records.",
    submittedDate: "2026-08-15",
    status: "Resolved",
    priority: "Medium",
    assignedTo: "Accounts Office",
    resolution: "Receipt issued and handed over to parent on 2026-08-16.",
    resolvedDate: "2026-08-16",
  },
  {
    id: "g3",
    ticketNo: "GRV-20260918-003",
    submittedBy: "Priya Singh",
    role: "Student",
    category: "Infrastructure",
    subject: "Water cooler not working in Block B",
    description:
      "The water cooler on the 2nd floor of Block B has been non-functional for 2 weeks.",
    submittedDate: "2026-09-18",
    status: "Open",
    priority: "Low",
  },
  {
    id: "g4",
    ticketNo: "GRV-20261020-004",
    submittedBy: "Sunita Devi",
    role: "Staff",
    category: "Administrative",
    subject: "Salary increment not reflected",
    description:
      "The approved 10% salary increment for this year has not been added to my October payslip.",
    submittedDate: "2026-10-20",
    status: "Under Review",
    priority: "High",
    assignedTo: "HR Department",
  },
  {
    id: "g5",
    ticketNo: "GRV-20261122-005",
    submittedBy: "Kiran Patel",
    role: "Parent",
    category: "Behavioral",
    subject: "Bullying complaint against classmate",
    description:
      "My son Rohan (Class VII-B) is being bullied by a classmate. This has been going on for a week.",
    submittedDate: "2026-11-22",
    status: "Open",
    priority: "High",
  },
  {
    id: "g6",
    ticketNo: "GRV-20261123-006",
    submittedBy: "Meena Joshi",
    role: "Staff",
    category: "Infrastructure",
    subject: "Projector in Room 204 not working",
    description:
      "The projector assigned to Room 204 has been broken since last month. It affects my teaching.",
    submittedDate: "2026-11-23",
    status: "Resolved",
    priority: "Medium",
    assignedTo: "IT Department",
    resolution: "Projector repaired and tested on 2026-11-25.",
    resolvedDate: "2026-11-25",
  },
  {
    id: "g7",
    ticketNo: "GRV-20261224-007",
    submittedBy: "Rahul Verma",
    role: "Student",
    category: "Academic",
    subject: "Library books not available for Class X syllabus",
    description:
      "Several reference books listed in the Class X syllabus are not available in the library.",
    submittedDate: "2026-12-24",
    status: "Closed",
    priority: "Low",
    assignedTo: "Librarian",
    resolution: "New books ordered and available from 2026-12-28.",
    resolvedDate: "2026-12-28",
  },
  {
    id: "g8",
    ticketNo: "GRV-20270125-008",
    submittedBy: "Anita Sharma",
    role: "Parent",
    category: "Other",
    subject: "Bus late by 45 minutes regularly",
    description:
      "Route 3 bus is late by 30-45 minutes every day for the past 2 weeks.",
    submittedDate: "2027-01-25",
    status: "Under Review",
    priority: "Medium",
    assignedTo: "Transport Manager",
  },
  {
    id: "g9",
    ticketNo: "GRV-20270226-009",
    submittedBy: "Raj Malhotra",
    role: "Student",
    category: "Academic",
    subject: "Teacher absent repeatedly without substitute",
    description:
      "Our Physics teacher has been absent 6 times this month and no substitute was provided.",
    submittedDate: "2027-02-26",
    status: "Open",
    priority: "High",
  },
  {
    id: "g10",
    ticketNo: "GRV-20270328-010",
    submittedBy: "Deepak Rao",
    role: "Staff",
    category: "Administrative",
    subject: "Leave application rejected without reason",
    description:
      "My medical leave application for 3 days was rejected without any explanation or counter-offer.",
    submittedDate: "2027-03-28",
    status: "Open",
    priority: "Medium",
  },
];
