import AuthRoutes from "@/features/auth/routes";
import { BrowserRouter, Routes } from "react-router-dom";

export default function Router() {
  return (
    <BrowserRouter>
      {/* Reemplaza 'mi-app' con el nombre de tu subdirectorio */}
      {/* <BrowserRouter basename="/dms"> */}

      <Routes>
        <AuthRoutes />
      </Routes>
    </BrowserRouter>
  );
}
