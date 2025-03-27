import React, { useState, useEffect } from "react";
import clienteAxios from "../config/axios.config";
import useTramites from "../hooks/useTramites.hook";
import useAuth from "../hooks/useAuth.hook";

import Alerta from "./Alerta.components";

const CompletarTramiteDirecto = ({ tramite, onTramiteUpdated, closeModal }) => {
  const { auth } = useAuth();
  const [observacion, setObservacion] = useState("");
  const [alerta, setAlerta] = useState({});
  const [empleadosXRol, setEmpleadosXRol] = useState([]);
  const [empleadoDespachadorId, setEmpleadoDespachadorId] = useState("");
  const { despacharTramiteDirectoCompletado } = useTramites();

  useEffect(() => {
    const fecthEmpleadosXRol = async () => {
      const rol = ["DESPACHADOR"];
      try {
        if (!auth.departamentoId) {
          console.error("departamentoId no está definido en auth");
          return;
        }
        const { data } = await clienteAxios.get(
          `/usuarios/revisor-departamento/${auth.departamentoId}/${rol}`
        );
        setEmpleadosXRol(data);
      } catch (error) {
        console.error("Error al cargar los datos", error);
      }
    };

    fecthEmpleadosXRol();
  }, [auth.departamentoId]);

  const handleEmpleadoDespachadorChange = (e) => {
    // console.log(e.target.value);
    const empleadoId = e.target.value;
    setEmpleadoDespachadorId(empleadoId);
  };

  const handleSubmitCompletarDirecto = async (e) => {
    e.preventDefault();

    const datosCompletar = {
      observacion,
      empleadoDespachadorId,
    };

    try {
      let response;

      if (tramite.estado === "INGRESADO") {
        response = await despacharTramiteDirectoCompletado(
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
        onSubmit={handleSubmitCompletarDirecto}
      >
        {alerta.message && <Alerta alerta={alerta} />}

        {/* Campo para la Observación */}
        <div className="mb-5">
          <label className="text-gray-700 font-medium">Observación:</label>
          <textarea
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            placeholder="Observación para completar el trámite"
            // disabled={tramite.estado === "COMPLETADO"}
            className="border-2 w-full p-2 mt-2 h-20 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
          />
        </div>

        {/* Campo para designar empleado que despacha */}
        {tramite.estado === "INGRESADO" && (
          <div className="mb-5">
            <label
              htmlFor="empleadosxRol"
              className="text-gray-700 font-medium"
            >
              Despachador:
            </label>
            <select
              name="empleadosxRol"
              id="empleadosxRol"
              className="border-2 w-full h-10 p-2 mt-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={empleadoDespachadorId}
              onChange={handleEmpleadoDespachadorChange}
            >
              <option value={""}>Seleccione un depachador</option>

              {empleadosXRol.map((emp) => (
                <option value={emp.id} key={emp.id}>
                  {emp.nombres} {emp.apellidos} - {emp.rol}
                </option>
              ))}
            </select>
          </div>
        )}

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

export default CompletarTramiteDirecto;
