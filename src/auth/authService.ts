// // // src/auth/authService.ts
// // import axios from "axios";
// // import { AuthModel } from "./authTypes";

// // const API_URL = "https://dev.authentication.payplatter.in/auth";

// // export const LOGIN_URL = `${API_URL}/sign-in`;
// // export const VERIFY_TOKEN_URL = `${API_URL}/verify_token`;

// // export async function login(username: string, password: string) {
// //   const response = await axios.post(LOGIN_URL, {
// //     username,
// //     password,
// //   });

// //   return response.data.results.data as AuthModel;
// // }

// // export async function verifyToken(token: string) {
// //   return axios.post(
// //     VERIFY_TOKEN_URL,
// //     {},
// //     {
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //       },
// //     }
// //   );
// // }

// // src/api/auth.ts or src/auth/authService.ts
// import axios from "axios";
// import { AuthModel } from "./authTypes";

// const API_URL = "https://dev.authentication.payplatter.in/auth";
// const APPLICATION_ID = "SOCIETY_HUB"; // confirm with backend

// export const LOGIN_URL = `${API_URL}/sign-in`;

// export async function login(username: string, password: string) {
//   const response = await axios.post(
//     LOGIN_URL,
//     {
//       username,
//       password,
//     },
//     {
//       headers: {
//         "Content-Type": "application/json",
//         "application-id": APPLICATION_ID,
//       },
//     }
//   );

//   return response.data.results.data as AuthModel;
// }


import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000" });

// Local login against backend /auth/login
export async function login(email: string, password: string) {
  const res = await API.post(`/auth/login`, { email, password });
  // backend returns { token, user }
  const { token, user } = res.data;

  // normalize to the shape expected by AuthProvider
  return {
    token_type: { value: "Bearer" },
    access_token: token,
    user,
  };
}

export async function verifyToken(accessToken: string) {
  try {
    const res = await API.post(`/auth/verify`, {}, { headers: { Authorization: `Bearer ${accessToken}` } });
    return res.data;
  } catch (e) {
    return null;
  }
}