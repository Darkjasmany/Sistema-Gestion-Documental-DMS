import { Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { AiOutlineLock } from "react-icons/ai";

// import { IoMdEye, IoMdEyeOff, IoIosWarning } from "react-icons/io";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { loginSchema, type LoginForm } from "../schemas/auth.schema";

const LoginPages = () => {
  const [show, setShow] = useState(false);

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<LoginForm>({
  //   resolver: zodResolver(loginSchema),
  // });

  // const onSubmit = (data: LoginForm) => {
  //   // Aquí iría la lógica para llamar a la API con react-query
  //   console.log(data);
  // };

  return (
    <>
      <h1 className="text-5xl font-bold text-center mb-4 text-white drop-shadow-[0_0_8px_rgba(56,189,248,0.3)] animate-fade-in">
        Sel<span className="text-[#7dd3fc]">Nic</span>
      </h1>
      <h2 className="text-2xl font-semibold text-center mb-6 text-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]">
        {/* <h2 className="text-2xl font-semibold text-center mb-6 text-[#7dd3fc] drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]"> */}
        Inicia Sesión
      </h2>
      <form action="" className=" space-y-5" noValidate>
        {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate> */}
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
              autoComplete="current-password"
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

        <div className="flex items-center justify-between text-sm text-gray-400">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="w-4 h-4 text-sky-500 border-gray-600 bg-transparent rounded focus:ring-sky-500"
            />
            <span>Recuérdame</span>
          </label>
          <Link
            to="/auth/forgot-password"
            className="hover:text-sky-400 transition"
          >
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

      <p className="text-center text-sm text-gray-400 mt-6">
        ¿No tienes una cuenta?{" "}
        <Link to="/auth/register" className="text-sky-400 hover:underline">
          Regístrate
        </Link>
      </p>
    </>
  );
};
export default LoginPages;
