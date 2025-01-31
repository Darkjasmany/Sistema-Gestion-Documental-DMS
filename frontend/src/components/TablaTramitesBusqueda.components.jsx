import { useMemo, useState } from "react";
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

  const columns = useMemo(
    () => [
      { header: "Número de Trámite", accessorKey: "numero_tramite" },
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
        header: "Descripción",
        accessorKey: "descripcion",
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

  const table = useReactTable({
    data: tramiteBusqueda,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
            <tr key={row.id} className="hover:bg-gray-100">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border p-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
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
