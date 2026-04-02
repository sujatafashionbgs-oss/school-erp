export type AppraisalCriteria = {
  id: string;
  category: string;
  criterion: string;
  maxScore: number;
};

export type Appraisal = {
  id: string;
  staffId: string;
  staffName: string;
  designation: string;
  year: string;
  selfScores: Record<string, number>;
  managerScores: Record<string, number>;
  status: "Pending Self Review" | "Pending Manager Review" | "Completed";
  overallGrade?: string;
  comments: string;
};

export const APPRAISAL_CRITERIA: AppraisalCriteria[] = [
  {
    id: "teaching_quality",
    category: "Academic",
    criterion: "Teaching Quality",
    maxScore: 20,
  },
  {
    id: "punctuality",
    category: "Discipline",
    criterion: "Punctuality & Discipline",
    maxScore: 20,
  },
  {
    id: "student_engagement",
    category: "Academic",
    criterion: "Student Engagement",
    maxScore: 20,
  },
  {
    id: "administrative_tasks",
    category: "Administration",
    criterion: "Administrative Tasks",
    maxScore: 20,
  },
  {
    id: "professional_development",
    category: "Growth",
    criterion: "Professional Development",
    maxScore: 20,
  },
];

export const mockAppraisals: Appraisal[] = [
  {
    id: "apr1",
    staffId: "st1",
    staffName: "Amit Verma",
    designation: "Senior Teacher",
    year: "2026-27",
    selfScores: {
      teaching_quality: 18,
      punctuality: 17,
      student_engagement: 19,
      administrative_tasks: 16,
      professional_development: 18,
    },
    managerScores: {
      teaching_quality: 17,
      punctuality: 18,
      student_engagement: 18,
      administrative_tasks: 17,
      professional_development: 17,
    },
    status: "Completed",
    overallGrade: "A+",
    comments:
      "Excellent performance across all parameters. Strong student engagement and teaching methodology.",
  },
  {
    id: "apr2",
    staffId: "st2",
    staffName: "Sunita Devi",
    designation: "Teacher",
    year: "2026-27",
    selfScores: {
      teaching_quality: 15,
      punctuality: 14,
      student_engagement: 15,
      administrative_tasks: 13,
      professional_development: 14,
    },
    managerScores: {
      teaching_quality: 14,
      punctuality: 15,
      student_engagement: 14,
      administrative_tasks: 14,
      professional_development: 13,
    },
    status: "Completed",
    overallGrade: "B+",
    comments:
      "Good performance overall. Needs to improve on professional development activities.",
  },
  {
    id: "apr3",
    staffId: "st3",
    staffName: "Rajesh Kumar",
    designation: "Assistant Teacher",
    year: "2026-27",
    selfScores: {
      teaching_quality: 16,
      punctuality: 15,
      student_engagement: 17,
      administrative_tasks: 14,
      professional_development: 15,
    },
    managerScores: {},
    status: "Pending Manager Review",
    comments: "",
  },
  {
    id: "apr4",
    staffId: "st4",
    staffName: "Meena Joshi",
    designation: "Teacher",
    year: "2026-27",
    selfScores: {
      teaching_quality: 17,
      punctuality: 16,
      student_engagement: 18,
      administrative_tasks: 15,
      professional_development: 16,
    },
    managerScores: {},
    status: "Pending Manager Review",
    comments: "",
  },
  {
    id: "apr5",
    staffId: "st5",
    staffName: "Suresh Patel",
    designation: "Lab Assistant",
    year: "2026-27",
    selfScores: {},
    managerScores: {},
    status: "Pending Self Review",
    comments: "",
  },
];
