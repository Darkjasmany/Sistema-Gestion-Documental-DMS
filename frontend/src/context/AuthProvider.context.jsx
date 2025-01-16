import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/axios.config";

const AuthContext = createContext();

// El Provider suministra los datos, con el children indicamos que tendra hijos(componentes)
const AuthProvider = ({ children }) => {
  // Definiendo un State
  const [auth, setAuth] = useState({});
  const [cargando, setCargando] = useState(true);

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
        "Content-Type": "application/json", // Para indicar que el body es un JSON
        //"Content-Type": "multipart/form-data", // Para indicar que el body es un formulario
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

  const actualizarPerfil = async (datos) => {
    //** Verificar el token
    const token =
      localStorage.getItem("dms_token") || sessionStorage.getItem("dms_token");

    // ** Header de Configuración
    const config = {
      headers: {
        "Content-Type": "application/json", // Para indicar que el body es un JSON
        //"Content-Type": "multipart/form-data", // Para indicar que el body es un formulario
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const url = `/usuarios/perfil/${datos.id}`;
      const { data } = await clienteAxios.put(url, datos, config);
      console.log(data);

      return {
        message: "Datos Actualizados Correctamente",
      };
    } catch (error) {
      console.log(error.response?.data?.message);
      return {
        message: error.response?.data?.message,
        error: true,
      };
    }
  };

  const guardarPassword = async (datos) => {
    //** Verificar el token
    const token =
      localStorage.getItem("dms_token") || sessionStorage.getItem("dms_token");

    if (!token) {
      setCargando(false);
      setAuth({});
      return; // si no hay nada detiene el codigo
    }

    // ** Header de Configuración
    const config = {
      headers: {
        "Content-Type": "application/json", // Para indicar que el body es un JSON
        //"Content-Type": "multipart/form-data", // Para indicar que el body es un formulario
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const url = "/usuarios/actualizar-password";
      const { data } = await clienteAxios.put(url, datos, config);
      // console.log(data);

      return {
        message: data?.message,
      };
    } catch (error) {
      return {
        message: error.response?.data?.message,
        error: true,
      };
    }
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
        guardarPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

export default AuthContext;
