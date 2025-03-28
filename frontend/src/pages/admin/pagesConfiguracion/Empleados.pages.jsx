import React, { useState, useEffect } from "react";
import useAdmin from "../../../hooks/useAdmin.hooks";
import clienteAxios from "../../../config/axios.config";
import Alerta from "../../../components/Alerta.components";

const Empleados = () => {
  const {
    guardarEmpleado,
    obtenerEmpleados,
    actualizarEmpleado,
    eliminarEmpleado,
    obtenerEmpleado,
  } = useAdmin();
  const [empleados, setEmpleados] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    cedula: "",
    nombres: "",
    apellidos: "",
    email: "",
    departamentoId: "",
  });
  const [empleadoAEditar, setEmpleadoAEditar] = useState(null);
  const [alerta, setAlerta] = useState({});
  const [filtro, setFiltro] = useState("");

  // Cargar departamentos al montar el componente
  useEffect(() => {
    fetchDepartamentos();
    cargarEmpleados();
  }, []);

  // ** UseEffect para Alerta
  useEffect(() => {
    if (alerta.message) {
      const timer = setTimeout(() => setAlerta({}), 2000); // Limpia la alerta después de 3s
      return () => clearTimeout(timer);
    }
  }, [alerta]);

  const fetchDepartamentos = async () => {
    try {
      const { data } = await clienteAxios("/departamentos");
      setDepartamentos(data);
    } catch (error) {
      console.error("Error al cargar departamentos:", error);
      setAlerta({
        message: "Error al cargar departamentos",
        error: true,
      });
    }
  };

  const cargarEmpleados = async () => {
    try {
      const empleadosData = await obtenerEmpleados();
      if (Array.isArray(empleadosData)) {
        setEmpleados(empleadosData);
      } else {
        console.error("La respuesta no es un arreglo de empleados");
      }
    } catch (error) {
      console.error("Error al cargar empleados:", error);
      setAlerta({ message: "Error al cargar empleados", error: true });
    }
  };

  const handleInputChange = (e) => {
    setNuevoEmpleado({
      ...nuevoEmpleado,
      [e.target.name]: e.target.value,
    });
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const empleadosFiltrados = empleados.filter((empleado) => {
    const textoBusqueda = filtro.toLowerCase();
    return (
      empleado.cedula.toLowerCase().includes(textoBusqueda) ||
      empleado.nombres.toLowerCase().includes(textoBusqueda) ||
      empleado.apellidos.toLowerCase().includes(textoBusqueda) ||
      empleado.departamento.nombre.toLowerCase().includes(textoBusqueda)
    );
  });

  const agregarEmpleado = async () => {
    const { cedula, nombres, apellidos, email, departamentoId } = nuevoEmpleado;

    // Validación frontend: campos obligatorios
    if (!cedula || !nombres || !apellidos || !email || !departamentoId) {
      return setAlerta({
        message: "Todos los campos son obligatorios",
        error: true,
      });
    }

    try {
      if (empleadoAEditar) {
        await actualizarEmpleado(empleadoAEditar.id, nuevoEmpleado);
        setAlerta({
          message: "Empleado actualizado correctamente",
          success: true,
        });
        setEmpleadoAEditar(null); // Limpiar el empleado a editar
      } else {
        await guardarEmpleado(nuevoEmpleado);
        setAlerta({
          message: "Empleado agregado correctamente",
          success: true,
        });
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
      setAlerta({
        message: "Error al agregar/actualizar empleado",
        error: true,
      });
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
        departamentoId: empleado.departamento_id, // Cargar el ID del departamento
      }); // Cargar datos en el formulario
    } catch (error) {
      console.error("Error al obtener empleado para editar:", error);
      setAlerta({
        message: "Error al obtener empleado para editar",
        error: true,
      });
    }
  };

  const eliminarEmpleadoSeleccionado = async (id) => {
    try {
      await eliminarEmpleado(id);
      cargarEmpleados();
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
      setAlerta({ message: "Error al eliminar empleado", error: true });
    }
  };

  // Paginación
  // const [paginaActual, setPaginaActual] = useState(1);
  // const empleadosPorPagina = 10;
  // const indexUltimoEmpleado = paginaActual * empleadosPorPagina;
  // const indexPrimerEmpleado = indexUltimoEmpleado - empleadosPorPagina;
  // const empleadosVisibles = Array.isArray(empleados)
  //   ? empleados.slice(indexPrimerEmpleado, indexUltimoEmpleado)
  //   : [];

  // const totalPaginas = Math.ceil(empleados.length / empleadosPorPagina);

  // const cambiarPagina = (numeroPagina) => {
  //   if (numeroPagina >= 1 && numeroPagina <= totalPaginas) {
  //     setPaginaActual(numeroPagina);
  //   }
  // };

  const [paginaActual, setPaginaActual] = useState(1);
  const empleadosPorPagina = 10;
  const indexUltimoEmpleado = paginaActual * empleadosPorPagina;
  const indexPrimerEmpleado = indexUltimoEmpleado - empleadosPorPagina;
  const empleadosVisibles = Array.isArray(empleadosFiltrados)
    ? empleadosFiltrados.slice(indexPrimerEmpleado, indexUltimoEmpleado)
    : [];

  const totalPaginas = Math.ceil(
    empleadosFiltrados.length / empleadosPorPagina
  );

  const cambiarPagina = (numeroPagina) => {
    if (numeroPagina >= 1 && numeroPagina <= totalPaginas) {
      setPaginaActual(numeroPagina);
    }
  };

  const { message } = alerta;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Gestión de Empleados
      </h2>
      <p className="text-gray-600 mb-4">
        Administra los empleados del sistema y gestiona su información.
      </p>

      {message && <Alerta alerta={alerta} />}

      {/* Campo de búsqueda */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Busqueda Avanzada
        </h3>
        <input
          type="text"
          placeholder="Buscar por cédula, nombre, apellido o departamento"
          value={filtro}
          onChange={handleFiltroChange}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

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
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={nuevoEmpleado.cedula}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="nombres"
            placeholder="Nombres"
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={nuevoEmpleado.nombres}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="apellidos"
            placeholder="Apellidos"
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={nuevoEmpleado.apellidos}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={nuevoEmpleado.email}
            onChange={handleInputChange}
          />
          {/* Select para departamento */}
          <select
            name="departamentoId"
            value={nuevoEmpleado.departamentoId}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Seleccione un Departamento</option>
            {departamentos.map((departamento) => (
              <option key={departamento.id} value={departamento.id}>
                {departamento.nombre}
              </option>
            ))}
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

        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  #
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Nombres
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Apellidos
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Cédula
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Departamento
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {empleadosVisibles.map((empleado, index) => (
                <tr key={empleado.id}>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {empleado.nombres}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {empleado.apellidos}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {empleado.cedula}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {empleado.email}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {empleado.departamento.nombre}
                  </td>
                  <td className="px-4 py-2 text-sm text-center space-x-2">
                    <button
                      onClick={() => editarEmpleado(empleado.id)}
                      className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-3 py-1 rounded-md text-xs font-medium"
                    >
                      Editar
                    </button>
                    <button
                      disabled
                      onClick={() => eliminarEmpleadoSeleccionado(empleado.id)}
                      className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md text-xs font-medium opacity-50 cursor-not-allowed"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="mt-4 flex justify-end items-center gap-2 text-sm text-gray-600">
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-40"
          >
            Anterior
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => cambiarPagina(num)}
              className={`px-3 py-1 border rounded-md ${
                num === paginaActual
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default Empleados;
