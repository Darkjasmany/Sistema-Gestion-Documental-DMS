// para que se puede ver el componente de nuestro /pages/Login, tenemos que importar en nuestro layout principal algo que se conoce como Outlet de react-router-dom-> Carga el componente hijo, con el Outlet lo que sea que hay en ese componente es como que lo metiera donde esta el componente <Outlet>

import { Outlet } from "react-router-dom";
import Particles from "@/components/Particles";

const AuthLayout = () => {
  return (
    <>
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a0f1c] text-white px-4">
        {/* <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a0f1c]  text-white px-4"> */}
        {/* <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-black  text-white px-4"> */}

        {/* Partículas animadas */}
        <Particles />

        {/* Glow detrás del contenedor */}
        <div className="absolute w-[400px] h-[400px] bg-sky-500/20 blur-[100px] animate-pulse-slow rounded-full"></div>

        {/* Contenedor principal */}
        <div className="relative z-10 backdrop-blur-xl bg-[#1e293b]/60 p-10 rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.6)] border border-[#334155]/60 w-full max-w-md transition-transform hover:scale-[1.01]">
          {/* <div className="backdrop-blur-xl bg-[#1e293b]/60 p-10 rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.6)] border border-[#334155]/60 w-full max-w-md"> */}
          {/* <div className="backdrop-blur-md bg-white/10 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/20"> */}
          <Outlet />
        </div>
      </main>
    </>
    // <>
    //   <main className="bg-neutral-900 min-h-screen flex items-center justify-center">
    //     <div className="w-full max-w-md bg-neutral-950 p-8 rounded-xl shadow-xl">
    //       <Outlet />
    //     </div>
    //   </main>
    // </>
    // <>
    //   <main className="container mx-auto md:grid md:grid-cols-2 mt-52 gap-10 p-5 flex items-center justify-center bg-neutral-900">
    //     {/* El Outlet queda como un espacio reservado para el contenido de cada uno de los componentes que forman parte de los hijos  */}
    //     <Outlet />
    //   </main>
    // </>
  );
};

export default AuthLayout;
