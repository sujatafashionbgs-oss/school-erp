export interface Vaccination {
  vaccine: string;
  dateGiven: string;
  nextDue: string;
  status: "Complete" | "Due" | "Overdue";
}

export interface ClinicVisit {
  id: string;
  date: string;
  complaint: string;
  treatment: string;
  referredToDoctor: boolean;
}

export interface StudentHealth {
  studentId: string;
  studentName: string;
  admissionNo: string;
  className: string;
  bloodGroup: string;
  allergies: string;
  medicalConditions: string;
  emergencyContact: string;
  emergencyPhone: string;
  lastCheckup: string;
  vaccinations: Vaccination[];
  clinicVisits: ClinicVisit[];
}

export const mockHealthRecords: StudentHealth[] = [
  {
    studentId: "s1",
    studentName: "Aarav Sharma",
    admissionNo: "2024-1045",
    className: "VIII-A",
    bloodGroup: "B+",
    allergies: "Pollen, Dust",
    medicalConditions: "Mild asthma",
    emergencyContact: "Rajesh Sharma",
    emergencyPhone: "9876543210",
    lastCheckup: "2026-10-15",
    vaccinations: [
      {
        vaccine: "Hepatitis B",
        dateGiven: "2026-01-10",
        nextDue: "2027-01-10",
        status: "Complete",
      },
      {
        vaccine: "MMR",
        dateGiven: "2026-03-05",
        nextDue: "2029-03-05",
        status: "Complete",
      },
      {
        vaccine: "Typhoid",
        dateGiven: "2025-06-20",
        nextDue: "2027-06-20",
        status: "Due",
      },
      {
        vaccine: "Flu Shot",
        dateGiven: "2025-10-01",
        nextDue: "2026-10-01",
        status: "Overdue",
      },
    ],
    clinicVisits: [
      {
        id: "cv1",
        date: "2026-11-10",
        complaint: "Headache and fever",
        treatment: "Paracetamol 500mg, rest",
        referredToDoctor: false,
      },
      {
        id: "cv2",
        date: "2026-09-22",
        complaint: "Asthma episode",
        treatment: "Inhaler administered",
        referredToDoctor: true,
      },
    ],
  },
  {
    studentId: "s2",
    studentName: "Priya Singh",
    admissionNo: "2024-1046",
    className: "IX-B",
    bloodGroup: "O+",
    allergies: "None",
    medicalConditions: "None",
    emergencyContact: "Anita Singh",
    emergencyPhone: "9845678901",
    lastCheckup: "2026-09-20",
    vaccinations: [
      {
        vaccine: "Hepatitis B",
        dateGiven: "2026-01-15",
        nextDue: "2027-01-15",
        status: "Complete",
      },
      {
        vaccine: "Flu Shot",
        dateGiven: "2026-10-05",
        nextDue: "2027-10-05",
        status: "Complete",
      },
      {
        vaccine: "DPT Booster",
        dateGiven: "2025-04-12",
        nextDue: "2030-04-12",
        status: "Complete",
      },
    ],
    clinicVisits: [
      {
        id: "cv3",
        date: "2026-10-30",
        complaint: "Stomach ache",
        treatment: "Antacid, sent home",
        referredToDoctor: false,
      },
    ],
  },
  {
    studentId: "s3",
    studentName: "Rahul Verma",
    admissionNo: "2024-1050",
    className: "VIII-A",
    bloodGroup: "A+",
    allergies: "Penicillin",
    medicalConditions: "Type 1 Diabetes",
    emergencyContact: "Kapil Verma",
    emergencyPhone: "9765432109",
    lastCheckup: "2026-11-01",
    vaccinations: [
      {
        vaccine: "Hepatitis B",
        dateGiven: "2026-02-01",
        nextDue: "2027-02-01",
        status: "Complete",
      },
      {
        vaccine: "MMR",
        dateGiven: "2026-04-10",
        nextDue: "2029-04-10",
        status: "Complete",
      },
      {
        vaccine: "Flu Shot",
        dateGiven: "2025-09-15",
        nextDue: "2026-09-15",
        status: "Overdue",
      },
    ],
    clinicVisits: [
      {
        id: "cv4",
        date: "2026-11-05",
        complaint: "Low blood sugar episode",
        treatment: "Glucose administered",
        referredToDoctor: true,
      },
      {
        id: "cv5",
        date: "2026-10-12",
        complaint: "Minor cut on hand",
        treatment: "Antiseptic, bandage",
        referredToDoctor: false,
      },
    ],
  },
  {
    studentId: "s4",
    studentName: "Sneha Gupta",
    admissionNo: "2024-1060",
    className: "VII-B",
    bloodGroup: "AB+",
    allergies: "Nuts",
    medicalConditions: "None",
    emergencyContact: "Amit Gupta",
    emergencyPhone: "9654321098",
    lastCheckup: "2026-08-15",
    vaccinations: [
      {
        vaccine: "Typhoid",
        dateGiven: "2026-06-01",
        nextDue: "2028-06-01",
        status: "Complete",
      },
      {
        vaccine: "Flu Shot",
        dateGiven: "2026-10-20",
        nextDue: "2027-10-20",
        status: "Complete",
      },
    ],
    clinicVisits: [],
  },
];

