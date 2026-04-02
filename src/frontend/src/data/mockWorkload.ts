export type TeacherWorkload = {
  staffId: string;
  name: string;
  designation: string;
  subjects: string[];
  classes: string[];
  periodsPerWeek: number;
  maxPeriodsAllowed: number;
  extraDuties: string[];
  workloadPct: number;
};

function mkEntry(
  staffId: string,
  name: string,
  designation: string,
  subjects: string[],
  classes: string[],
  periodsPerWeek: number,
  maxPeriodsAllowed: number,
  extraDuties: string[],
): TeacherWorkload {
  return {
    staffId,
    name,
    designation,
    subjects,
    classes,
    periodsPerWeek,
    maxPeriodsAllowed,
    extraDuties,
    workloadPct: Math.round((periodsPerWeek / maxPeriodsAllowed) * 100),
  };
}

export const mockWorkload: TeacherWorkload[] = [
  mkEntry(
    "STF001",
    "Amit Verma",
    "Senior Teacher",
    ["Mathematics"],
    ["9A", "9B", "10A", "10B"],
    36,
    35,
    ["Exam Coordinator", "PTM Incharge"],
  ),
  mkEntry(
    "STF002",
    "Sunita Devi",
    "Teacher",
    ["Science", "Biology"],
    ["8A", "8B", "9A"],
    34,
    35,
    ["Lab Supervisor"],
  ),
  mkEntry(
    "STF003",
    "Rajesh Kumar",
    "Senior Teacher",
    ["English"],
    ["6A", "6B", "7A", "7B", "8A"],
    38,
    35,
    ["Sports Incharge", "Cultural Committee", "Library Duty"],
  ),
  mkEntry(
    "STF004",
    "Priya Singh",
    "Teacher",
    ["Hindi", "Social Science"],
    ["6A", "7A", "8A"],
    26,
    35,
    ["Morning Assembly"],
  ),
  mkEntry(
    "STF005",
    "Mohan Lal",
    "PGT Teacher",
    ["Physics", "Chemistry"],
    ["9A", "9B", "10A", "10B"],
    40,
    35,
    ["Lab Incharge", "Safety Officer", "Exam Duty"],
  ),
  mkEntry(
    "STF006",
    "Anita Sharma",
    "Teacher",
    ["Computer Science"],
    ["7A", "7B"],
    15,
    35,
    [],
  ),
  mkEntry(
    "STF007",
    "Vikram Nair",
    "Teacher",
    ["Social Science", "History"],
    ["6B", "7B"],
    14,
    35,
    [],
  ),
  mkEntry(
    "STF008",
    "Kavita Patel",
    "Senior Teacher",
    ["Mathematics", "Science"],
    ["6A", "6B", "7A", "8B", "9B"],
    33,
    35,
    ["House Mistress"],
  ),
];
