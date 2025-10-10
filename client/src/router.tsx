import AuthLayout from "@/layouts/AuthLayout";
import LoginPages from "@/modules/auth/pages/LoginPages";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function Router() {
  return (
    <BrowserRouter>
      {/* Reemplaza 'mi-app' con el nombre de tu subdirectorio */}
      {/* <BrowserRouter basename="/dms"> */}

      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPages />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
