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
    if (!token) return;

    try {
      const { data } = await clienteAxios.post(
        "/departamentos",
        departamento,
        getAxiosConfigJSON()
      );
      return data;
    } catch (error) {
      console.error("Error al guardar departamento:", error);
      throw error; // Re-lanza el error para que el componente lo maneje
    }
  };

  const obtenerDepartamentos = async () => {
    if (!token) return;

    try {
      const { data } = await clienteAxios.get(
        "/departamentos",
        getAxiosConfigJSON()
      );
      return data;
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
      throw error;
    }
  };

  const actualizarDepartamento = async (id, departamento) => {
    if (!token) return;

    try {
      const { data } = await clienteAxios.put(
        `/departamentos/${id}`,
        departamento,
        getAxiosConfigJSON()
      );
      return data;
    } catch (error) {
      console.error("Error al actualizar departamento:", error);
      throw error;
    }
  };

  const eliminarDepartamento = async (id) => {
    if (!token) return;

    try {
      const { data } = await clienteAxios.delete(
        `/departamentos/${id}`,
        getAxiosConfigJSON()
      );
      return data;
    } catch (error) {
      console.error("Error al eliminar departamento:", error);
      throw error;
    }
  };

  const obtenerDepartamento = async (id) => {
    if (!token) return;

    try {
      const { data } = await clienteAxios.get(
        `/departamentos/${id}`,
        getAxiosConfigJSON()
      );
      return data;
    } catch (error) {
      console.error("Error al obtener departamento:", error);
      throw error;
    }
  };

  //** EMPLEADOS */
  const obtenerEmpleados = async () => {
    if (!token) return;

    try {
      const { data } = await clienteAxios.get("/empleados", getAxiosConfigJSON); // Aquí va tu URL de la API

      setEmpleados(data);
      return data;
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    }
  };

  const guardarEmpleado = async (empleado) => {
    if (!token) return;

    try {
      const { data } = await clienteAxios.post(
        "/empleados",
        empleado,
        getAxiosConfigJSON()
      );

      setEmpleados((prevState) => [...prevState, data]); // Agregar el nuevo empleado a la lista
      return data;
    } catch (error) {
      console.error("Error al agregar empleado:", error);
    }
  };

  const obtenerEmpleado = async (id) => {
    if (!token) return;

    try {
      const { data } = await clienteAxios.get(`/empleados/${id}`);
      return data;
    } catch (error) {
      console.error("Error al obtener empleado:", error);
    }
  };

  const actualizarEmpleado = async (id, empleado) => {
    if (!token) return;

    try {
      const { data } = await clienteAxios.put(
        `/empleados/${id}`,
        empleado,
        getAxiosConfigJSON()
      );

      const empleadoActualizado = data;

      // Actualizar el empleado en la lista
      setEmpleados((prevState) =>
        prevState.map((emp) => (emp.id === id ? empleadoActualizado : emp))
      );

      return empleadoActualizado;
    } catch (error) {
      console.error("Error al actualizar empleado:", error);
    }
  };

  const eliminarEmpleado = async (id) => {
    if (!token) return;

    try {
      await clienteAxios.delete(`/empleados/${id}`, getAxiosConfigJSON());
      setEmpleados((prevState) => prevState.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
      throw error;
    }
  };

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
        guardarEmpleado,
        obtenerEmpleados,
        obtenerEmpleado,
        actualizarEmpleado,
        eliminarEmpleado,
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
