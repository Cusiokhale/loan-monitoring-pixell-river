export interface AuthorizationOptions {
    hasRole: Array<"user" | "officer" | "manager" | "admin">;
    allowSameUser?: boolean;
}