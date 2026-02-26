// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import { Building2, Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const { login, isLoading } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     try {
//       await login(email, password);
//       const role = email.includes("superadmin") ? "superadmin" : email.includes("admin") ? "admin" : email.includes("treasurer") ? "treasurer" : "resident";
//       navigate(`/${role}`);
//     } catch {
//       setError("Invalid email or password. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background p-4">
//       <div className="w-full max-w-sm animate-fade-in">
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 mb-4">
//             <Building2 className="h-8 w-8 text-primary" />
//           </div>
//           <h1 className="text-2xl font-semibold tracking-tight">SocietyHub</h1>
//           <p className="text-sm text-muted-foreground mt-1">Housing Society Management</p>
//         </div>

//         <div className="bg-card rounded-lg border p-6">
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="you@society.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             {error && (
//               <p className="text-sm text-destructive">{error}</p>
//             )}
//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Sign In
//             </Button>
//           </form>
//         </div>

//         <div className="mt-6 bg-muted rounded-lg p-4">
//           <p className="text-xs font-medium text-muted-foreground mb-2">Demo accounts:</p>
//           <div className="space-y-1 text-xs text-muted-foreground">
//             <p><span className="font-medium text-foreground">SuperAdmin:</span> superadmin@societyhub.com</p>
//             <p><span className="font-medium text-foreground">Admin:</span> admin@greenvalley.com</p>
//             <p><span className="font-medium text-foreground">Treasurer:</span> treasurer@greenvalley.com</p>
//             <p><span className="font-medium text-foreground">Resident:</span> resident@greenvalley.com</p>
//             <p className="text-muted-foreground/60 mt-1">Any password works</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthUserType } from "@/contexts/authTypes";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, user, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      // navigation handled in useEffect after user is set
    } catch {
      setError("Invalid email or password. Please try again.");
    }
  };

  // ✅ Navigate AFTER successful login
  // useEffect(() => {
  //   if (!user) return;

  //   switch (user.role) {
  //     case AuthUserType.SUPER_ADMIN:
  //       navigate("/superadmin");
  //       break;

  //     case AuthUserType.ADMIN:
  //       navigate("/admin");
  //       break;

  //     case AuthUserType.USER:
  //       navigate("/resident");
  //       break;

  //     default:
  //       navigate("/login");
  //   }
  // }, [user, navigate]);

  useEffect(() => {
  if (!user) return;

  switch (user.role) {
    case "superadmin":
      navigate("/superadmin");
      break;
    case "admin":
      navigate("/admin");
      break;
    case "treasurer":
      navigate("/treasurer");
      break;
    default:
      navigate("/resident");
  }
}, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 mb-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">SocietyHub</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Housing Society Management
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@society.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}