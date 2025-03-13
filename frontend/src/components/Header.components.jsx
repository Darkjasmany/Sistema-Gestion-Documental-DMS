import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth.hook";

const Header = () => {
  const { auth, cerrarSesion } = useAuth();

  return (
    <header className="py-10 bg-indigo-600">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center">
        <h1 className="font-bold text-2xl text-indigo-200 text-center select-none ">
          Administrador de Documentos en {""}{" "}
          <span className="text-white font-black">DMS</span>
        </h1>
        <nav className="flex flex-col items-center lg:flex-row gap-4 mt-5 lg:mt-0 ">
          <nav className="relative group">
            <Link
              // to={"/"}
              className="text-white text-sm uppercase font-bold  hover:underline"
            >
              Trámites
            </Link>

            <div className="absolute hidden group-hover:block text-white text-sm uppercase font-bold bg-indigo-500 p-2 shadow-lg rounded-lg">
              {auth.rol !== "DESPACHADOR" && (
                <Link
                  to={"/admin/ingresar"}
                  className="block px-4 py-2 hover:bg-indigo-700"
                >
                  Ingresar Trámites
                </Link>
              )}

              {/* Solo visible para COODINADOR */}
              {auth.rol === "COORDINADOR" && (
                <Link
                  to={"/admin/asignar-reasignar"}
                  className="block px-4 py-2 hover:bg-indigo-700"
                >
                  Asignar/Reasignar Trámites
                </Link>
              )}

              {auth.rol !== "DESPACHADOR" && (
                <Link
                  to={"/admin/asignados"}
                  className="block px-4 py-2 hover:bg-indigo-700"
                >
                  Ver Trámites Asignados
                </Link>
              )}

              {/* Solo visible para COORDINADOR */}
              {auth.rol === "COORDINADOR" && (
                <Link
                  to={"/admin/completar-tramite"}
                  className="block px-4 py-2 hover:bg-indigo-700"
                >
                  Completar Trámites
                </Link>
              )}
              {auth.rol === "DESPACHADOR" && (
                <Link
                  to={"/admin/despachar-tramite"}
                  className="block px-4 py-2 hover:bg-indigo-700"
                >
                  Trámites Por Despachar
                </Link>
              )}
              <Link
                to={"/admin/consultar-tramite"}
                className="block px-4 py-2 hover:bg-indigo-700"
              >
                Consultas Trámites
              </Link>
              {/* Solo visible para COORDINADOR */}
              {auth.rol === "COORDINADOR" && (
                <Link
                  to={"/admin/admin-dms"}
                  className="block px-4 py-2 hover:bg-indigo-700"
                >
                  Configuración
                </Link>
              )}
            </div>
          </nav>

          <nav className="relative group">
            <Link
              // to={"/admin/perfil"}
              className="text-white text-sm uppercase font-bold hover:underline"
            >
              Perfil
            </Link>

            <div className="absolute hidden group-hover:block text-white text-sm uppercase font-bold bg-indigo-500 p-2 shadow-lg rounded-lg">
              <Link
                to={"/admin/perfil"}
                className="block px-4 py-2 hover:bg-indigo-700"
              >
                Editar Pérfil
              </Link>
              <Link
                to={"/admin/cambiar-password"}
                className="block px-4 py-2 hover:bg-indigo-700"
              >
                Cambiar Password
              </Link>
            </div>
          </nav>

          <button
            type="button"
            className="text-white text-sm uppercase font-bold hover:underline"
            onClick={cerrarSesion}
          >
            Cerrar Sesión
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
