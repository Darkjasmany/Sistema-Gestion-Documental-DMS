import React, { useState, useEffect } from "react";
import useAdmin from "../../../hooks/useAdmin.hooks";
import Alerta from "../../../components/Alerta.components";

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
  });
  const [departamentoAEditar, setDepartamentoAEditar] = useState(null);
  const [alerta, setAlerta] = useState({});
  const [busqueda, setBusqueda] = useState("");

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

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  const agregarDepartamento = async () => {
    const { nombre } = nuevoDepartamento;
    if (!nombre) {
      return setAlerta({
        message: "Debes ingresar un nombre para el departamento",
        error: true,
      });
    }

    try {
      if (departamentoAEditar) {
        await actualizarDepartamento(departamentoAEditar.id, nuevoDepartamento);
        setAlerta({
          message: "Departamento actualizado con éxito",
          error: false,
        });
        setDepartamentoAEditar(null); // Limpiar el departamento a editar
      } else {
        await guardarDepartamento(nuevoDepartamento);
        setAlerta({ message: "Departamento creado con éxito", error: false });
      }
      cargarDepartamentos();
      setNuevoDepartamento({ nombre: "" }); // Limpiar formulario después de agregar/editar
    } catch (error) {
      console.error("Error al agregar/actualizar departamento:", error);
      setAlerta({ message: "Error al procesar el departamento", error: true });
    }

    setTimeout(() => {
      setAlerta({});
    }, 3000);
  };

  const editarDepartamento = async (id) => {
    try {
      const departamento = await obtenerDepartamento(id);
      setDepartamentoAEditar(departamento);
      setNuevoDepartamento({ nombre: departamento.nombre }); // Cargar datos en el formulario
    } catch (error) {
      console.error("Error al obtener departamento para editar:", error);
    }
  };

  const eliminarDepartamentoSeleccionado = async (id) => {
    try {
      await eliminarDepartamento(id);
      setAlerta({
        message: "Departamento eliminado con éxito",
        error: false,
      });

      cargarDepartamentos();
    } catch (error) {
      console.error("Error al eliminar departamento:", error);
      setAlerta({
        message: "Error al eliminar el departamento",
        error: true,
      });
    }
  };

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const departamentosPorPagina = 10;

  const indexUltimoDepartamento = paginaActual * departamentosPorPagina;
  const indexPrimerDepartamento =
    indexUltimoDepartamento - departamentosPorPagina;
  const departamentosVisibles = departamentos
    .filter((departamento) =>
      departamento.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )
    .slice(indexPrimerDepartamento, indexUltimoDepartamento);

  const totalPaginas = Math.ceil(departamentos.length / departamentosPorPagina);

  const cambiarPagina = (numeroPagina) => {
    if (numeroPagina >= 1 && numeroPagina <= totalPaginas) {
      setPaginaActual(numeroPagina);
    }
  };

  const { message } = alerta;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Gestión de Departamentos
      </h2>
      <p className="text-gray-600 mb-4">
        Administra los departamentos del sistema y gestiona su información.
      </p>

      {message && <Alerta alerta={alerta} />}

      {/* Campo de búsqueda */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Busqueda Avanzada
        </h3>
        <input
          type="text"
          placeholder="Buscar departamento..."
          className="border border-gray-300 rounded-lg px-4 py-2 w-full text-sm"
          value={busqueda}
          onChange={handleBusquedaChange}
        />
      </div>

      {/* Formulario para agregar o editar departamento */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          {departamentoAEditar ? "Editar Departamento" : "Agregar Departamento"}
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
        </div>
        <button
          onClick={agregarDepartamento}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg shadow transition"
        >
          {departamentoAEditar ? "Actualizar" : "Agregar"}
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
                  <td className="px-4 py-2 text-sm text-center space-x-2">
                    <button
                      onClick={() => editarDepartamento(departamento.id)}
                      className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-3 py-1 rounded-md text-xs font-medium"
                    >
                      Editar
                    </button>
                    <button
                      disabled
                      onClick={() =>
                        eliminarDepartamentoSeleccionado(departamento.id)
                      }
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
