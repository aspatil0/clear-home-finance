// src/auth/authTypes.ts

export interface AuthModel {
  refresh_token: string;
  access_token: string;
  access_token_expiry: number;
  token_type: {
    value: string;
  };
  user: UserModel;
}

export interface UserModel {
  id?: number;
  external_id: string;
  logo?: string;
  name?: string;
  display_name?: string;
  contact?: string;
  user_name: string;
  user_email: string;
  type: AuthUserType;
}

export enum AuthUserType {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER-ADMIN",
}