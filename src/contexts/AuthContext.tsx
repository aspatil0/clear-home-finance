import { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "admin" | "treasurer" | "resident" | "superadmin";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  flatNumber?: string;
  societyName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mockUsers: Record<string, AuthUser> = {
  "superadmin@societyhub.com": { id: "0", name: "System Admin", email: "superadmin@societyhub.com", role: "superadmin" },
  "admin@greenvalley.com": { id: "1", name: "Rajesh Kumar", email: "admin@greenvalley.com", role: "admin", societyName: "Green Valley Residency" },
  "treasurer@greenvalley.com": { id: "2", name: "Priya Sharma", email: "treasurer@greenvalley.com", role: "treasurer", societyName: "Green Valley Residency" },
  "resident@greenvalley.com": { id: "3", name: "Amit Patel", email: "resident@greenvalley.com", role: "resident", flatNumber: "A-301", societyName: "Green Valley Residency" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const found = mockUsers[email.toLowerCase()];
    if (!found) throw new Error("Invalid credentials");
    setUser(found);
    setIsLoading(false);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}


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

// // Replace the login function with real API call when backend is ready
// const login = async (email: string, password: string) => {
//   setIsLoading(true);
//   try {
//     // Example using fetch (replace URL with your backend endpoint)
//     const response = await fetch("https://your-backend-api.com/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password })
//     });
//     if (!response.ok) throw new Error("Invalid credentials");
//     const data = await response.json();
//     // Assume API returns user object and token
//     setUser(data.user);
//     // Optionally store token in localStorage/sessionStorage
//     // localStorage.setItem('token', data.token);
//   } catch (err) {
//     throw err;
//   } finally {
//     setIsLoading(false);
//   }
// };

// const logout = () => setUser(null);

// return (
//   <AuthContext.Provider value={{ user, login, logout, isLoading }}>
//     {children}
//   </AuthContext.Provider>
// );

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be inside AuthProvider");
//   return ctx;
// }
