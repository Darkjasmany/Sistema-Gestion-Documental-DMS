import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/axios.config";

const AuthContext = createContext();

// El Provider suministra los datos, con el children indicamos que tendra hijos(componentes)
const AuthProvider = ({ children }) => {
  // Definiendo un State
  const [auth, setAuth] = useState({});
  const [cargando, setCargando] = useState(true);

  // console.log(auth);

  const autenticarUsuario = async () => {
    //** Verificar el token
    const token =
      localStorage.getItem("dms_token") || sessionStorage.getItem("dms_token");

    // console.log(token || auth?.id);
    if (!token) {
      setCargando(false);
      setAuth({});
      return; // si no hay nada detiene el codigo
    }

    // ** Header de Configuración
    const config = {
      headers: {
        // "Content-Type": "application/json", // Para indicar que el body es un JSON
        "Content-Type": "multipart/form-data", // Para indicar que el body es un formulario
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await clienteAxios("/usuarios/perfil", config);
      setAuth(data);
    } catch (error) {
      console.log(error.response?.data?.message);
      setAuth({});
    }

    setCargando(false);
  };

  // Cuando cargue la APP verifica si el usuario esta autenticado o no
  useEffect(() => {
    autenticarUsuario();
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("dms_token");
    sessionStorage.removeItem("dms_token");
    setAuth({});
  };

  const actualizarPerfil = (datos) => {
    console.log(datos);
  };

  return (
    // Con el value tu decides que se pone a dispocion en el provider para que se pueda acceder en los diferentes componentes
    // Hacer disponible en los otros componentes
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        cargando,
        setCargando,
        cerrarSesion,
        actualizarPerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

export default AuthContext;
