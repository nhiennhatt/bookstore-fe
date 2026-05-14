export interface LoginResponse {
  token: string;
  refreshToken: string;
}

/** POST /auth/register — CreateUserValidation */
export interface CreateUserPayload {
  email: string;
  username: string;
  password: string;
}

/** POST /auth/register — CreateUserResponse */
export interface CreateUserResponse {
  id: string;
}
