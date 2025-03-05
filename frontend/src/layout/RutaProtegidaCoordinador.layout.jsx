import { Navigate, Outlet } from "react-router-dom";

import Spinner from "../components/Spinner/Spinner.components";

import useAuth from "../hooks/useAuth.hook"; // Para sacar informacion de nuestro provider tenemos que usar nuestro HOOK

const RutaProtegidaCoordinador = () => {
  const { auth, cargando } = useAuth();

  // Mostrar spinner mientras la autenticación se está cargando
  if (cargando) {
    return <Spinner />;
  }

  if (!auth?.id) {
    return <Navigate to="/" />; // Si no está autenticado, redirige al login
  }

  if (auth.rol !== "COORDINADOR") {
    return <Navigate to="/admin" />; // Si no es COORDINADOR, redirige al dashboard general
  }

  // Redirigir o mostrar las rutas protegidas dependiendo del estado de `auth`
  return <Outlet />;
};

export default RutaProtegidaCoordinador;
