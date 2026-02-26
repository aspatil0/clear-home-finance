// import { createContext, useContext, useState, ReactNode } from "react";

// type UserRole = "admin" | "treasurer" | "resident" | "superadmin";

// interface AuthUser {
//   id: string;
//   name: string;
//   email: string;
//   role: UserRole;
//   flatNumber?: string;
//   societyName?: string;
// }

// interface AuthContextType {
//   user: AuthUser | null;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
//   isLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// const mockUsers: Record<string, AuthUser> = {
//   "superadmin@societyhub.com": { id: "0", name: "System Admin", email: "superadmin@societyhub.com", role: "superadmin" },
//   "admin@greenvalley.com": { id: "1", name: "Rajesh Kumar", email: "admin@greenvalley.com", role: "admin", societyName: "Green Valley Residency" },
//   "treasurer@greenvalley.com": { id: "2", name: "Priya Sharma", email: "treasurer@greenvalley.com", role: "treasurer", societyName: "Green Valley Residency" },
//   "resident@greenvalley.com": { id: "3", name: "Amit Patel", email: "resident@greenvalley.com", role: "resident", flatNumber: "A-301", societyName: "Green Valley Residency" },
// };

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const login = async (email: string, _password: string) => {
//     setIsLoading(true);
//     await new Promise((r) => setTimeout(r, 800));
//     const found = mockUsers[email.toLowerCase()];
//     if (!found) throw new Error("Invalid credentials");
//     setUser(found);
//     setIsLoading(false);
//   };

//   const logout = () => setUser(null);

//   return (
//     <AuthContext.Provider value={{ user, login, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be inside AuthProvider");
//   return ctx;
// }


// // import { createContext, useContext, useState, ReactNode } from "react";

// // type UserRole = "admin" | "treasurer" | "resident" | "superadmin";

// // interface AuthUser {
// //   id: string;
// //   name: string;
// //   email: string;
// //   role: UserRole;
// //   flatNumber?: string;
// //   societyName?: string;
// // }

// // interface AuthContextType {
// //   user: AuthUser | null;
// //   login: (email: string, password: string) => Promise<void>;
// //   logout: () => void;
// //   isLoading: boolean;
// // }

// // const AuthContext = createContext<AuthContextType | null>(null);

// // // Replace the login function with real API call when backend is ready
// // const login = async (email: string, password: string) => {
// //   setIsLoading(true);
// //   try {
// //     // Example using fetch (replace URL with your backend endpoint)
// //     const response = await fetch("https://your-backend-api.com/auth/login", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ email, password })
// //     });
// //     if (!response.ok) throw new Error("Invalid credentials");
// //     const data = await response.json();
// //     // Assume API returns user object and token
// //     setUser(data.user);
// //     // Optionally store token in localStorage/sessionStorage
// //     // localStorage.setItem('token', data.token);
// //   } catch (err) {
// //     throw err;
// //   } finally {
// //     setIsLoading(false);
// //   }
// // };

// // const logout = () => setUser(null);

// // return (
// //   <AuthContext.Provider value={{ user, login, logout, isLoading }}>
// //     {children}
// //   </AuthContext.Provider>
// // );

// // export function useAuth() {
// //   const ctx = useContext(AuthContext);
// //   if (!ctx) throw new Error("useAuth must be inside AuthProvider");
// //   return ctx;
// // }


// import { createContext, useContext, useState, ReactNode, useEffect } from "react";
// import axios from "axios";

// /* ---------- Types ---------- */

// type UserRole = "admin" | "treasurer" | "resident" | "superadmin";

// interface AuthUser {
//   id: string;
//   name?: string;
//   email: string;
//   role: UserRole;
// }

// interface AuthContextType {
//   user: AuthUser | null;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
//   isLoading: boolean;
// }

// /* ---------- Context ---------- */

// const AuthContext = createContext<AuthContextType | null>(null);

// const AUTH_KEY = "payplatter_auth";
// const API_URL = "https://dev.authentication.payplatter.in/auth";
// const APPLICATION_ID = "SOCIETY_HUB";

// /* ---------- Provider ---------- */

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   // restore login on refresh
//   useEffect(() => {
//     const stored = localStorage.getItem(AUTH_KEY);
//     if (!stored) return;

//     const parsed = JSON.parse(stored);
//     setUser(parsed.user);

//     axios.defaults.headers.common[
//       "Authorization"
//     ] = `${parsed.token_type.value} ${parsed.access_token}`;
//   }, []);

//   const login = async (email: string, password: string) => {
//     setIsLoading(true);
//     try {
//       const res = await axios.post(
//         `${API_URL}/sign-in`,
//         {
//           username: email,
//           password,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "application-id": APPLICATION_ID,
//           },
//         }
//       );

//       const authData = res.data.results.data;

//       // 🔁 map backend role → UI role
//       const roleMap: Record<string, UserRole> = {
//         "SUPER-ADMIN": "superadmin",
//         ADMIN: "admin",
//         USER: "resident",
//       };

//       const loggedInUser: AuthUser = {
//         id: authData.user.external_id,
//         email: authData.user.user_email,
//         name: authData.user.display_name,
//         role: roleMap[authData.user.type],
//       };

//       setUser(loggedInUser);
//       localStorage.setItem(AUTH_KEY, JSON.stringify(authData));

//       axios.defaults.headers.common[
//         "Authorization"
//       ] = `${authData.token_type.value} ${authData.access_token}`;
//     } catch (err) {
//       console.error("LOGIN FAILED", err);
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem(AUTH_KEY);
//     delete axios.defaults.headers.common["Authorization"];
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// /* ---------- Hook ---------- */

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be inside AuthProvider");
//   return ctx;
// }


import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";

/* ---------------- TYPES ---------------- */

type UserRole = "superadmin" | "admin" | "treasurer" | "resident";

interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  societyName?: string;
  societyId?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (updates: Partial<AuthUser>) => void;
}

