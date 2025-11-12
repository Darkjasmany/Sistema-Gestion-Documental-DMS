import { createAccount } from "@/api/auth/Auth.api";
import InputError from "@/components/InputError.components";
import type { RegisterInput } from "@selnic/shared";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLock } from "react-icons/ai";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MdEmail, MdPerson, MdPersonAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterPages = () => {
  const initialValues: RegisterInput = {
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    password_confirmation: "",
  };

  const {
    register,
    reset,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterInput>({
    defaultValues: initialValues,
  });

  const { mutate } = useMutation({
    mutationFn: createAccount,
    onError: error => {
      toast.error(error.message);
    },
    onSuccess: data => {
      toast.success(data);
      reset();
    },
  });

  const [show, setShow] = useState(false);

  const handleRegister = (formData: RegisterInput) => {
    mutate(formData);
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-6 text-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.3)] select-none">
        Crear Cuenta
      </h2>

      <form action="" className="space-y-5" onSubmit={handleSubmit(handleRegister)}>
        <div>
          <label htmlFor="nombres" className="sr-only">
            Nombres
          </label>
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            >
              <MdPerson />
            </span>
            <input
              id="nombres"
              type="text"
              autoComplete="name"
              placeholder="Tus nombres"
              className={`pl-12 pr-4 h-12 w-full rounded-md bg-[#0f172a]/60 text-white border placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                errors.nombres
                  ? "border-red-500 focus:ring-red-500" // Resalta el borde
                  : "border-[#334155] focus:ring-sky-500"
              }`}
              aria-required="true"
              {...register("nombres", { required: "Los Nombres son obligatorios" })}
            />
          </div>
          {errors.nombres && <InputError>{errors.nombres.message}</InputError>}
        </div>

        <div>
          <label htmlFor="apellidos" className="sr-only">
            Apellidos
          </label>
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            >
              <MdPersonAdd />
            </span>
            <input
              id="apellidos"
              type="text"
              autoComplete="last-name"
              placeholder="Tus apellidos"
              className={`pl-12 pr-4 h-12 w-full rounded-md bg-[#0f172a]/60 text-white border placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                errors.nombres
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#334155] focus:ring-sky-500"
              }`}
              aria-required="true"
              {...register("apellidos", { required: "Los Apellidos son obligatorios" })}
            />
          </div>
          {errors.apellidos && <InputError>{errors.apellidos.message}</InputError>}
        </div>
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
              type={show ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Contraseña"
              className={`pl-12 pr-4 h-12 w-full rounded-md bg-[#0f172a]/60 text-white border placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                errors.email
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
              onClick={() => setShow(!show)}
              aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {show ? <IoMdEyeOff /> : <IoMdEye />}
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
              type={show ? "text" : "password_confirmation"}
              autoComplete="pasword_confirmation"
              placeholder="Confirmar contraseña"
              className={`pl-12 pr-4 h-12 w-full rounded-md bg-[#0f172a]/60 text-white border placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                errors.email
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
              aria-invalid={errors.password ? "true" : "false"}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300"
              onClick={() => setShow(!show)}
              aria-label={
                show ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"
              }
            >
              {show ? <IoMdEyeOff /> : <IoMdEye />}
            </button>
          </div>
          {errors.password_confirmation && (
            <InputError>{errors.password_confirmation.message}</InputError>
          )}
        </div>

        <div className="flex items-center justify-end text-sm text-gray-400">
          <Link to="/auth/forgot-password" className="hover:text-sky-400 transition select-none">
            ¿Olvidaste tu password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-md shadow-lg shadow-sky-500/20 transition-all"
        >
          REGISTRARSE
        </button>
      </form>
      <p className="text-center text-sm text-gray-400 mt-6 select-none">
        ¿Ya tienes una cuenta?{" "}
        <Link to="/auth/login" className="text-sky-400 hover:underline">
          Inicia Sesión
        </Link>
      </p>
    </>
  );
};

export default RegisterPages;
