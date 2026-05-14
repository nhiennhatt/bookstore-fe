export enum UserRole {
  SUPER_ADMIN = "ROLE_SUPER_ADMIN",
  ADMIN = "ROLE_ADMIN",
  CONTENT_MANAGER = "ROLE_CONTENT_MANAGER",
  PACKER = "ROLE_PACKER",
  INVENTORY_MANAGER = "ROLE_INVENTORY_MANAGER",
  CUSTOMER = "ROLE_CUSTOMER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
}

/** Khớp GET /me — MeResponse */
export interface User {
  avatar?: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  firstName?: string;
  lastName?: string;
  verified: boolean;
}

/** PUT /me — UpdateUserInform */
export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
}
