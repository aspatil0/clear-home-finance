// // src/auth/AuthProvider.tsx
// import { ReactNode, useEffect, useState } from "react";
// import { AuthContext } from "./AuthContext";
// import { AuthModel, UserModel } from "./authTypes";
// import { login as loginService } from "./authService";
// import axios from "axios";

// const AUTH_KEY = "payplatter_auth";

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [auth, setAuth] = useState<AuthModel | null>(null);
//   const [user, setUser] = useState<UserModel | null>(null);

//   useEffect(() => {
//     const storedAuth = localStorage.getItem(AUTH_KEY);
//     if (storedAuth) {
//       const parsedAuth: AuthModel = JSON.parse(storedAuth);
//       setAuth(parsedAuth);
//       setUser(parsedAuth.user);

//       axios.defaults.headers.common[
//         "Authorization"
//       ] = `${parsedAuth.token_type.value} ${parsedAuth.access_token}`;
//     }
//   }, []);

// //   const loginUser = async (username: string, password: string) => {
// //     const authData = await loginService(username, password);

// //     setAuth(authData);
// //     setUser(authData.user);

// //     localStorage.setItem(AUTH_KEY, JSON.stringify(authData));

// //     axios.defaults.headers.common[
// //       "Authorization"
// //     ] = `${authData.token_type.value} ${authData.access_token}`;
// //   };

// // ✅ RENAMED
//   const login = async (username: string, password: string) => {
//     setIsLoading(true);
//     try {
//       const authData = await loginService(username, password);

//       setAuth(authData);
//       setUser(authData.user);

//       localStorage.setItem(AUTH_KEY, JSON.stringify(authData));

//       axios.defaults.headers.common[
//         "Authorization"
//       ] = `${authData.token_type.value} ${authData.access_token}`;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     setAuth(null);
//     setUser(null);
//     localStorage.removeItem(AUTH_KEY);
//     delete axios.defaults.headers.common["Authorization"];
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         auth,
//         user,
//         isAuthenticated: !!auth,
//         loginUser,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// src/auth/AuthProvider.tsx
import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { AuthModel, UserModel } from "./authTypes";
import { login as loginService } from "./authService";
import axios from "axios";

const AUTH_KEY = "payplatter_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthModel | null>(null);
  const [user, setUser] = useState<UserModel | null>(null);
  const [isLoading, setIsLoading] = useState(false); // ✅ FIX 1

  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_KEY);
    if (storedAuth) {
      const parsedAuth: AuthModel = JSON.parse(storedAuth);
      setAuth(parsedAuth);
      setUser(parsedAuth.user);

      axios.defaults.headers.common[
        "Authorization"
      ] = `${parsedAuth.token_type.value} ${parsedAuth.access_token}`;
    }
  }, []);

  // ✅ FIX 2: proper try/finally
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const authData = await loginService(username, password);

      setAuth(authData);
      setUser(authData.user);

      localStorage.setItem(AUTH_KEY, JSON.stringify(authData));

      axios.defaults.headers.common[
        "Authorization"
      ] = `${authData.token_type.value} ${authData.access_token}`;
    } catch (error) {
      console.error("LOGIN FAILED", error);
      throw error; // important so LoginPage can show error
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuth(null);
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        user,
        isAuthenticated: !!auth,
        isLoading,
        login, // ✅ matches LoginPage
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}