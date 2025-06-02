import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthProvider.context";
import { TramitesProvider } from "./context/TramitesProvider.context";
import { AdminProvider } from "./context/AdminProvider.context";

import AuthLayout from "./layout/Auth.layout";
import RutaProtegida from "./layout/RutaProtegida.layout";
import RutaProtegidaCoodinador from "./layout/RutaProtegidaCoordinador.layout";

import Login from "./modules/administration/pages/auth/Login.pages";
import ConfirmarCuenta from "./modules/administration/pages/auth/ConfirmarCuenta.pages";
import Registrar from "./modules/administration/pages/auth/Registrar.pages";
import OlvidePassword from "./modules/administration/pages/auth/OlvidePassword.pages";
import NuevoPassword from "./modules/administration/pages/auth/NuevoPassword.pages";
import CambiarPassword from "./modules/administration/pages/auth/CambiarPassword.pages";
import EditarPerfil from "./modules/administration/pages/auth/EditarPerfil.pages";
import AdminDMS from "./modules/administration/pages/admin-panel/AdminDMS.pages";
import Empleados from "./modules/administration/pages/admin-panel/Empleados.pages";
import Departamentos from "./modules/administration/pages/admin-panel/Departamentos.pages";

import AdministrarTramites from "./modules/document-management/pages/AdministrarTramites.pages";
import TramitesAsignados from "./modules/document-management/pages/TramitesAsignados.pages";
import TramitesAsignarReasignar from "./modules/document-management/pages/TramitesAsignarReasignar.pages";
import TramitesCompletados from "./modules/document-management/pages/TramitesCompletados.pages";
import ConsultarTramites from "./modules/document-management/pages/ConsultarTramites.pages";
import TramitesPorDespachar from "./modules/document-management/pages/TramitesPorDespachar.pages";

import Tramites from "./modules/administration/pages/admin-panel/Tramites.pages";
import InicioDMS from "./modules/administration/pages/admin-panel/InicioDMS.pages";
import InicioDMSUsuario from "./modules/administration/pages/admin-panel/InicioDMSUsuario.pages";

function App() {
  return (
    <BrowserRouter>
      {/* Reemplaza 'mi-app' con el nombre de tu subdirectorio */}
      {/* <BrowserRouter basename="/dms"> */}
      <AuthProvider>
        <TramitesProvider>
          <Routes>
            {/* Ruta Pública */}
            <Route path="/" element={<AuthLayout />}>
              {/* prom index indica que es el primer componente, osea que el la pagina principal y se la define como index */}
              <Route index element={<Login />} />
              {/* Para crear mas rutas hay que definir un path y no necesitas definir el / porque ya esta en la principal */}
              <Route path="registrar" element={<Registrar />} />
              <Route path="confirmar/:token" element={<ConfirmarCuenta />} />
              <Route path="olvide-password" element={<OlvidePassword />} />
              <Route
                path="olvide-password/:token"
                element={<NuevoPassword />}
              />
            </Route>

            {/* Ruta Privada */}
            <Route path="/admin" element={<RutaProtegida />}>
              {/* <Route index element={<AdministrarTramites />} /> */}
              <Route index element={<InicioDMSUsuario />} />
              <Route path="ingresar" element={<AdministrarTramites />} />
              <Route path="asignados" element={<TramitesAsignados />} />
              <Route path="consultar-tramite" element={<ConsultarTramites />} />
              <Route
                path="despachar-tramite"
                element={<TramitesPorDespachar />}
              />
              <Route path="perfil" element={<EditarPerfil />} />
              <Route path="cambiar-password" element={<CambiarPassword />} />

              {/* Rutas solo para COORDINADORES */}
              <Route element={<RutaProtegidaCoodinador />}>
                <Route
                  path="asignar-reasignar"
                  element={<TramitesAsignarReasignar />}
                />
                <Route
                  path="completar-tramite"
                  element={<TramitesCompletados />}
                />

                {/* Ruta padre para AdminDMS */}
                <Route
                  path="admin-dms"
                  element={
                    <AdminProvider>
                      <AdminDMS />
                    </AdminProvider>
                  }
                >
                  {/* BONUS: Ruta por defecto al entrar a /admin/admin-dms */}
                  <Route index element={<InicioDMS />} />
                  <Route path="empleados" element={<Empleados />} />
                  <Route path="departamentos" element={<Departamentos />} />
                  <Route path="tramites" element={<Tramites />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </TramitesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
