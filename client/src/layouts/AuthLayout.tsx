// para que se puede ver el componente de nuestro /pages/Login, tenemos que importar en nuestro layout principal algo que se conoce como Outlet de react-router-dom-> Carga el componente hijo, con el Outlet lo que sea que hay en ese componente es como que lo metiera donde esta el componente <Outlet>
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-black  text-white px-4">
        {/* Contenedor principal */}
        <div className="backdrop-blur-md bg-white/10 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
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
