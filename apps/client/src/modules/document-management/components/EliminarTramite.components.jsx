import React, { useState, useEffect } from "react";
import clienteAxios from "../../../config/axios.config";
import useTramites from "../../../hooks/useTramites.hook";
import useAuth from "../../../hooks/useAuth.hook";

import Alerta from "../../../components/Alerta.components";

const EliminarTramite = ({ tramite, onTramiteUpdated, closeModal }) => {
  const { auth } = useAuth();
  const [observacion, setObservacion] = useState("");
  const [alerta, setAlerta] = useState({});
  const [empleadosXRol, setEmpleadosXRol] = useState([]);
  const [empleadoDespachadorId, setEmpleadoDespachadorId] = useState("");
  const { eliminarTramiteLogico } = useTramites();

  const handleSubmitEliminar = async (e) => {
    e.preventDefault();

    try {
      const response = await eliminarTramiteLogico(tramite.id, observacion);

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
        onSubmit={handleSubmitEliminar}
      >
        {alerta.message && <Alerta alerta={alerta} />}

        {/* Campo para la Observación */}
        <div className="mb-5">
          <label className="text-gray-700 font-medium">Observación:</label>
          <textarea
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            placeholder="Observación para eliminar el trámite"
            disabled={tramite.estado === "FINALIZADO"}
            className="border-2 w-full p-2 mt-2 h-20 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
          />
        </div>

        {/* Botón de Guardar */}
        <div className="text-right">
          <input
            type="submit"
            value="Eliminar"
            className="bg-indigo-600 text-white px-5 py-2 rounded-md uppercase font-bold hover:bg-indigo-800 cursor-pointer transition-colors"
          />
        </div>
      </form>
    </div>
  );
};

export default EliminarTramite;
