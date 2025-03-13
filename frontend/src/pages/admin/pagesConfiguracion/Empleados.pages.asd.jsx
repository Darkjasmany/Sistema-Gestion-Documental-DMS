import React, { useState, useEffect } from "react";
import useAdmin from "../../../hooks/useAdmin.hooks";

const Empleados = () => {
  const {
    guardarEmpleado,
    obtenerEmpleados,
    actualizarEmpleado,
    eliminarEmpleado,
  } = useAdmin();

  const [empleados, setEmpleados] = useState([]);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    cedula: "",
    nombres: "",
    apellidos: "",
    email: "",
    departamentoId: "",
  });
  const [empleadoAEditar, setEmpleadoAEditar] = useState(null);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const empleadosData = await obtenerEmpleados();
      setEmpleados(empleadosData);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  };

  const handleInputChange = (e) => {
    setNuevoEmpleado({
      ...nuevoEmpleado,
      [e.target.name]: e.target.value,
    });
  };

  const agregarEmpleado = async () => {
    try {
      if (empleadoAEditar) {
        await actualizarEmpleado(empleadoAEditar.id, nuevoEmpleado);
        setEmpleadoAEditar(null); // Limpiar el empleado a editar
      } else {
        await guardarEmpleado(nuevoEmpleado);
      }
      cargarEmpleados();
      setNuevoEmpleado({
        cedula: "",
        nombres: "",
        apellidos: "",
        email: "",
        departamentoId: "",
      }); // Limpiar formulario después de agregar/editar
    } catch (error) {
      console.error("Error al agregar/actualizar empleado:", error);
    }
  };

  const editarEmpleado = async (id) => {
    try {
      const empleado = await obtenerEmpleado(id);
      setEmpleadoAEditar(empleado);
      setNuevoEmpleado({
        cedula: empleado.cedula,
        nombres: empleado.nombres,
        apellidos: empleado.apellidos,
        email: empleado.email,
        departamentoId: empleado.departamento_id,
      }); // Cargar datos en el formulario
    } catch (error) {
      console.error("Error al obtener empleado para editar:", error);
    }
  };

  const eliminarEmpleadoSeleccionado = async (id) => {
    try {
      await eliminarEmpleado(id);
      cargarEmpleados();
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Gestión de Empleados
      </h2>
      <p className="text-gray-600 mb-6">
        Administra los empleados del sistema.
      </p>

      {/* Formulario para agregar o editar empleado */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          {empleadoAEditar ? "Editar Empleado" : "Agregar Empleado"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="cedula"
            placeholder="Cédula"
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full"
            value={nuevoEmpleado.cedula}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="nombres"
            placeholder="Nombres"
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full"
            value={nuevoEmpleado.nombres}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="apellidos"
            placeholder="Apellidos"
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full"
            value={nuevoEmpleado.apellidos}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full"
            value={nuevoEmpleado.email}
            onChange={handleInputChange}
          />
          {/* Agregar un campo para seleccionar el departamento */}
          <select
            name="departamentoId"
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full"
            value={nuevoEmpleado.departamentoId}
            onChange={handleInputChange}
          >
            <option value="">Seleccione Departamento</option>
            {/* Agregar opciones de departamentos aquí */}
          </select>
        </div>
        <button
          onClick={agregarEmpleado}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg shadow transition"
        >
          {empleadoAEditar ? "Actualizar" : "Agregar"}
        </button>
      </div>

      {/* Tabla de empleados */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Lista de Empleados
        </h3>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="px-4 py-2 text-sm font-medium text-gray-700">
                Cédula
              </th>
              <th className="px-4 py-2 text-sm font-medium text-gray-700">
                Nombres
              </th>
              <th className="px-4 py-2 text-sm font-medium text-gray-700">
                Apellidos
              </th>
              <th className="px-4 py-2 text-sm font-medium text-gray-700">
                Email
              </th>
              <th className="px-4 py-2 text-sm font-medium text-gray-700">
                Departamento
              </th>
              <th className="px-4 py-2 text-sm font-medium text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => (
              <tr key={empleado.id} className="border-b">
                <td className="px-4 py-2 text-sm">{empleado.cedula}</td>
                <td className="px-4 py-2 text-sm">{empleado.nombres}</td>
                <td className="px-4 py-2 text-sm">{empleado.apellidos}</td>
                <td className="px-4 py-2 text-sm">{empleado.email}</td>
                <td className="px-4 py-2 text-sm">
                  {empleado.departamento?.nombre}
                </td>
                <td className="px-4 py-2 text-sm">
                  <button
                    onClick={() => editarEmpleado(empleado.id)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarEmpleadoSeleccionado(empleado.id)}
                    className="ml-4 text-red-600 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Empleados;
