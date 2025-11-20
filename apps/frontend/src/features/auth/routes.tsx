import ConfirmAccountPages from "@/features/auth/pages/ConfirmAccountPage";
import ForgotPasswordPages from "@/features/auth/pages/ForgotPasswordPage";
import LoginPages from "@/features/auth/pages/LoginPage";
import NewPasswordPages from "@/features/auth/pages/NewPasswordPage";
import RegisterPages from "@/features/auth/pages/RegisterPage";
import RequestNewCodePages from "@/features/auth/pages/RequestNewCodePage";
import AuthLayout from "@/layouts/Auth";
import { Route } from "react-router-dom";

export default function AuthRoutes() {
  return (
    <>
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<LoginPages />} />
        <Route path="/auth/register" element={<RegisterPages />} />
        <Route path="/auth/confirm-account" element={<ConfirmAccountPages />} />
        <Route path="/auth/request-code" element={<RequestNewCodePages />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPages />} />
        <Route path="/auth/new-password" element={<NewPasswordPages />} />
      </Route>
    </>
  );
}
