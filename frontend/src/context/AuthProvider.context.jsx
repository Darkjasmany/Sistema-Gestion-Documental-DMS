import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/axios.config";

const AuthContext = createContext();

// El Provider suministra los datos, con el children indicamos que tendra hijos(componentes)
const AuthProvider = ({ children }) => {
  // Definiendo un State
  const [auth, setAuth] = useState({});

  const autenticarUsuario = async () => {
    //verificar el token
    const token = localStorage.getItem("dms_token");
    if (!token) return; // si no hay nada detiene el codigo

    // ** Header de Configuración
    const config = {
      headers: {
        "Context-Type": "application/json",
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
  };

  // Cuando cargue la APP verifica si el usuario esta autenticado o no
  useEffect(() => {
    autenticarUsuario();
  }, []);

  return (
    // Con el value tu decides que se pone a dispocion en el provider para que se pueda acceder en los diferentes componentes
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

export default AuthContext;
