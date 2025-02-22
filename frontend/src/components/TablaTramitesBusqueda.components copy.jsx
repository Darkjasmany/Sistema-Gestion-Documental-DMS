import React, { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import clienteAxios from "../config/axios.config";
import useAuth from "../hooks/useAuth.hook";
import useTramites from "../hooks/useTramites.hook";
import Alerta from "../components/Alerta.components";
import { formatearFecha } from "../helpers/formatearFecha.helpers";

const TablaTramitesBusqueda = ({ tramiteBusqueda, onTramiteUpdated }) => {
  // console.log(tramiteBusqueda);

  const { auth } = useAuth();
  const [revisores, setRevisores] = useState([]);
  const location = useLocation();
  const isAsignarReasignar = location.pathname === "/admin/asignar-reasignar";
  const isAsignados = location.pathname === "/admin/asignados";

  const [tramiteExpandido, setTramiteExpandido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTramite, setSelectedTramite] = useState(null);

  // Estados para el fomrulario asignación/reasignación
  const [mostrarInputsAsignar, setMostrarInputsAsignar] = useState(false);
  const [revisorAsignado, setRevisorAsignado] = useState(null);
  const [fechaContestacion, setFechaContestacion] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [observacionAsignar, setObservacionAsignar] = useState("");
  const [prioridad, setPrioridad] = useState("NORMAL");

  // Estados para el formulario completar trámite
  const [mostrarInputsCompletar, setMostrarInputsCompletar] = useState(false);
  const [destinatarios, setDestinatarios] = useState([]);
  const [destinatariosSeleccionados, setDestinatariosSeleccionados] = useState(
    []
  );
  const [empleados, setEmpleados] = useState([]);
  const [fechaDespacho, setFechaDespacho] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [observacionCompletar, setObservacionCompletar] = useState("");
  const [estadoTramite, setEstadoTramite] = useState("PENDIENTE"); // Estado inicial, podrías usar otro si es necesario

  const { asignarOReasignarRevisorTramite, completarTramiteRevisorAsignado } =
    useTramites();
  const [alerta, setAlerta] = useState({});

  const toggleExpandir = (id) => {
    setTramiteExpandido(tramiteExpandido === id ? null : id);
  };

  const openModal = (tramite) => {
    setSelectedTramite(tramite);
    setIsModalOpen(true);

    // Reiniciar estados del formulario correspondiente
    if (isAsignarReasignar) {
      setMostrarInputsAsignar(false);
      setRevisorAsignado(null);
      setObservacionAsignar("");
    } else if (isAsignados) {
      setMostrarInputsCompletar(false);
      setDestinatarios([]);
      setObservacionCompletar("");
      setEstadoTramite(tramite.estado);
    }
  };

  const closeModal = () => {
    setSelectedTramite(null);
    setIsModalOpen(false);
    // setRevisorAsignado([]);
  };

  const fecthRevisores = async () => {
    if (isAsignarReasignar) {
      try {
        const { data } = await clienteAxios.get(
          `/usuarios/revisor-departamento/${auth.departamentoId}`
        );
        setRevisores(data);
      } catch (error) {
        console.error("Error al cargar los datos", error);
      }
    } else {
      setRevisores([]);
    }
  };

  useEffect(() => {
    fecthRevisores();
  }, [isAsignarReasignar, auth.departamentoId]);

  const asignarOReasignarRevisor = (revisorId) => {
    setMostrarInputsAsignar(true);
    setRevisorAsignado(revisorId); // Almacena el ID del revisor asignado
    setObservacionAsignar("");
    // setFechaContestacion("");
    setPrioridad("NORMAL");
  };

  const handleSubmitAsignar = async (e) => {
    e.preventDefault();
    const fechaActual = new Date().toISOString().slice(0, 10); // fecha actual en formato "yyyy-mm-dd"

    if ([fechaContestacion, observacionAsignar].includes("")) {
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

    const idtramiteSeleccionado = selectedTramite.id;
    const datosRevisor = {
      usuarioRevisorId: revisorAsignado,
      fechaMaximaContestacion: fechaContestacion,
      observacionRevisor: observacionAsignar,
      prioridad: prioridad,
    };

    try {
      const response = await asignarOReasignarRevisorTramite(
        idtramiteSeleccionado,
        datosRevisor
      );

      closeModal(); //Cerrar modal
      setMostrarInputsAsignar(false); // Ocultar los inputs
      setAlerta({ message: response.message, error: false });
      onTramiteUpdated(); // Llama a la función de actualización para actualizar la tabla
    } catch (error) {
      console.error(error.message);
      setAlerta({ message: error.message, error: true });
    }
  };

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

    if (isAsignados) {
      fecthEmpleados();
    }
  }, []);

  // Función para agregar o quitar destinatarios

  const handleDestinatariosSeleccionado = (destinatario) => {};

  const handleSubmitCompletar = async (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (alerta.message) {
      const timer = setTimeout(() => setAlerta({}), 3000);
      return () => clearTimeout(timer);
    }
  }, [alerta]);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "N°",
        accessorFn: (_, index) => index + 1, // Índice secuencial
      },
      { header: "Trámite", accessorKey: "numero_tramite" },
      {
        header: "Oficio Remitente",
        accessorKey: "numero_oficio_remitente",
      },
      {
        header: "Asunto",
        accessorKey: "asunto",
      },
      {
        header: "Fecha Documento",
        accessorKey: "fecha_documento",
      },
      {
        header: "Departamento Remitente",
        accessorFn: (row) =>
          row.departamentoRemitente?.nombre || "Sin departamento",
      },
      {
        header: "Remitente",
        accessorFn: (row) => row.remitente?.nombreCompleto || "Sin remitente",
      },
      {
        header: "Estado",
        accessorKey: "estado",
      },
      {
        header: "Detalle",
        cell: ({ row }) => (
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => toggleExpandir(row.original.id)}
          >
            {tramiteExpandido === row.original.id ? "Ocultar" : "Más"}
          </button>
        ),
      },
    ];

    if (isAsignarReasignar) {
      baseColumns.push({
        header: "Asigna | Reasigna",
        cell: ({ row }) => (
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => openModal(row.original)}
          >
            {row.original.estado === "INGRESADO" ? "Asignar" : "Reasignar"}
          </button>
        ),
      });
    }

    if (isAsignados) {
      baseColumns.push({
        header: "Acción",
        cell: ({ row }) => (
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => openModal(row.original)}
          >
            {row.original.estado === "PENDIENTE" ? "Completar" : "Editar"}
          </button>
        ),
      });
    }

    return baseColumns;
  }, [tramiteExpandido, isAsignarReasignar]);

  // Configuración de react-table por defecto para que funcione
  const table = useReactTable({
    data: tramiteBusqueda,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Hasta aqui configuracion por defecto para que funciones, seguido para la paginación
    initialState: {
      pagination: {
        pageSize: 15, // Cambia este valor al número de registros que deseas mostrar por página
      },
    },
  });

  const { message } = alerta;

  console.log(tramiteBusqueda);
  return (
    <div className="overflow-x-auto">
      {message && <Alerta alerta={alerta} />}
      {tramiteBusqueda.length === 0 ? (
        <p className="text-center text-gray-500"> No hay támites dispobibles</p>
      ) : (
        <table className="min-w-full border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="border p-3">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <tr className="hover:bg-gray-100">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="border p-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
                {tramiteExpandido === row.original.id && (
                  <tr className="bg-gray-100">
                    <td colSpan={columns.length} className="p-4">
                      <div>
                        <p>
                          <strong>Descripción:</strong>{" "}
                          {row.original.descripcion}
                        </p>

                        {row.original.usuarioRevisor?.UsuarioRevisor && (
                          <p>
                            <strong>Usuario Revisor:</strong>{" "}
                            {row.original.usuarioRevisor.UsuarioRevisor}
                          </p>
                        )}

                        <p>
                          <strong>Archivos:</strong>
                        </p>
                        <ul className="list-disc pl-5">
                          {row.original.tramiteArchivos?.length > 0 ? (
                            row.original.tramiteArchivos.map((archivo) => (
                              <li key={archivo.id}>
                                <a
                                  href={
                                    import.meta.env.VITE_BACKEND_URL +
                                    "/" +
                                    archivo.ruta
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline"
                                >
                                  {archivo.original_name}
                                </a>
                              </li>
                            ))
                          ) : (
                            <li>No hay archivos adjuntos</li>
                          )}
                        </ul>

                        <p>
                          <strong>Usuario Creación:</strong>{" "}
                          {row.original.usuario?.UsuarioCreacion}
                        </p>
                        <p>
                          <strong>Fecha de Creación:</strong>{" "}
                          {formatearFecha(row.original.createdAt)}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
      {/* Controles de paginación */}
      <div className="flex justify-between p-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black opacity-95 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-2/4 lg:w-1/3">
            <h2 className="text-center font-bold mb-5">
              {" "}
              {isAsignarReasignar
                ? "Asignar|Reasignar Revisor para Trámite #" +
                  selectedTramite.numero_tramite
                : isAsignados
                ? (selectedTramite.estado === "PENDIENTE"
                    ? "Completar Trámite #"
                    : "Editar Trámite #") + selectedTramite.numero_tramite
                : ""}
            </h2>
            {isAsignarReasignar && (
              <div>
                <ul>
                  {revisores.map((revisor) => (
                    // console.log(revisor)

                    <li key={revisor.id} className="mb-2 ">
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
                      {mostrarInputsAsignar &&
                        revisorAsignado === revisor.id && (
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
            )}

            {isAsignados && (
              <div>
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
                  <div className="mb-5">
                    <label
                      htmlFor="descripcion"
                      className="text-gray-700 font-medium"
                    >
                      Observación:
                    </label>
                    <textarea
                      id="descripcion"
                      value={observacionCompletar}
                      onChange={(e) => {
                        setObservacionCompletar(e.target.value);
                      }}
                      placeholder="Observación para el revisor"
                      className="border-2 w-full p-2 mt-2 h-11 placeholder-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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
            )}

            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded "
              onClick={closeModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaTramitesBusqueda;
