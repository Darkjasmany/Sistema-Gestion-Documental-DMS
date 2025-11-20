import InputError from "@/components/InputError";
import { authenticateUser } from "@/features/auth/api/AuthAPI";
import type { LoginInput } from "@selnic/shared";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLock } from "react-icons/ai";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPages = () => {
  const initialValues: LoginInput = {
    email: "",
    password: "",
  };
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: authenticateUser,
    onError: error => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("¡Inicio de sesión exitoso!");
      navigate("/");
    },
  });

  const handleLogin = (formData: LoginInput) => {
    const payload = {
      formData,
      rememberMe,
    };
    mutate(payload);
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-6 text-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.3)] select-none">
        Inicia Sesión
      </h2>
      <form action="" className=" space-y-5" onSubmit={handleSubmit(handleLogin)}>
        <div>
          <label htmlFor="email" className="sr-only">
            Correo electrónico
          </label>
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            >
              <MdEmail />
            </span>
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="Correo electrónico"
              className={`pl-12 pr-4 h-12 w-full rounded-md bg-[#0f172a]/60 text-white border placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#334155] focus:ring-sky-500"
              }`}
              aria-required="true"
              aria-invalid={errors.email ? "true" : "false"}
              {...register("email", {
                required: "El Email de registro es obligatorio",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "E-mail no válido",
                },
              })}
            />
          </div>
          {errors.email && <InputError>{errors.email.message}</InputError>}
        </div>

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

        <div className="flex items-center justify-between text-sm text-gray-400">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => {
                setRememberMe(!rememberMe);
              }}
              className="w-4 h-4 text-sky-500 border-gray-600 bg-transparent rounded focus:ring-sky-500"
            />
            <span className="select-none">Recuérdame</span>
          </label>
          <Link to="/auth/forgot-password" className="hover:text-sky-400 transition select-none">
            ¿Olvidaste tu password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-md shadow-lg shadow-sky-500/20 transition-all"
        >
          INICIAR SESIÓN
        </button>
      </form>
      <p className="text-center text-sm text-gray-400 mt-6 select-none">
        ¿No tienes una cuenta?{" "}
        <Link to="/auth/register" className="text-sky-400 hover:underline">
          Regístrate
        </Link>
      </p>
    </>
  );
};
export default LoginPages;
