import { Navigate, Outlet } from "react-router-dom";

import Spinner from "../components/Spinner/Spinner.components";
import Header from "../components/Header.components";
import Footer from "../components/Footer.components";

import useAuth from "../hooks/useAuth.hook"; // Para sacar informacion de nuestro provider tenemos que usar nuestro HOOK

const RutaProtegida = () => {
  const { auth, cargando } = useAuth();

  // Mostrar spinner mientras la autenticación se está cargando
  if (cargando) {
    return <Spinner />;
  }

  if (!auth?.id) {
    return <Navigate to="/" />; // Si no está autenticado, redirige al login
  }

  // Redirigir o mostrar las rutas protegidas dependiendo del estado de `auth`
  return (
    <>
      <Header />
      {/* Usamos el operador de encadenamiento opcional para verificar si hay un id en el auth muestra el Outlet */}
      {auth?.id ? (
        <main className="container mx-auto mt-10">
          <Outlet />
        </main>
      ) : (
        <Navigate to="/" replace />
      )}
      <Footer />
    </>
  );
};

export default RutaProtegida;