export interface Medicine {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  expiryDate: string;
  unit: string;
}

export interface MedicineIssue {
  id: string;
  studentName: string;
  admissionNo: string;
  medicine: string;
  quantity: number;
  reason: string;
  date: string;
  issuedBy: string;
}

export const mockMedicines: Medicine[] = [
  {
    id: "m1",
    name: "Paracetamol 500mg",
    category: "Analgesic",
    quantity: 200,
    minQuantity: 50,
    expiryDate: "2028-06-30",
    unit: "Tablets",
  },
  {
    id: "m2",
    name: "Antacid Syrup",
    category: "Gastric",
    quantity: 8,
    minQuantity: 10,
    expiryDate: "2027-12-31",
    unit: "Bottles",
  },
  {
    id: "m3",
    name: "Antiseptic Solution",
    category: "First Aid",
    quantity: 5,
    minQuantity: 5,
    expiryDate: "2027-08-15",
    unit: "Bottles",
  },
  {
    id: "m4",
    name: "ORS Sachets",
    category: "Electrolytes",
    quantity: 100,
    minQuantity: 30,
    expiryDate: "2028-03-31",
    unit: "Sachets",
  },
  {
    id: "m5",
    name: "Bandages",
    category: "First Aid",
    quantity: 50,
    minQuantity: 20,
    expiryDate: "2029-01-01",
    unit: "Rolls",
  },
  {
    id: "m6",
    name: "Glucose Powder",
    category: "Nutrition",
    quantity: 3,
    minQuantity: 5,
    expiryDate: "2027-11-30",
    unit: "Packs",
  },
  {
    id: "m7",
    name: "Ibuprofen 400mg",
    category: "Analgesic",
    quantity: 80,
    minQuantity: 30,
    expiryDate: "2027-09-30",
    unit: "Tablets",
  },
  {
    id: "m8",
    name: "Eye Drops",
    category: "Ophthalmic",
    quantity: 6,
    minQuantity: 5,
    expiryDate: "2027-07-15",
    unit: "Bottles",
  },
  {
    id: "m9",
    name: "Cetirizine 10mg",
    category: "Antihistamine",
    quantity: 60,
    minQuantity: 20,
    expiryDate: "2028-02-28",
    unit: "Tablets",
  },
  {
    id: "m10",
    name: "Dettol",
    category: "First Aid",
    quantity: 4,
    minQuantity: 5,
    expiryDate: "2028-12-31",
    unit: "Bottles",
  },
];

export const mockMedicineIssues: MedicineIssue[] = [
  {
    id: "mi1",
    studentName: "Aarav Sharma",
    admissionNo: "2024-1045",
    medicine: "Paracetamol 500mg",
    quantity: 2,
    reason: "Fever",
    date: "2026-11-10",
    issuedBy: "School Nurse",
  },
  {
    id: "mi2",
    studentName: "Priya Singh",
    admissionNo: "2024-1046",
    medicine: "Antacid Syrup",
    quantity: 1,
    reason: "Stomach ache",
    date: "2026-10-30",
    issuedBy: "School Nurse",
  },
  {
    id: "mi3",
    studentName: "Rahul Verma",
    admissionNo: "2024-1050",
    medicine: "Glucose Powder",
    quantity: 1,
    reason: "Low blood sugar",
    date: "2026-11-05",
    issuedBy: "School Nurse",
  },
];
