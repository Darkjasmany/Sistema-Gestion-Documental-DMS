import React, { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import Alerta from "../components/Alerta.components";
import { formatearFecha } from "../helpers/formatearFecha.helpers";
import AsignarReasignarTramite from "./AsignarReasignarTramite.components";
import CompletarTramite from "./CompletarTramite.components";
import AprobarTramite from "./AprobarTramite.components";

const TablaTramitesBusqueda = ({ tramiteBusqueda, onTramiteUpdated }) => {
  // console.log(tramiteBusqueda);

  const location = useLocation();
  const isAsignarReasignar = location.pathname === "/admin/asignar-reasignar";
  const isAsignados = location.pathname === "/admin/asignados";
  const isCompletados = location.pathname === "/admin/completar-tramite";

  const [tramiteExpandido, setTramiteExpandido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTramite, setSelectedTramite] = useState(null);

  const [alerta, setAlerta] = useState({});

  const toggleExpandir = (id) => {
    setTramiteExpandido(tramiteExpandido === id ? null : id);
  };

  const openModal = (tramite) => {
    setSelectedTramite(tramite);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTramite(null);
    setIsModalOpen(false);
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

    if (isCompletados) {
      baseColumns.push({
        header: "Acción",
        cell: ({ row }) => (
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => openModal(row.original)}
          >
            {row.original.estado === "POR_REVISAR"
              ? "Aprobar"
              : "Por despachar"}
          </button>
        ),
      });
    }

    return baseColumns;
  }, [tramiteExpandido, isAsignarReasignar, isAsignados, isCompletados]);

  // Configuración de react-table por defecto para que funcione
  const table = useReactTable({
    data: tramiteBusqueda,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Hasta aqui configuracion por defecto para que funciones, seguido para la paginación
    initialState: {
      pagination: {
        pageSize: 4, // Cambia este valor al número de registros que deseas mostrar por página
      },
    },
  });

  const { message } = alerta;

  // console.log(tramiteBusqueda);
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
                : isCompletados
                ? (selectedTramite.estado === "POR_REVISAR"
                    ? "Aprobar Trámite #"
                    : "Para Despachar #") + selectedTramite.numero_tramite
                : ""}
            </h2>
            {isAsignarReasignar && (
              <AsignarReasignarTramite
                tramite={selectedTramite}
                onTramiteUpdated={onTramiteUpdated}
                closeModal={closeModal}
              />
            )}

            {isAsignados && (
              <CompletarTramite
                tramite={selectedTramite}
                onTramiteUpdated={onTramiteUpdated}
                closeModal={closeModal}
              />
            )}
            {isCompletados && (
              <AprobarTramite
                tramite={selectedTramite}
                onTramiteUpdated={onTramiteUpdated}
                closeModal={closeModal}
              />
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
