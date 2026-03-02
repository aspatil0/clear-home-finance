// import axios from "axios";

// const API_URL = "https://dev.authentication.payplatter.in/auth";
// export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`;
// export const LOGIN_URL = `${API_URL}/sign-in`;
// export function login(username: string, password: string) {
//     return axios.post<AuthResponse>(LOGIN_URL, {
//         username,
//         password,
//     });
// }

// export interface AuthModel {
//     refresh_token: string,
//     access_token: string,
//     access_token_expiry: number,
//     token_type: {
//         value: string
//     },
//     user: UserModel
// }

// export interface UserModel {
//     id?: number;
//     external_id: string,
//     logo?: string,
//     name?: string,
//     display_name?: string,
//     contact?: string,
//     user_name: string,
//     user_email: string,
//     type: AuthUserType
// }

// export enum AuthUserType {
//     USER = "USER",
//     // ORGANISATION = "ORGANISATION",
//     // SUPER_USER = "SUPER-USER",
//     SUPER_ADMIN = "SUPER-ADMIN",
//     // STAFF = "STAFF",
//     ADMIN = "ADMIN",
//     // TENANT = "TENANT"
// }

// export enum TokenType {
//     BEARER = "Bearer",
//     BASIC = "Basic",
//     DIGEST = "Digest",
//     HOBA = "HOBA",
//     MUTUAL = "Mutual",
//     AWS4_HMAC_SHA256 = "AWS4-HMAC-SHA256",
//     OAUTH = "OAuth",
//     JWT = "JWT",
//     SAML = "SAML",
//     API_KEY = "API-Key",
//     NEGO = "Negotiate",
//     NTLM = "NTLM",
//     POPO = "PoP",
// }

// export interface AuthResponse {
//     name: string,
//     summary: string,
//     url: string,
//     results: {
//         message: string,
//         data: AuthModel
//     }
// }



import axios from "axios";

// Use local backend for authentication during development
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const LOGIN_URL = `${API_URL}/auth/login`;

// Local login function
export async function login(username: string, password: string) {
  const response = await axios.post(
    LOGIN_URL,
    {
      email: username, // local backend expects 'email'
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}