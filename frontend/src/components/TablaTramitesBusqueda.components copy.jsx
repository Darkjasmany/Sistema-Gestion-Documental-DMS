import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

const TablaTramitesBusqueda = ({ tramitesBusqueda = [] }) => {
  console.log("📌 Datos recibidos en la tabla:", tramitesBusqueda);

  return (
    <div>
      {tramitesBusqueda.length > 0 ? (
        <p>Se recibieron {tramitesBusqueda.length} trámites</p>
      ) : (
        <p>No hay trámites disponibles</p>
      )}
    </div>
  );
  // Asegurar que tramitesBusqueda sea un array válido
  const data = useMemo(() => tramitesBusqueda ?? [], [tramitesBusqueda]);

  const columns = useMemo(
    () => [
      { header: "N° Trámite", accessorKey: "numeroTramite" },
      { header: "Asunto", accessorKey: "asunto" },
      { header: "Fecha", accessorKey: "fechaDocumento" },
      { header: "Prioridad", accessorKey: "prioridad" },
      { header: "Estado", accessorKey: "estado" },
    ],
    []
  );

  const table = useReactTable({
    data,
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
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-100">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border p-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center p-3">
                No se encontraron trámites
              </td>
            </tr>
          )}
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
