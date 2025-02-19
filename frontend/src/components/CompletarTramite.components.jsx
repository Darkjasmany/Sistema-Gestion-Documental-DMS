import React, { useState, useEffect } from "react";
import clienteAxios from "../config/axios.config";
import useTramites from "../hooks/useTramites.hook";

import Alerta from "../components/Alerta.components";

const CompletarTramite = ({ tramite, onTramiteUpdated, closeModal }) => {
  const [empleados, setEmpleados] = useState([]);
  const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);
  const [busquedaEmpleado, setBusquedaEmpleado] = useState("");
  const [sugerenciasEmpleados, setSugerenciasEmpleados] = useState([]);
  const [fechaDespacho, setFechaDespacho] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [observacion, setObservacion] = useState("");
  const [alerta, setAlerta] = useState({});

  const { completarTramiteRevisorAsignado } = useTramites();

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const { data } = await clienteAxios("/empleados");
        setEmpleados(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchEmpleados();
  }, []);

  // Función para filtrar empleados según la búsqueda

  useEffect(() => {
    if (busquedaEmpleado.trim() === "") {
      setSugerenciasEmpleados([]);
      return;
    }

    const filtro = empleados.filter((empleado) =>
      `${empleado.nombres} ${empleado.apellidos}`
        .toLowerCase()
        .includes(busquedaEmpleado.toLowerCase())
    );
    setSugerenciasEmpleados(filtro);
  }, [busquedaEmpleado, empleados]);

  // Función para seleccionar empleados
  const handleSeleccionEmpleado = (empleado) => {
    if (empleadosSeleccionados.some((sel) => sel.id === empleado.id)) {
      setEmpleadosSeleccionados(
        empleadosSeleccionados.filter((sel) => sel.id !== empleado.id)
      );
    } else {
      setEmpleadosSeleccionados([...empleadosSeleccionados, empleado]);
    }
    setBusquedaEmpleado("");
    setSugerenciasEmpleados([]);
  };

  // Función para eliminar un empleado seleccionado
  const handleEliminarEmpleado = (id) => {
    setEmpleadosSeleccionados(
      empleadosSeleccionados.filter((empleado) => empleado.id !== id)
    );
  };

  const handleSubmitCompletar = async (e) => {
    e.preventDefault();

    const datosCompletar = {
      fechaDespacho,
      observacion,
      destinatarios: empleadosSeleccionados.map((empleado) => empleado.id),
    };

    try {
      const response = await completarTramiteRevisorAsignado(
        tramite.id,
        datosCompletar
      );

      if (response.error) {
        setAlerta({ message: response.message, error: true });
      } else {
        setAlerta({ message: response.message, error: false });
        closeModal();
        onTramiteUpdated();
      }
    } catch (error) {
      console.error(error.message);
      setAlerta({ message: error.message, error: true });
    }
  };

  useEffect(() => {
    if (alerta.message) {
      const timer = setTimeout(() => setAlerta({}), 3000);
      return () => clearTimeout(timer);
    }
  }, [alerta]);

  return (
    <div>
      <form
        className="my-5 py-4 px-10 shadow-md rounded-md border"
        onSubmit={handleSubmitCompletar}
      >
        {alerta.message && <Alerta alerta={alerta} />}

        {/* Campo para la Fecha */}
        <div className="mb-5">
          <label className="text-gray-700 font-medium block">
            Fecha Contestación:
          </label>
          <input
            type="date"
            value={fechaDespacho}
            onChange={(e) => setFechaDespacho(e.target.value)}
            className="border-2 w-full h-10 p-2 mt-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Input de búsqueda y selección de empleados */}
        <div className="mb-5">
          <label className="text-gray-700 font-medium block">
            Buscar y seleccionar empleados:
          </label>
          <input
            type="text"
            placeholder="Escribe un nombre..."
            value={busquedaEmpleado}
            onChange={(e) => setBusquedaEmpleado(e.target.value)}
            className="border-2 w-full h-10 p-2 mt-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />

          {/* Sugerencias de empleados */}
          {sugerenciasEmpleados.length > 0 && (
            <ul className="border mt-2 rounded-md bg-white shadow-md max-h-40 overflow-y-auto">
              {sugerenciasEmpleados.map((empleado) => (
                <li
                  key={empleado.id}
                  onClick={() => handleSeleccionEmpleado(empleado)}
                  className="p-2 cursor-pointer hover:bg-indigo-100"
                >
                  {empleado.nombres} {empleado.apellidos}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Lista de empleados seleccionados */}
        {empleadosSeleccionados.length > 0 && (
          <div className="mb-5">
            <label className="text-gray-700 font-medium block">
              Empleados seleccionados:
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {empleadosSeleccionados.map((empleado) => (
                <div
                  key={empleado.id}
                  className="bg-indigo-200 px-3 py-1 rounded-full flex items-center"
                >
                  <span className="mr-2">
                    {empleado.nombres} {empleado.apellidos}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleEliminarEmpleado(empleado.id)}
                    className="text-red-600 font-bold hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Campo para la Observación */}
        <div className="mb-5">
          <label className="text-gray-700 font-medium">Observación:</label>
          <textarea
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            placeholder="Observación para completar el trámite"
            className="border-2 w-full p-2 mt-2 h-20 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Botón de Guardar */}
        <div className="text-right">
          <input
            type="submit"
            value="Guardar"
            className="bg-indigo-600 text-white px-5 py-2 rounded-md uppercase font-bold hover:bg-indigo-800 cursor-pointer transition-colors"
          />
        </div>
      </form>
    </div>
  );
};

export default CompletarTramite;
