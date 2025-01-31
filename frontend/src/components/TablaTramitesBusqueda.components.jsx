import React, { useMemo, useState } from "react";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

const TablaTramitesBusqueda = ({ tramiteBusqueda }) => {
  console.log(tramiteBusqueda);

  const [tramiteExpandido, setTramiteExpandido] = useState(null);

  const toggleExpandir = (id) => {
    setTramiteExpandido(tramiteExpandido === id ? null : id);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha"; // Si es null o undefined, devuelve un texto por defecto
    const nuevaFecha = new Date(fecha);
    if (isNaN(nuevaFecha)) return "Fecha Invalida"; // Si la fecha no es válida, evita errores
    return new Intl.DateTimeFormat("es-EC", { dateStyle: "long" }).format(
      nuevaFecha
    );
  };

  const columns = useMemo(
    () => [
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
    ],
    [tramiteExpandido]
  );

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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              {tramiteExpandido === row.original.id && (
                <tr className="bg-gray-100">
                  <td colSpan={columns.length} className="p-4">
                    <div>
                      <p>
                        <strong>Descripción:</strong> {row.original.descripcion}
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
                        {console.log(row.original)}
                        {row.original.tramiteArchivos.map((archivo) => (
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
                        ))}
                      </ul>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

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
    </div>
  );
};

export default TablaTramitesBusqueda;
