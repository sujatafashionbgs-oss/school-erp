import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export type Result_2 = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export interface UserSession {
    userId: string;
    lastActivity: bigint;
    role: string;
    isOnline: boolean;
}
export interface AttendanceReport {
    present: bigint;
    date: string;
    late: bigint;
    section: string;
    absent: bigint;
    className: string;
    percentage: number;
}
export interface Stats {
    totalWithPermissions: bigint;
    totalUsers: bigint;
}
export type Result__1 = {
    __kind__: "ok";
    ok: StudentMarks;
} | {
    __kind__: "err";
    err: string;
};
export type AttendanceId = string;
export interface FeePayment {
    id: FeeId;
    categories: Array<FeeCategoryPayment>;
    status: string;
    txnId: string;
    studentId: StudentId;
    balance: number;
    studentName: string;
    section: string;
    academicYear: string;
    totalAmount: number;
    admissionNo: string;
    paymentDate: string;
    paymentMode: string;
    receiptNo: string;
    paidAmount: number;
    className: string;
}
export type Result_1 = {
    __kind__: "ok";
    ok: boolean;
} | {
    __kind__: "err";
    err: string;
};
export interface UserRecord {
    id: UserId;
    status: string;
    permissions: Array<string>;
    name: string;
    createdAt: Timestamp;
    role: string;
    email: string;
    updatedAt: Timestamp;
    phone: string;
}
export type ExamId = string;
export interface FeeReportPage {
    total: bigint;
    page: bigint;
    pageSize: bigint;
    items: Array<FeeReport>;
}
export interface StudentPage {
    total: bigint;
    students: Array<StudentRecord>;
    page: bigint;
    pageSize: bigint;
}
export type FeeId = string;
export interface AuditRecord {
    id: string;
    status: string;
    action: string;
    resourceId: string;
    actorId: string;
    resourceType: string;
    afterValue: string;
    timestamp: bigint;
    beforeValue: string;
}
export interface ExamResult {
    examTitle: string;
    subject: string;
    grade: string;
    maxMarks: bigint;
    obtainedMarks: number;
}
export interface StudentMarks {
    studentId: StudentId;
    studentName: string;
    rank: bigint;
    grade: string;
    admissionNo: string;
    examId: ExamId;
    obtainedMarks: number;
    remarks: string;
}
export interface AttendanceRecord {
    id: AttendanceId;
    status: AttendanceStatus;
    studentId: StudentId;
    date: string;
    section: string;
    markedBy: string;
    className: string;
    remarks: string;
}
export interface StudentSearchQuery {
    page: bigint;
    pageSize: bigint;
    nameQuery?: string;
    section?: string;
    admissionNo?: string;
    className?: string;
}
export interface FeeCategoryPayment {
    categoryId: FeeStructureId;
    categoryName: string;
    paid: number;
    amount: number;
}
export type Result__1_1 = {
    __kind__: "ok";
    ok: ExamRecord;
} | {
    __kind__: "err";
    err: string;
};
export interface AcademicReport {
    examTitle: string;
    section: string;
    averageMarks: number;
    examId: ExamId;
    topScore: number;
    className: string;
    passPercentage: number;
}
export interface AttendanceReportPage {
    total: bigint;
    page: bigint;
    pageSize: bigint;
    items: Array<AttendanceReport>;
}
export type FeeStructureId = string;
export interface AttendanceSummary {
    studentId: StudentId;
    halfDay: bigint;
    present: bigint;
    late: bigint;
    totalDays: bigint;
    absent: bigint;
    percentage: number;
}
export interface FeeCategory {
    id: FeeStructureId;
    name: string;
    dueDate: string;
    section: string;
    academicYear: string;
    isOptional: boolean;
    amount: number;
    className: string;
}
export type StudentId = string;
export interface ReportCardData {
    studentId: StudentId;
    studentName: string;
    overallGrade: string;
    rank: bigint;
    section: string;
    exams: Array<ExamResult>;
    academicYear: string;
    attendance: AttendanceSummary;
    rollNo: bigint;
    className: string;
    remarks: string;
}
export type UserId = string;
export interface AcademicReportPage {
    total: bigint;
    page: bigint;
    pageSize: bigint;
    items: Array<AcademicReport>;
}
export type Result = {
    __kind__: "ok";
    ok: UserRecord;
} | {
    __kind__: "err";
    err: string;
};
export interface ExamQuery {
    subject?: string;
    page: bigint;
    term?: string;
    pageSize: bigint;
    section?: string;
    academicYear?: string;
    className?: string;
}
export interface FeeReport {
    outstanding: number;
    date: string;
    totalCollected: number;
    cashPayments: number;
    totalStudents: bigint;
    onlinePayments: number;
}
export interface ExamRecord {
    id: ExamId;
    title: string;
    duration: bigint;
    subject: string;
    createdBy: string;
    term: string;
    section: string;
    academicYear: string;
    maxMarks: bigint;
    examDate: string;
    className: string;
}
export interface FeeSummary {
    totalCollected: number;
    totalStudents: bigint;
    totalOutstanding: number;
    paidStudents: bigint;
}
export interface StudentRecord {
    id: StudentId;
    dob: string;
    status: string;
    feeStatus: string;
    admissionDate: string;
    name: string;
    section: string;
    bloodGroup: string;
    address: string;
    gender: string;
    admissionNo: string;
    category: string;
    phone: string;
    rollNo: bigint;
    religion: string;
    parentMobile: string;
    className: string;
    parentName: string;
}
export enum AttendanceStatus {
    halfDay = "halfDay",
    present = "present",
    late = "late",
    absent = "absent"
}
export interface backendInterface {
    clearAuditRecords(): Promise<Result_2>;
    clearSession(userId: string): Promise<void>;
    deleteExam(id: string): Promise<Result_1>;
    deleteFeeCategory(id: string): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deletePermissions(userId: string): Promise<Result_1>;
    deleteStudent(id: string): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteUser(id: string): Promise<Result_1>;
    getAcademicReport(className: string | null, academicYear: string | null, page: bigint, pageSize: bigint): Promise<AcademicReportPage>;
    getAttendanceReport(dateFrom: string, dateTo: string, className: string | null, section: string | null, page: bigint, pageSize: bigint): Promise<AttendanceReportPage>;
    getAttendanceSummary(studentId: string, dateFrom: string, dateTo: string): Promise<AttendanceSummary>;
    getDatesWithAttendance(className: string, section: string): Promise<Array<string>>;
    getFeeReport(dateFrom: string, dateTo: string, className: string | null, page: bigint, pageSize: bigint): Promise<FeeReportPage>;
    getFeeSummary(academicYear: string | null): Promise<FeeSummary>;
    getStats(): Promise<Stats>;
    getStudentFeeStatus(studentId: string, academicYear: string): Promise<{
        due: number;
        balance: number;
        paid: number;
    }>;
    getStudentStats(): Promise<{
        total: bigint;
        active: bigint;
        inactive: bigint;
    }>;
    hasAttendanceForDate(date: string, className: string, section: string): Promise<boolean>;
    loadAllStudents(page: bigint, pageSize: bigint): Promise<StudentPage>;
    loadAllUsers(): Promise<Array<UserRecord>>;
    loadAttendanceByDate(date: string, className: string, section: string): Promise<Array<AttendanceRecord>>;
    loadAuditRecords(): Promise<Array<AuditRecord>>;
    loadExams(q: ExamQuery): Promise<{
        total: bigint;
        exams: Array<ExamRecord>;
    }>;
    loadFeeCategories(className: string | null, academicYear: string | null): Promise<Array<FeeCategory>>;
    loadMarksByExam(examId: string): Promise<Array<StudentMarks>>;
    loadOnlineSessions(thresholdSeconds: bigint): Promise<Array<UserSession>>;
    loadPaymentsByDateRange(dateFrom: string, dateTo: string, className: string | null, section: string | null, page: bigint, pageSize: bigint): Promise<{
        total: bigint;
        payments: Array<FeePayment>;
    }>;
    loadPaymentsByStudent(studentId: string): Promise<Array<FeePayment>>;
    loadPermissions(userId: string): Promise<Array<string>>;
    loadStudentAttendance(studentId: string, dateFrom: string | null, dateTo: string | null): Promise<Array<AttendanceRecord>>;
    loadStudentById(id: string): Promise<StudentRecord | null>;
    loadStudentReportCard(studentId: string, className: string, academicYear: string): Promise<ReportCardData>;
    loadStudentsByClass(className: string, section: string | null): Promise<Array<StudentRecord>>;
    loadUserById(id: string): Promise<Result>;
    saveAllMarks(entries: Array<StudentMarks>): Promise<Array<Result__1>>;
    saveAuditRecord(record: AuditRecord): Promise<Result_2>;
    saveDailyAttendance(date: string, className: string, section: string, records: Array<AttendanceRecord>): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveExam(exam: ExamRecord): Promise<Result__1_1>;
    saveFeeCategory(category: FeeCategory): Promise<{
        __kind__: "ok";
        ok: FeeCategory;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveMarks(entry: StudentMarks): Promise<Result__1>;
    savePayment(payment: FeePayment): Promise<{
        __kind__: "ok";
        ok: FeePayment;
    } | {
        __kind__: "err";
        err: string;
    }>;
    savePermissions(userId: string, permissions: Array<string>): Promise<Result_1>;
    saveStudent(student: StudentRecord): Promise<{
        __kind__: "ok";
        ok: StudentRecord;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveUser(user: UserRecord): Promise<Result>;
    searchStudents(q: StudentSearchQuery): Promise<StudentPage>;
    updateSession(userId: string, role: string): Promise<void>;
}
