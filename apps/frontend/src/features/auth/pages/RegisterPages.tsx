import { createAccount } from "@/api/auth/AuthAPI";
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
    watch,
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

  const password = watch("password");

  const handleRegister = (formData: RegisterInput) => {
    mutate(formData);
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-6 text-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.3)] select-none">
        Crear Cuenta
      </h2>

      <form action="" className="space-y-5" onSubmit={handleSubmit(handleRegister)} noValidate>
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
              name="nombres"
              type="text"
              autoComplete="name"
              placeholder="Tus nombres"
              className="pl-12 pr-4 h-12 w-full rounded-md bg-[#0f172a]/60 text-white border border-[#334155] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
          </div>
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
              name="apellidos"
              type="text"
              autoComplete="last-name"
              placeholder="Tus apellidos"
              className="pl-12 pr-4 h-12 w-full rounded-md bg-[#0f172a]/60 text-white border border-[#334155] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
          </div>
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
              // {...register("email")}
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              placeholder="Correo electrónico"
              className="pl-12 pr-4 h-12 w-full rounded-md bg-[#0f172a]/60 text-white border border-[#334155] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              // className={`pl-12 pr-4 h-12 w-full rounded-md bg-[#0f172a]/60 text-white border placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
              //   errors.email
              //     ? "border-red-500 focus:ring-red-500"
              //     : "border-[#334155] focus:ring-sky-500"
              // }`}
              aria-required="true"
              // aria-invalid={errors.email ? "true" : "false"}
            />
          </div>
          {/* {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><IoIosWarning/> {errors.email.message}</p>
                  )} */}
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
              // {...register("password")}
              id="password"
              name="password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Contraseña"
              className="pl-12 pr-4 h-12 w-full rounded-md bg-[#0f172a]/60 text-white border border-[#334155] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              // className={`pl-12 pr-10 h-12 w-full rounded-md bg-[#0f172a]/60 text-white border placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
              //   errors.password
              //     ? "border-red-500 focus:ring-red-500"
              //     : "border-[#334155] focus:ring-sky-500"
              // }`}
              aria-required="true"
              // aria-invalid={errors.password ? "true" : "false"}
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
          {/* {errors.password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><IoIosWarning/> {errors.password.message}</p>
                  )} */}
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
              // {...register("password")}
              id="password_confirmation"
              name="password_confirmation"
              type={show ? "text" : "password_confirmation"}
              autoComplete="pasword_confirmation"
              placeholder="Confirmar contraseña"
              className="pl-12 pr-4 h-12 w-full rounded-md bg-[#0f172a]/60 text-white border border-[#334155] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              // className={`pl-12 pr-10 h-12 w-full rounded-md bg-[#0f172a]/60 text-white border placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
              //   errors.password
              //     ? "border-red-500 focus:ring-red-500"
              //     : "border-[#334155] focus:ring-sky-500"
              // }`}
              aria-required="true"
              // aria-invalid={errors.password ? "true" : "false"}
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
          {/* {errors.password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><IoIosWarning/> {errors.password.message}</p>
                  )} */}
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