/* ---------------- CONTEXT ---------------- */

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = "payplatter_auth";
const API_URL = "https://dev.authentication.payplatter.in/auth";
export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`;
export const LOGIN_URL = `${API_URL}/sign-in`;
const APPLICATION_ID = "PRMS.Mp9N3bRcT6FgYqZ";  //sir porvide appliction id

// Local backend for resident logins
const LOCAL_API = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5000";


/* ---------------- PROVIDER ---------------- */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateUser = (updates: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      try {
        const stored = localStorage.getItem(AUTH_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.user) {
            parsed.user = { ...parsed.user, ...updates };
            localStorage.setItem(AUTH_KEY, JSON.stringify(parsed));
          } else if (parsed.user === undefined && parsed.user !== undefined) {
            // noop
          } else {
            if (parsed.user) {
              parsed.user = { ...parsed.user, ...updates };
              localStorage.setItem(AUTH_KEY, JSON.stringify(parsed));
            }
          }
        }
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  // restore session
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return;
    const parsed = JSON.parse(stored);

    // Handle local backend shape: { token, user: { id, email, role, name? } }
    if (parsed.token && parsed.user && parsed.user.email) {
      const localUser = parsed.user;
      setUser({
        id: localUser.id ? String(localUser.id) : localUser.email,
        email: localUser.email,
        role: localUser.role as UserRole,
        name: localUser.name || undefined,
        societyId: localUser.societyId ? String(localUser.societyId) : undefined,
      });
      axios.defaults.headers.common["Authorization"] = `Bearer ${parsed.token}`;
      return;
    }

    // Handle external provider shape used earlier
    if (parsed.token_type && parsed.access_token && parsed.user) {
      const u = parsed.user;
      setUser({
        id: u.external_id,
        email: u.user_email,
        role: mapRole(u.type),
        name: u.display_name,
        societyId: u.local_society_id ? String(u.local_society_id) : undefined,
      });
      axios.defaults.headers.common["Authorization"] = `${parsed.token_type.value} ${parsed.access_token}`;
      return;
    }

    // Fallback: try to extract any available user/email
    if (parsed.user && parsed.user.email) {
      setUser({ id: parsed.user.email, email: parsed.user.email, role: "resident" });
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Try local auth first (resident users created from Society Setup)
      let loggedUser: AuthUser | null = null;
      try {
        const localRes = await axios.post(`${LOCAL_API}/auth/login`, { email, password });
        // local API returns { token, user }
        const { token, user: localUser } = localRes.data;
        loggedUser = {
          id: String(localUser.id),
          email: localUser.email,
          role: localUser.role as AuthUser['role'],
          name: localUser.name || undefined,
          societyId: localUser.societyId ? String(localUser.societyId) : undefined,
        };

        setUser(loggedUser);
        // store full local user + token so restore can pick it up
        localStorage.setItem(AUTH_KEY, JSON.stringify({ token, user: localUser }));
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (localErr) {
        // fallback to external auth provider
        const res = await axios.post(
          `${API_URL}/sign-in`,
          { username: email, password },
          {
            headers: {
              "Content-Type": "application/json",
              "application-id": APPLICATION_ID,
            },
          }
        );

        const authData = res.data.results.data;

        loggedUser = {
          id: authData.user.external_id,
          email: authData.user.user_email,
          role: mapRole(authData.user.type),
          name: authData.user.display_name,
        };

        setUser(loggedUser);
        localStorage.setItem(AUTH_KEY, JSON.stringify(authData));

        axios.defaults.headers.common["Authorization"] = `${authData.token_type.value} ${authData.access_token}`;

        // 🧠 Bridge: Try to fetch local metadata (societyId) for this email
        try {
          const metaRes = await axios.get(`${LOCAL_API}/user-metadata/${email}`);
          if (metaRes.data.societyId) {
            const updated = { ...loggedUser, societyId: String(metaRes.data.societyId) };
            setUser(updated);
            // Update storage too
            authData.user.local_society_id = metaRes.data.societyId;
            localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
          }
        } catch (metaErr) {
          console.warn("Could not fetch local metadata for externally logged in user");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ---------------- HOOK ---------------- */

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/* ---------------- ROLE MAP ---------------- */

function mapRole(apiRole: string): UserRole {
  switch (apiRole) {
    case "SUPER-ADMIN":
      return "superadmin";
    case "ADMIN":
      return "admin";
    case "TREASURER":
      return "treasurer";
    default:
      return "resident";
  }
}