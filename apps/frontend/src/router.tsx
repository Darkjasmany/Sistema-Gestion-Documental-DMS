import ConfirmAccountPages from "@/features/auth/pages/ConfirmAccount";
import ForgotPasswordPages from "@/features/auth/pages/ForgotPassword";
import LoginPages from "@/features/auth/pages/LoginPages";
import NewPasswordPages from "@/features/auth/pages/NewPassword";
import RegisterPages from "@/features/auth/pages/Register";
import RequestNewCodePages from "@/features/auth/pages/RequestNewCode";
import AuthLayout from "@/layouts/Auth";
import { BrowserRouter, Route, Routes } from "react-router-dom";

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
