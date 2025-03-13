import { createContext, useState } from "react";
import clienteAxios from "../config/axios.config";
import useAuth from "../hooks/useAuth.hook";

const AdminContext = createContext();

const AdminProvider = ({ children }) => {
  const { auth } = useAuth();
  const token =
    localStorage.getItem("dms_token") || sessionStorage.getItem("dms_token");

  const [departamentos, setDepartamentos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [alerta, setAlerta] = useState({});

  const getAxiosConfigJSON = () => {
    return {
      headers: {
        "Content-Type": "application/json", // Para indicar que el body es un JSON
        Authorization: `Bearer ${token}`,
      },
    };
  };

  //** DEPARTAMENTOS */
  const guardarDepartamento = async (departamento) => {
    try {
      const response = await clienteAxios.post(
        "/departamentos",
        departamento,
        getAxiosConfigJSON()
      );
      return response.data;
    } catch (error) {
      console.error("Error al guardar departamento:", error);
      throw error; // Re-lanza el error para que el componente lo maneje
    }
  };

  const obtenerDepartamentos = async () => {
    try {
      const response = await clienteAxios.get(
        "/departamentos",
        getAxiosConfigJSON()
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
      throw error;
    }
  };

  const actualizarDepartamento = async (id, departamento) => {
    try {
      const response = await clienteAxios.put(
        `/departamentos/${id}`,
        departamento,
        getAxiosConfigJSON()
      );
      return response.data;
    } catch (error) {
      console.error("Error al actualizar departamento:", error);
      throw error;
    }
  };

  const eliminarDepartamento = async (id) => {
    try {
      const response = await clienteAxios.delete(
        `/departamentos/${id}`,
        getAxiosConfigJSON()
      );
      return response.data;
    } catch (error) {
      console.error("Error al eliminar departamento:", error);
      throw error;
    }
  };

  const obtenerDepartamento = async (id) => {
    try {
      const response = await clienteAxios.get(
        `/departamentos/${id}`,
        getAxiosConfigJSON()
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener departamento:", error);
      throw error;
    }
  };

  //** EMPLEADOS */

  return (
    <AdminContext.Provider
      value={{
        departamentos,
        empleados,
        guardarDepartamento,
        obtenerDepartamentos,
        obtenerDepartamento,
        eliminarDepartamento,
        actualizarDepartamento,
        cargando,
        alerta,
        setAlerta,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export { AdminProvider };

export default AdminContext;
