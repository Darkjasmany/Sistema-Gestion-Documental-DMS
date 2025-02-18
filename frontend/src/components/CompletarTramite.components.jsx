import React, { useState, useEffect } from "react";
import clienteAxios from "../config/axios.config";
import useTramites from "../hooks/useTramites.hook";

import Alerta from "../components/Alerta.components";

const CompletarTramite = ({ tramite, onTramiteUpdated, closeModal }) => {
  const [destinatarios, setDestinatarios] = useState([]);
  const [destinatariosSeleccionados, setDestinatariosSeleccionados] = useState(
    []
  );
  const [empleados, setEmpleados] = useState([]);
  const [fechaDespacho, setFechaDespacho] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [observacion, setObservacion] = useState("");
  const [prioridad, setPrioridad] = useState("NORMAL");

  const [alerta, setAlerta] = useState({});

  const { completarTramiteRevisorAsignado } = useTramites();

  //Function para cargar los destinatios
  useEffect(() => {
    const fecthEmpleados = async () => {
      try {
        const { data } = await clienteAxios("/empleados");
        // console.log(data);
        setEmpleados(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fecthEmpleados();
  }, []);

  // Función para agregar o quitar destinatarios

  const handleDestinatariosSeleccionado = (destinatario) => {
    if (destinatariosSeleccionados.includes(destinatario)) {
      setDestinatariosSeleccionados(
        destinatariosSeleccionados.filter((d) => d !== destinatario)
      );
    } else {
      setDestinatariosSeleccionados([
        ...destinatariosSeleccionados,
        destinatario,
      ]);
    }
  };

  const handleSubmitCompletar = async (e) => {
    e.preventDefault();

    const datosCompletar = {
      fechaDespacho,
      observacionRevisor: observacion,
      destinatarios: destinatariosSeleccionados.map((dest) => dest.id), // Envía solo los IDs
    };

    try {
      const response = await completarTramiteRevisorAsignado(
        tramite.id,
        datosCompletar
      );
      closeModal();
      onTramiteUpdated();
      setAlerta({ message: response.message, error: false });
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

  const { message } = alerta;
  return (
    <div>
      <form
        action=""
        className=" my-5 py-4 px-10 shadow-md rounded-md border"
        onSubmit={handleSubmitCompletar}
      >
        {message && <Alerta alerta={alerta} />}
        {/* Contenedor Grid */}
        <div className="grid grid-col-1 xl:grid-cols-2 xl:gap-5 ">
          {/* Campo para la Fecha */}
          <div className="mb-5">
            <label
              htmlFor="fechaDespacho"
              className="text-gray-700 font-medium block"
            >
              {/* block para que el label ocupe todo el ancho */}
              Fecha Contestación:
            </label>
            <input
              type="date"
              id="fechaDespacho"
              value={fechaDespacho}
              onChange={(e) => {
                setFechaDespacho(e.target.value);
              }}
              className="border-2 w-full h-10 p-2 mt-2 placeholder-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Cierre del contenedor Grid */}
        </div>

        {/* Destinatarios */}
        <div className="mb-5">
          <label className="text-gray-700 font-medium block">
            Destinatarios:
          </label>
          <div className="border-2 rounded-md p-2">
            {empleados.map((empleado) => (
              <div key={empleado.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  value={empleado.id}
                  checked={destinatariosSeleccionados.some(
                    (dest) => dest.id === empleado.id
                  )}
                  onChange={() => handleDestinatariosSeleccionado(empleado)}
                  className="mr-2"
                />
                <label>{empleado.nombres + " " + empleado.apellidos}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Campo para la Observación */}
        <div className="mb-5">
          <label
            htmlFor="observacionCompletar"
            className="text-gray-700 font-medium"
          >
            Observación:
          </label>
          <textarea
            id="observacionCompletar"
            value={observacion}
            onChange={(e) => {
              setObservacion(e.target.value);
            }}
            placeholder="Observación para completar el trámite"
            className="border-2 w-full p-2 mt-2 h-20 placeholder-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="grid 2xl:grid-cols-3">
          <input
            type="submit"
            value={"Guardar"}
            className="bg-indigo-600 text-white w-full p-3 uppercase font-bold hover:bg-indigo-800 cursor-pointer transition-colors 2xl:col-start-3"
          />
        </div>
      </form>
    </div>
  );
};

export default CompletarTramite;
