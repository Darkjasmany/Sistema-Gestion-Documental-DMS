import React, { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { formatearFecha } from "../helpers/formatearFecha.helpers";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import clienteAxios from "../config/axios.config";
import useAuth from "../hooks/useAuth.hook";

const TablaTramitesBusqueda = ({ tramiteBusqueda }) => {
  // console.log(tramiteBusqueda);

  const { auth } = useAuth();
  const [revisores, setRevisores] = useState([]);

  const location = useLocation();
  const isAsignarReasignar = location.pathname === "/admin/asignar-reasignar";

  const [tramiteExpandido, setTramiteExpandido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTramite, setSelectedTramite] = useState(null);

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
    const fecthRevisores = async () => {
      if (isAsignarReasignar) {
        try {
          const { data } = await clienteAxios.get(
            `/usuarios/revisor-departamento/${auth.departamento_id}`
          );
          setRevisores(data);
        } catch (error) {
          console.error("Error al cargar los datos", error);
        }
      } else {
        setRevisores([]);
      }
    };

    fecthRevisores();
  }, [isAsignarReasignar, auth]);

  const asignarOReasignarRevisor = async (revisorId) => {
    console.log(revisorId);
  };

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
        header: "Accion",
        cell: ({ row }) => (
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => toggleExpandir(row.original.id)}
          >
            {tramiteExpandido === row.original.id ? "Ocultar" : "Ver más"}
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
            Asignar
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

  return (
    <div className="overflow-x-auto">
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
                        <p>
                          <strong>Fecha de Creación:</strong>{" "}
                          {/* {row.original.createdAt} */}
                          {formatearFecha(row.original.createdAt)}
                        </p>
                        <p>
                          <strong>Remitente:</strong>{" "}
                          {row.original.remitente?.nombreCompleto}
                        </p>
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
        <div className="fixed inset-0 bg-black opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-3/4">
            <h2 className="text-center font-bold">
              {" "}
              Asignar|Reasignar Revisor para Trámite #
              {selectedTramite.numero_tramite}
            </h2>
            <ul>
              {revisores.map((revisor) => (
                <li key={revisor.id} className="mb-2">
                  <div className="flex justify-between">
                    <span>{revisor.nombres}</span>
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={() => asignarOReasignarRevisor(revisor.id)}
                    >
                      {" "}
                      Asignar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
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
