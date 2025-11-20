export type UserRole = "customer" | "employee" | "manager" | "owner";

const ROLE_SYNONYMS: Record<UserRole, string[]> = {
    customer: ["customer", "khach hang", "khách hàng"],
    employee: ["employee", "nhan vien", "nhân viên", "staff"],
    manager: ["manager", "quan ly", "quản lý"],
    owner: ["owner", "chu so huu", "chủ sở hữu", "chu cua hang", "chủ cửa hàng"],
};

const normalizeRoleString = (value: string | null | undefined): string | null => {
    if (!value || typeof value !== "string") return null;
    return value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
};

export const canonicalizeRole = (value: string | null | undefined): UserRole | null => {
    const normalized = normalizeRoleString(value);
    if (!normalized) return null;

    const match = (Object.keys(ROLE_SYNONYMS) as UserRole[]).find((role) =>
        ROLE_SYNONYMS[role].some((synonym) => normalized === normalizeRoleString(synonym))
    );

    return match ?? null;
};

const extractRawRoleFromPayload = (payload: unknown): string | null => {
    if (!payload || typeof payload !== "object") {
        return null;
    }

    const data = payload as {
        role?: string | null;
        user?: { role?: string | null } | null;
        data?: {
            role?: string | null;
            user?: { role?: string | null } | null;
        } | null;
        [key: string]: unknown;
    };

    const potentialRoles = [
        data?.role,
        data?.user?.role,
        data?.data?.role,
        data?.data?.user?.role,
    ].filter((value): value is string => typeof value === "string" && value.length > 0);

    return potentialRoles.length > 0 ? potentialRoles[0] : null;
};

export const extractRoleFromPayload = (payload: unknown): UserRole | null => {
    const rawRole = extractRawRoleFromPayload(payload);
    return canonicalizeRole(rawRole);
};

export const persistRoleFromPayload = (payload: unknown) => {
    if (typeof window === "undefined") return;
    const role = extractRoleFromPayload(payload);
    if (role) {
        localStorage.setItem("authRole", role);
    } else {
        localStorage.removeItem("authRole");
    }
};

export const roleHasAdminAccess = (role: UserRole | null | undefined): boolean =>
    role === "manager" || role === "owner";
