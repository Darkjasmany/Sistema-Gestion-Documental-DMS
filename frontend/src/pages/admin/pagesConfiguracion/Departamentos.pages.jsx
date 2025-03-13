import React, { useState, useEffect } from "react";
import useAdmin from "../../../hooks/useAdmin.hooks";

const Departamentos = () => {
  const {
    guardarDepartamento,
    obtenerDepartamentos,
    actualizarDepartamento,
    eliminarDepartamento,
    obtenerDepartamento,
  } = useAdmin();

  const [departamentos, setDepartamentos] = useState([]);
  const [nuevoDepartamento, setNuevoDepartamento] = useState({
    nombre: "",
    coordinadorId: "",
  });
  const [departamentoAEditar, setDepartamentoAEditar] = useState(null);

  useEffect(() => {
    cargarDepartamentos();
  }, []);

  const cargarDepartamentos = async () => {
    try {
      const departamentosData = await obtenerDepartamentos();
      setDepartamentos(departamentosData);
    } catch (error) {
      console.error("Error al cargar departamentos:", error);
    }
  };

  const handleInputChange = (e) => {
    setNuevoDepartamento({
      ...nuevoDepartamento,
      [e.target.name]: e.target.value,
    });
  };

  const agregarDepartamento = async () => {
    try {
      await guardarDepartamento(nuevoDepartamento);
      cargarDepartamentos();
      setNuevoDepartamento({ nombre: "", coordinadorId: "" });
    } catch (error) {
      console.error("Error al agregar departamento:", error);
    }
  };

  const editarDepartamento = async (id) => {
    try {
      const departamento = await obtenerDepartamento(id);
      setDepartamentoAEditar(departamento);
    } catch (error) {
      console.error("Error al obtener departamento para editar:", error);
    }
  };

  const actualizarDepartamentoEditado = async () => {
    try {
      await actualizarDepartamento(departamentoAEditar.id, departamentoAEditar);
      cargarDepartamentos();
      setDepartamentoAEditar(null);
    } catch (error) {
      console.error("Error al actualizar departamento:", error);
    }
  };

  const eliminarDepartamentoSeleccionado = async (id) => {
    try {
      await eliminarDepartamento(id);
      cargarDepartamentos();
    } catch (error) {
      console.error("Error al eliminar departamento:", error);
    }
  };

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const departamentosPorPagina = 10;

  // Cálculos para paginación
  const indexUltimoDepartamento = paginaActual * departamentosPorPagina;
  const indexPrimerDepartamento =
    indexUltimoDepartamento - departamentosPorPagina;
  const departamentosVisibles = departamentos.slice(
    indexPrimerDepartamento,
    indexUltimoDepartamento
  );

  const totalPaginas = Math.ceil(departamentos.length / departamentosPorPagina);

  // Función para cambiar de página
  const cambiarPagina = (numeroPagina) => {
    if (numeroPagina >= 1 && numeroPagina <= totalPaginas) {
      setPaginaActual(numeroPagina);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Gestión de Departamentos
      </h2>
      <p className="text-gray-600 mb-6">
        Administra los departamentos del sistema, asigna un coordinador y
        gestiona su información.
      </p>

      {/* Formulario para agregar departamento */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Agregar Departamento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del departamento"
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={nuevoDepartamento.nombre}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="coordinadorId"
            placeholder="ID del Coordinador"
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={nuevoDepartamento.coordinadorId}
            onChange={handleInputChange}
          />
        </div>
        <button
          onClick={agregarDepartamento}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg shadow transition"
        >
          Agregar
        </button>
      </div>

      {/* Tabla de departamentos */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Lista de Departamentos
        </h3>

        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  #
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Nombre
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  ID Coordinador
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {departamentosVisibles.map((departamento, index) => (
                <tr key={departamento.id}>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {indexPrimerDepartamento + index + 1}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {departamento.nombre}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {departamento.coordinador_id}
                  </td>
                  <td className="px-4 py-2 text-sm text-center space-x-2">
                    <button
                      onClick={() => editarDepartamento(departamento.id)}
                      className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-3 py-1 rounded-md text-xs font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        eliminarDepartamentoSeleccionado(departamento.id)
                      }
                      className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md text-xs font-medium"
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
                paginaActual === num
                  ? "bg-blue-500 text-white border-blue-500"
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

export default Departamentos;
