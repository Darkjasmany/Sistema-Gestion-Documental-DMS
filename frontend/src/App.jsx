import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layout/Auth.layout";
import Login from "./pages/Login.pages";
import ConfirmarCuenta from "./pages/ConfirmarCuenta.pages";
import Registrar from "./pages/Registrar.pages";
import OlvidePassword from "./pages/OlvidePassword.pages";
import NuevoPassword from "./pages/NuevoPassword.pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          {/* prom index indica que es el primer componente, osea que el la pagina principal y se la define como index */}
          <Route index element={<Login />} />
          {/* Para crear mas rutas hay que definir un path y no necesitas definir el / porque ya esta en la principal */}
          <Route path="registrar" element={<Registrar />} />
          <Route path="confirmar/:token" element={<ConfirmarCuenta />} />
          <Route path="olvide-password" element={<OlvidePassword />} />
          <Route path="olvide-password/:token" element={<NuevoPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
