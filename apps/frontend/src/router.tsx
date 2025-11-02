import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import LoginPages from "@/modules/auth/pages/LoginPages";
import RegisterPages from "@/modules/auth/pages/RegisterPages";
import ConfirmAccountPages from "@/modules/auth/pages/ConfirmAccountPages";
import RequestNewCodePages from "./modules/auth/pages/RequestNewCodePages";
import ForgotPasswordPages from "./modules/auth/pages/ForgotPasswordPages";
import NewPasswordPages from "./modules/auth/pages/NewPasswordPages";

export default function Router() {
  return (
    <BrowserRouter>
      {/* Reemplaza 'mi-app' con el nombre de tu subdirectorio */}
      {/* <BrowserRouter basename="/dms"> */}

      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPages />} />
          <Route path="/auth/register" element={<RegisterPages />} />
          <Route path="/auth/confirm-account" element={<ConfirmAccountPages />} />
          <Route path="/auth/request-code" element={<RequestNewCodePages />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPages />} />
          <Route path="/auth/new-password" element={<NewPasswordPages />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
