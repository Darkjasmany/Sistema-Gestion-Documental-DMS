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
  const obtenerEmpleados = async () => {
    try {
      const response = await fetch("/api/empleados"); // Aquí va tu URL de la API
      const data = await response.json();
      setEmpleados(data);
      return data;
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    }
  };

  // Función para agregar un nuevo empleado
  const guardarEmpleado = async (empleado) => {
    try {
      const response = await fetch("/api/empleados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empleado),
      });

      const data = await response.json();
      setEmpleados((prevState) => [...prevState, data]); // Agregar el nuevo empleado a la lista
      return data;
    } catch (error) {
      console.error("Error al agregar empleado:", error);
    }
  };

  // Función para obtener un empleado específico para editar
  const obtenerEmpleado = async (id) => {
    try {
      const response = await fetch(`/api/empleados/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener empleado:", error);
    }
  };

  // Función para actualizar un empleado
  const actualizarEmpleado = async (id, empleado) => {
    try {
      const response = await fetch(`/api/empleados/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empleado),
      });

      const data = await response.json();
      setEmpleados((prevState) =>
        prevState.map((emp) => (emp.id === id ? data : emp))
      ); // Actualizar el empleado en la lista
      return data;
    } catch (error) {
      console.error("Error al actualizar empleado:", error);
    }
  };

  // Función para eliminar un empleado
  const eliminarEmpleado = async (id) => {
    try {
      await fetch(`/api/empleados/${id}`, { method: "DELETE" });
      setEmpleados((prevState) => prevState.filter((emp) => emp.id !== id)); // Eliminar de la lista local
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
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
