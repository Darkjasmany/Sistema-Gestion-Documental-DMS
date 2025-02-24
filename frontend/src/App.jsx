import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthProvider.context";
import { TramitesProvider } from "./context/TramitesProvider.context";

import AuthLayout from "./layout/Auth.layout";
import RutaProtegida from "./layout/RutaProtegida.layout";

import Login from "./pages/auth/Login.pages";
import ConfirmarCuenta from "./pages/auth/ConfirmarCuenta.pages";
import Registrar from "./pages/auth/Registrar.pages";
import OlvidePassword from "./pages/auth/OlvidePassword.pages";
import NuevoPassword from "./pages/auth/NuevoPassword.pages";
import AdministrarTramites from "./pages/admin/AdministrarTramites.pages";
import TramitesAsignados from "./pages/admin/TramitesAsignados.pages";
import TramitesAsignarReasignar from "./pages/admin/TramitesAsignarReasignar.pages";
import TramitesCompletados from "./pages/admin/TramitesCompletados.pages";
import ConsultarTramites from "./pages/admin/ConsultarTramites.pages";
import EditarPerfil from "./pages/admin/EditarPerfil.pages";
import CambiarPassword from "./pages/admin/CambiarPassword.pages";
import CompletarTramite from "./components/CompletarTramite.components";

function App() {
  return (
    <BrowserRouter>
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
              <Route index element={<AdministrarTramites />} />
              <Route path="asignados" element={<TramitesAsignados />} />
              <Route path="consultar-tramite" element={<ConsultarTramites />} />
              <Route
                path="asignar-reasignar"
                element={<TramitesAsignarReasignar />}
              />
              <Route
                path="completar-tramite"
                element={<TramitesCompletados />}
              />
              <Route path="perfil" element={<EditarPerfil />} />
              <Route path="cambiar-password" element={<CambiarPassword />} />
            </Route>
          </Routes>
        </TramitesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
