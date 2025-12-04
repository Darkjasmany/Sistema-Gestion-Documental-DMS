// para que se puede ver el componente de nuestro /pages/Login, tenemos que importar en nuestro layout principal algo que se conoce como Outlet de react-router-dom-> Carga el componente hijo, con el Outlet lo que sea que hay en ese componente es como que lo metiera donde esta el componente <Outlet>

import Particles from "@/components/Particles";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const AuthLayout = () => {
  return (
    <>
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a0f1c] text-white px-4">
        {/* Partículas animadas */}
        <Particles />

        {/* Glow detrás del contenedor */}
        <div className="absolute w-[400px] h-[400px] bg-sky-500/20 blur-[100px] animate-pulse-slow rounded-full"></div>

        {/* Contenedor principal */}
        <div className="relative z-10 backdrop-blur-xl bg-[#1e293b]/60 p-10 rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.6)] border border-[#334155]/60 w-full max-w-md transition-transform hover:scale-[1.01]">
          <h1 className="text-5xl font-bold text-center mb-4 text-white drop-shadow-[0_0_8px_rgba(56,189,248,0.3)] select-none ">
            Sel<span className="text-[#7dd3fc]">Nic</span>
          </h1>
          <Outlet />
        </div>
      </main>
      <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
    </>
  );
};

export default AuthLayout;
