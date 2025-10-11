import { Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { AiOutlineLock } from "react-icons/ai";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

import { useState } from "react";

const LoginPages = () => {
  const [show, setShow] = useState(false);
  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-6 text-[#7dd3fc] drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]">
        Inicia Sesión
      </h1>
      <form action="" className=" space-y-5" noValidate>
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
              name="email"
              type="email"
              autoComplete="username"
              placeholder="Correo electrónico"
              className="pl-12 pr-4 h-12 w-full rounded-md bg-[#0f172a]/60 text-white border border-[#334155] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              aria-required="true"
            />
          </div>
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
              name="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Contraseña"
              className="pl-12 pr-4 h-12 w-full rounded-md bg-[#0f172a]/60 text-white border border-[#334155] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              aria-required="true"
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
