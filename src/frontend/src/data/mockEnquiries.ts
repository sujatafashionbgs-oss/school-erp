export type EnquiryStage =
  | "New"
  | "Contacted"
  | "Follow-up"
  | "Admitted"
  | "Rejected";
export type EnquirySource = "Walk-in" | "Phone" | "Website" | "Referral";

export interface Enquiry {
  id: string;
  studentName: string;
  parentName: string;
  phone: string;
  classInterested: string;
  date: string;
  source: EnquirySource;
  stage: EnquiryStage;
  notes: string;
}

export const mockEnquiries: Enquiry[] = [
  {
    id: "eq1",
    studentName: "Rohan Mehta",
    parentName: "Suresh Mehta",
    phone: "9876543210",
    classInterested: "Class 6",
    date: "2024-11-20",
    source: "Walk-in",
    stage: "New",
    notes: "",
  },
  {
    id: "eq2",
    studentName: "Anika Sharma",
    parentName: "Priya Sharma",
    phone: "9845123456",
    classInterested: "Class 9",
    date: "2024-11-18",
    source: "Website",
    stage: "Contacted",
    notes: "Called, very interested",
  },
  {
    id: "eq3",
    studentName: "Dev Patel",
    parentName: "Ramesh Patel",
    phone: "9812345678",
    classInterested: "Class 7",
    date: "2024-11-15",
    source: "Referral",
    stage: "Follow-up",
    notes: "Visit scheduled for 28th Nov",
  },
  {
    id: "eq4",
    studentName: "Kavya Nair",
    parentName: "Anita Nair",
    phone: "9898765432",
    classInterested: "Class 11",
    date: "2024-11-10",
    source: "Phone",
    stage: "Admitted",
    notes: "Admission confirmed",
  },
  {
    id: "eq5",
    studentName: "Arjun Singh",
    parentName: "Vikram Singh",
    phone: "9765432109",
    classInterested: "Class 5",
    date: "2024-11-08",
    source: "Walk-in",
    stage: "Rejected",
    notes: "Age criteria not met",
  },
  {
    id: "eq6",
    studentName: "Sneha Gupta",
    parentName: "Amit Gupta",
    phone: "9654321098",
    classInterested: "Class 8",
    date: "2024-11-22",
    source: "Website",
    stage: "New",
    notes: "",
  },
  {
    id: "eq7",
    studentName: "Rahul Verma",
    parentName: "Kapil Verma",
    phone: "9543210987",
    classInterested: "Class 10",
    date: "2024-11-21",
    source: "Referral",
    stage: "Contacted",
    notes: "Documents requested",
  },
  {
    id: "eq8",
    studentName: "Pooja Joshi",
    parentName: "Deepak Joshi",
    phone: "9432109876",
    classInterested: "Class 6",
    date: "2024-11-19",
    source: "Walk-in",
    stage: "Follow-up",
    notes: "Second visit on 30th",
  },
  {
    id: "eq9",
    studentName: "Karan Malhotra",
    parentName: "Sanjay Malhotra",
    phone: "9321098765",
    classInterested: "Class 12",
    date: "2024-11-17",
    source: "Phone",
    stage: "New",
    notes: "",
  },
  {
    id: "eq10",
    studentName: "Isha Reddy",
    parentName: "Venkat Reddy",
    phone: "9210987654",
    classInterested: "Class 3",
    date: "2024-11-23",
    source: "Website",
    stage: "Contacted",
    notes: "Brochure sent",
  },
];
