// import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
// import "./index.css";
// import { AuthProvider } from "./auth/AuthProvider";

// createRoot(document.getElementById("root")!).render(<App />);


// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";
// import "./index.css";

// // ⚠️ IMPORTANT: use ONE AuthProvider only
// import { AuthProvider } from "./contexts/AuthContext";

// createRoot(document.getElementById("root")!).render(
//   <AuthProvider>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </AuthProvider>
// );

// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";
// import "./index.css";
// import { AuthProvider } from "./contexts/AuthContext";

// createRoot(document.getElementById("root")!).render(
//   <AuthProvider>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </AuthProvider>
// );

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "@/contexts/AuthContext";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);