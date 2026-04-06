export const AUTH_LOGIN = "/auth/login";
export const AUTH_LOGIN_MFA = "/auth/login/mfa";
export const AUTH_MFA_SETUP = "/auth/mfa/setup";
export const AUTH_MFA_VERIFY = "/auth/mfa/verify";

export const SUPERADMIN_CREATE_COMPANY = "/superadmin/create-company";
export const SUPERADMIN_INVITE_COMPANY_ADMIN = "/superadmin/invite-company-admin";
export const SUPERADMIN_ACTIVATE_COMPANY_ADMIN = "/superadmin/activate";
export const SUPERADMIN_COMPANIES = "/superadmin/companies";

export const COMPANY_PENDING_USERS = "/company/users/pending";
export const COMPANY_USERS = "/company/users";
export const COMPANY_INVITE_USER = "/company/users/invite";
export const COMPANY_APPROVE_USER = (userId) => `/company/users/${userId}/approve`;
export const COMPANY_REJECT_USER = (userId) => `/company/users/${userId}/reject`;
