import InputError from "@/components/InputError.components";
import { updatePasswordWithToken } from "@/features/auth/api/Auth.api";
import type { ResetPasswordInput, TokenInput } from "@selnic/shared";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLock } from "react-icons/ai";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface NewPasswordFormProps {
  token: TokenInput["token"];
}

const NewPasswordForm = ({ token }: NewPasswordFormProps) => {
  const navigate = useNavigate();
  const initialValues: ResetPasswordInput = {
    password: "",
    password_confirmation: "",
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: updatePasswordWithToken,
    onError: error => {
      toast.error(error.message);
    },
    onSuccess: data => {
      toast.success(data);
      reset();
      navigate("/auth/login");
    },
  });

  const handleNewPassword = (formData: ResetPasswordInput) => {
    const data = {
      formData,
      token,
    };
    mutate(data);
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-6 text-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.3)] select-none">
        Define tu Nueva Contraseña
      </h2>
      <form action="" className=" space-y-5" onSubmit={handleSubmit(handleNewPassword)}>
        <div>
          <label htmlFor="password" className="sr-only">
            Contraseña
          </label>
          <div className="relative mt-4">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            >
              <AiOutlineLock />
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Contraseña"
              className={`pl-12 pr-4 h-12 w-full rounded-md bg-[#0f172a]/60 text-white border placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#334155] focus:ring-sky-500"
              }`}
              aria-required="true"
              aria-invalid={errors.password ? "true" : "false"}
              {...register("password", {
                required: "El Password es obligatorio",
                minLength: {
                  value: 8,
                  message: "El Password debe ser mínimo de 8 caracteres",
                },
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
            </button>
          </div>
          {errors.password && <InputError>{errors.password.message}</InputError>}
        </div>

        <div>
          <label htmlFor="password_confirmation" className="sr-only">
            Confirmar Contraseña
          </label>
          <div className="relative mt-4">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            >
              <AiOutlineLock />
            </span>
            <input
              id="password_confirmation"
              type={showConfirmation ? "text" : "password"}
              autoComplete="new-pasword-confirmation"
              placeholder="Confirmar contraseña"
              className={`pl-12 pr-4 h-12 w-full rounded-md bg-[#0f172a]/60 text-white border placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                errors.password_confirmation
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#334155] focus:ring-sky-500"
              }`}
              aria-required="true"
              {...register("password_confirmation", {
                required: "Confirmar contraseña es obligatorio",
                // Usamos getValues para acceder al valor de 'password'
                validate: value =>
                  value === getValues("password") || "Las contraseñas no coinciden",
              })}
              aria-invalid={errors.password_confirmation ? "true" : "false"}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300"
              onClick={() => setShowConfirmation(!showConfirmation)}
              aria-label={showConfirmation ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showConfirmation ? <IoMdEyeOff /> : <IoMdEye />}
            </button>
          </div>
          {errors.password_confirmation && (
            <InputError>{errors.password_confirmation.message}</InputError>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-md shadow-lg shadow-sky-500/20 transition-all"
        >
          ESTABLECER PASSWORD
        </button>
      </form>
    </>
  );
};

export default NewPasswordForm;
