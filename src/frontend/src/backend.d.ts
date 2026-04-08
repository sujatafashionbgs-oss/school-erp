import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export type UserId = string;
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
export type Result = {
    __kind__: "ok";
    ok: UserRecord;
} | {
    __kind__: "err";
    err: string;
};
export interface Stats {
    totalWithPermissions: bigint;
    totalUsers: bigint;
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
export interface backendInterface {
    clearAuditRecords(): Promise<Result_2>;
    clearSession(userId: string): Promise<void>;
    deletePermissions(userId: string): Promise<Result_1>;
    deleteUser(id: string): Promise<Result_1>;
    getStats(): Promise<Stats>;
    loadAllUsers(): Promise<Array<UserRecord>>;
    loadAuditRecords(): Promise<Array<AuditRecord>>;
    loadOnlineSessions(thresholdSeconds: bigint): Promise<Array<UserSession>>;
    loadPermissions(userId: string): Promise<Array<string>>;
    loadUserById(id: string): Promise<Result>;
    saveAuditRecord(record: AuditRecord): Promise<Result_2>;
    savePermissions(userId: string, permissions: Array<string>): Promise<Result_1>;
    saveUser(user: UserRecord): Promise<Result>;
    updateSession(userId: string, role: string): Promise<void>;
}
