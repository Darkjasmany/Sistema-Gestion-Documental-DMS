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
  const [fechaLimite, setFechaLimite] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [observacionCoordinador, setObservacionCoordinador] = useState("");
  const [observacion, setObservacion] = useState("");
  const [memo, setMemo] = useState("");
  const [alerta, setAlerta] = useState({});

  const { completarTramiteRevisorAsignado, actualizarTramitecompletado } =
    useTramites();

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
  }, [empleados, busquedaEmpleado]);

  //Función para seleccionar empleados
  const handleSeleccionEmpleado = (empleado) => {
    if (
      empleadosSeleccionados.some((seleccion) => seleccion.id === empleado.id)
    ) {
      setEmpleadosSeleccionados(
        // TODO Si el empleado ya está en la lista, lo elimina
        // empleadosSeleccionados.filter(
        //   (seleccion) => seleccion.id !== empleado.id
        // )
        // TODO Si el empleado a esta en la lista muestra la lista sin acterr el contenido
        [...empleadosSeleccionados]
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

  // Inicializar los estados con los datos del trámite cuando se edita
  useEffect(() => {
    console.log(tramite);

    setFechaLimite(tramite.fecha_contestacion);
    //
    // Obtener la observación más antigua (primera en la lista ordenada)
    if (tramite?.tramiteObservaciones.length > 0) {
      const primeraObservacion = [...tramite.tramiteObservaciones].sort(
        (a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion)
      )[0].observacion;

      setObservacionCoordinador(primeraObservacion);
    } else {
      setObservacionCoordinador("");
    }
    //

    if (tramite?.numero_oficio) {
      setMemo(tramite.numero_oficio);
      setFechaDespacho(
        tramite.fecha_despacho || new Date().toISOString().split("T")[0]
      );

      // Obtener la observación más reciente
      if (tramite.tramiteObservaciones.length > 0) {
        const observacionUsuario = [...tramite.tramiteObservaciones].sort(
          // Obtener la observación más antigua (primera en la lista ordenada)
          // (a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion)
          (a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
        )[0].observacion;
        setObservacion(observacionUsuario);
      } else {
        setObservacion("");
      }

      setEmpleadosSeleccionados(
        tramite.destinatarios.map((dest) => ({
          id: dest.destinatario.id,
          nombres: dest.destinatario.nombres,
          apellidos: dest.destinatario.apellidos,
        }))
      );
    }
  }, [tramite]);

  const handleSubmitCompletar = async (e) => {
    e.preventDefault();

    const datosCompletar = {
      fechaDespacho,
      observacion,
      destinatarios: empleadosSeleccionados.map((empleado) => empleado.id),
    };

    try {
      let response;

      if (tramite.estado === "POR_REVISAR") {
        response = await actualizarTramitecompletado();
      } else {
        response = await completarTramiteRevisorAsignado(
          tramite.id,
          datosCompletar
        );
      }

      setAlerta({ message: response.message, error: response.error });

      if (!response.error) {
        setTimeout(() => {
          closeModal();
          onTramiteUpdated();
        }, 2000);
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

        <div className="flex justify-between gap-5">
          {/* Campo para la Fecha Limite*/}

          <div className="mb-5 w-full">
            <label className="text-gray-700 font-medium block">
              Fecha Limite Contestación:
            </label>
            <input
              type="date"
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
              className="border-2 w-full h-10 p-2 mt-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              disabled
            />
          </div>

          {/* Campo para la Fecha */}
          <div className="mb-5 w-full">
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
        </div>

        <div className="mb-5">
          <label className="text-gray-700 font-medium block">
            Nota Coordinador:
          </label>
          <input
            type="text"
            value={observacionCoordinador}
            // onChange={(e) => setMemo(e.target.value)}
            className="border-2 w-full h-10 p-2 mt-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            disabled
          />
        </div>

        {memo && (
          <div className="mb-5">
            <label className="text-gray-700 font-medium block">
              Número de Memo|Ofico:
            </label>
            <input
              type="text"
              value={memo}
              // onChange={(e) => setMemo(e.target.value)}
              className="border-2 w-full h-10 p-2 mt-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              disabled
            />
          </div>
        )}

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
                    X
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
