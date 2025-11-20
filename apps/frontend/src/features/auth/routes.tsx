import ConfirmAccountPages from "@/features/auth/pages/ConfirmAccountPage";
import ForgotPasswordPages from "@/features/auth/pages/ForgotPasswordPage";
import LoginPages from "@/features/auth/pages/LoginPage";
import NewPasswordPages from "@/features/auth/pages/NewPasswordPage";
import RegisterPages from "@/features/auth/pages/RegisterPage";
import RequestNewCodePages from "@/features/auth/pages/RequestNewCodePage";
import AuthLayout from "@/layouts/Auth";
import { Navigate, Route, Routes } from "react-router-dom";

export default function AuthRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPages />} />
        <Route path="register" element={<RegisterPages />} />
        <Route path="confirm-account" element={<ConfirmAccountPages />} />
        <Route path="request-code" element={<RequestNewCodePages />} />
        <Route path="forgot-password" element={<ForgotPasswordPages />} />
        <Route path="new-password" element={<NewPasswordPages />} />
        {/* 
           Si el usuario entra a "/auth" (sin nada más), 
           lo redirigimos automáticamente al login.
        */}
        <Route path="" element={<Navigate to="login" replace />} />
      </Route>
    </Routes>
  );
}
