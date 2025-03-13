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

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Gestión de Departamentos
      </h2>
      <p className="text-gray-600">
        Desde esta sección podrás administrar los departamentos del sistema,
        asignar un coordinador por área y visualizar su información.
      </p>

      {/* BONUS: Aquí podrías poner una tabla o formulario en el futuro */}
      <div className="mt-6 text-sm text-gray-500 italic">
        (Módulo en desarrollo - próximamente funcionalidades disponibles)
      </div>

      {/* Formulario para agregar departamento */}
      <div>
        <h3>Agregar Departamento</h3>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={nuevoDepartamento.nombre}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="coordinadorId"
          placeholder="ID del Coordinador"
          value={nuevoDepartamento.coordinadorId}
          onChange={handleInputChange}
        />
        <button onClick={agregarDepartamento}>Agregar</button>
      </div>

      {/* Lista de departamentos */}
      <div>
        <h3>Lista de Departamentos</h3>
        <ul>
          {departamentos.map((departamento) => (
            <li key={departamento.id}>
              {departamento.nombre} - Coordinador: {departamento.coordinador_id}
              <button onClick={() => editarDepartamento(departamento.id)}>
                Editar
              </button>
              <button
                onClick={() =>
                  eliminarDepartamentoSeleccionado(departamento.id)
                }
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Formulario para editar departamento */}
      {departamentoAEditar && (
        <div>
          <h3>Editar Departamento</h3>
          <input
            type="text"
            name="nombre"
            value={departamentoAEditar.nombre}
            onChange={(e) =>
              setDepartamentoAEditar({
                ...departamentoAEditar,
                nombre: e.target.value,
              })
            }
          />
          <input
            type="text"
            name="coordinadorId"
            value={departamentoAEditar.coordinador_id}
            onChange={(e) =>
              setDepartamentoAEditar({
                ...departamentoAEditar,
                coordinador_id: e.target.value,
              })
            }
          />
          <button onClick={actualizarDepartamentoEditado}>Actualizar</button>
        </div>
      )}
    </div>
  );
};

export default Departamentos;
