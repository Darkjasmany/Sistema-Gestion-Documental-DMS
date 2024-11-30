// para que se puede ver el componente de nuestro /pages/Login, tenemos que importar en nuestro layout principal algo que se conoce como Outlet de react-router-dom-> Carga el componente hijo, con el Outlet lo que sea que hay en ese componente es como que lo metiera donde esta el componente <Outlet>
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <>
      <main className="container mx-auto md:grid md:grid-cols-2 mt-14 gap-10 p-5 items-center">
        {/* El Outlet queda como un espacio reservado para el contenido de cada uno de los componentes que forman parte de los hijos  */}
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;
