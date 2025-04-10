import React, { useState, useEffect } from "react";
import clienteAxios from "../config/axios.config";
import useAuth from "../hooks/useAuth.hook";
import useTramites from "../hooks/useTramites.hook";

import Alerta from "../components/Alerta.components";

const AsignarReasignarTramite = ({ tramite, onTramiteUpdated, closeModal }) => {
  const { auth } = useAuth();
  const [revisores, setRevisores] = useState([]);
  const [mostrarInputsAsignar, setMostrarInputsAsignar] = useState(false);
  const [revisorAsignado, setRevisorAsignado] = useState(null);
  const [fechaContestacion, setFechaContestacion] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [observacionAsignar, setObservacionAsignar] = useState("");
  const [prioridad, setPrioridad] = useState("NORMAL");
  const { asignarOReasignarRevisorTramite } = useTramites();
  const [alerta, setAlerta] = useState({});

  const [hoveredRevisores, setHoveredRevisores] = useState({});

  useEffect(() => {
    const fecthRevisores = async () => {
      const rol = ["REVISOR"];
      try {
        if (!auth.departamentoId) {
          console.error("departamentoId no está definido en auth");
          return;
        }
        const { data } = await clienteAxios.get(
          `/usuarios/revisor-departamento/${auth.departamentoId}/${rol}`
        );
        setRevisores(data);
      } catch (error) {
        console.error("Error al cargar los datos", error);
      }
    };

    fecthRevisores();
  }, [auth.departamentoId]);

  const asignarOReasignarRevisor = (revisorId) => {
    setMostrarInputsAsignar(true);
    setRevisorAsignado(revisorId); // Almacena el ID del revisor asignado
    setObservacionAsignar("");
    // setFechaContestacion("");
    setPrioridad("NORMAL");
    setHoveredRevisores({ ...hoveredRevisores, [revisorId]: false }); // Desactiva el hover
  };

  const handleSubmitAsignar = async (e) => {
    e.preventDefault();
    const fechaActual = new Date().toISOString().slice(0, 10); // fecha actual en formato "yyyy-mm-dd"

    if ([fechaContestacion].includes("")) {
      // if ([fechaContestacion, observacionAsignar].includes("")) {
      setAlerta({
        message: "Todos los campos son obligatorios",
        error: true,
      });
      return;
    }

    if (fechaContestacion < fechaActual) {
      setAlerta({
        message:
          "La fecha de contestación no puede ser inferior a la fecha actual",
        error: true,
      });
      return;
    }

    const datosRevisor = {
      usuarioRevisorId: revisorAsignado,
      fechaMaximaContestacion: fechaContestacion,
      observacionRevisor: observacionAsignar,
      prioridad: prioridad,
    };

    try {
      // let response;
      const response = await asignarOReasignarRevisorTramite(
        tramite.id,
        datosRevisor
      );

      // setAlerta({ message: response?.data?.message, error: false });
      setAlerta({ message: response.message, error: response.error });

      if (!response.error) {
        setTimeout(() => {
          closeModal();
          onTramiteUpdated();
        }, 1000);
      }
      // onTramiteUpdated(); // Llama a la función de actualización para actualizar la tabla
      // closeModal(); //Cerrar modal
    } catch (error) {
      console.error(error.message);
      setAlerta({ message: error.message, error: true });
    }
  };

  useEffect(() => {
    if (alerta.message) {
      const timer = setTimeout(() => setAlerta({}), 1000);
      return () => clearTimeout(timer);
    }
  }, [alerta]);

  const { message } = alerta;

  return (
    <div>
      <ul>
        {revisores.map((revisor) => (
          // console.log(revisor)

          <li
            key={revisor.id}
            // className="mb-2 p-2 rounded-md hover:bg-indigo-100 transition-colors duration-200"
            className={`mb-2 p-2 rounded-md ${
              hoveredRevisores[revisor.id] ? "bg-indigo-100" : ""
            } transition-colors `}
            onMouseEnter={() =>
              setHoveredRevisores({ ...hoveredRevisores, [revisor.id]: true })
            }
            onMouseLeave={() =>
              setHoveredRevisores({ ...hoveredRevisores, [revisor.id]: false })
            }
          >
            <div className="flex justify-between">
              <span>{revisor.nombres + " " + revisor.apellidos}</span>
              <button
                className="bg-indigo-600 hover:bg-indigo-800 text-white px-3 py-1 rounded focus:bg-indigo-800"
                onClick={() => asignarOReasignarRevisor(revisor.id)}
              >
                {" "}
                Asignar
              </button>
            </div>

            {/* Mostrar el formulario para que defina si muestra lo inputs para asignar o reasignar */}
            {mostrarInputsAsignar && revisorAsignado === revisor.id && (
              // Condicional para mostrar los inputs
              <form
                action=""
                className=" my-5 py-4 px-10 shadow-md rounded-md border"
                onSubmit={handleSubmitAsignar}
              >
                {message && <Alerta alerta={alerta} />}

                {/* Contenedor Grid */}
                <div className="grid grid-col-1 xl:grid-cols-2 xl:gap-5 ">
                  {/* Campo para la Fecha */}
                  <div className="mb-5">
                    <label
                      htmlFor="fechaContestacion"
                      className="text-gray-700 font-medium block"
                    >
                      {/* block para que el label ocupe todo el ancho */}
                      Fecha de Contestación:
                    </label>
                    <input
                      type="date"
                      id="fechaContestacion"
                      value={fechaContestacion}
                      onChange={(e) => {
                        setFechaContestacion(e.target.value);
                      }}
                      className="border-2 w-full h-10 p-2 mt-2 placeholder-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Campo Prioridad */}
                  <div className="mb-5">
                    <label
                      htmlFor="prioridad"
                      className="text-gray-700 font-medium block"
                    >
                      Prioridad:
                    </label>
                    <select
                      name="prioridad"
                      id="prioridad"
                      value={prioridad}
                      onChange={(e) => {
                        setPrioridad(e.target.value);
                      }}
                      className="border-2 w-full h-10 p-2 mt-2   placeholder-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="NORMAL">NORMAL</option>
                      <option value="MEDIA">MEDIA</option>
                      <option value="ALTA">ALTA</option>
                    </select>
                  </div>
                  {/* Cierre del contenedor Grid */}
                </div>

                {/* Campo para la Observación */}
                {!tramite.usuarioRevisor && (
                  <div className="mb-5">
                    <label
                      htmlFor="descripcion"
                      className="text-gray-700 font-medium"
                    >
                      Observación:
                    </label>
                    <textarea
                      id="descripcion"
                      value={observacionAsignar}
                      onChange={(e) => {
                        setObservacionAsignar(e.target.value);
                      }}
                      placeholder="Observación para el revisor"
                      className="border-2 w-full p-2 mt-2 h-11 placeholder-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                )}

                <div className="grid 2xl:grid-cols-3">
                  <input
                    type="submit"
                    value={"Guardar Revisor"}
                    className="bg-indigo-600 text-white w-full p-3 uppercase font-bold hover:bg-indigo-800 cursor-pointer transition-colors 2xl:col-start-3"
                  />
                </div>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AsignarReasignarTramite;
