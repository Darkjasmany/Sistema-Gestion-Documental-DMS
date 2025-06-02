import React, { useMemo, useState, useEffect, memo } from "react";
import { useLocation } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import Alerta from "../../../components/Alerta.components";
import FiltroBusqueda from "../../../components/Buttons/FiltroBusqueda.components";
import ExportButtons from "../../../components/Buttons/ExportButtons.components";
import { formatearFecha } from "../../../helpers/formatearFecha.helpers";
import useAuth from "../../../hooks/useAuth.hook"; // Para sacar informacion de nuestro provider tenemos que usar nuestro HOOK
import AsignarReasignarTramite from "./AsignarReasignarTramite.components";
import CompletarTramite from "./CompletarTramite.components";
import AprobarTramite from "./AprobarTramite.components";
import DespacharTramite from "./DespacharTramite.components";
import CompletarTramiteDirecto from "./CompletarTramiteDirecto.components";
import EliminarTramite from "./EliminarTramite.components";

// Componente memoizado para la fila expandida
const FilaExpandida = memo(({ row, columns }) => {
  return (
    <tr className="bg-gray-100">
      <td colSpan={columns.length} className="p-4">
        <div>
          <p>
            <strong>Descripción Tramite:</strong> {row.original.descripcion}
          </p>

          <p>
            <strong>Prioridad:</strong> {row.original.prioridad}
          </p>

          {row.original.fecha_contestacion && (
            <p>
              <strong>Fecha Contestación:</strong>{" "}
              {row.original.fecha_contestacion}
            </p>
          )}

          {row.original.numero_oficio && (
            <p>
              <strong>Número de Memo|Oficio Contestación:</strong>{" "}
              {row.original.numero_oficio}
            </p>
          )}

          {row.original.destinatarios && (
            <>
              <p>
                <strong>Destinatarios:</strong>
              </p>
              <ul className="list-disc pl-5">
                {row.original.destinatarios?.length > 0 ? (
                  row.original.destinatarios.map((destinatario) => (
                    <li key={destinatario.destinatario.id}>
                      {destinatario.destinatario.nombres +
                        " " +
                        destinatario.destinatario.apellidos +
                        " - " +
                        destinatario.departamentoDestinatario.nombre}
                    </li>
                  ))
                ) : (
                  <li>No hay destinatarios</li>
                )}
              </ul>
            </>
          )}

          {row.original.tramiteObservaciones && (
            <>
              <p>
                <strong>Observaciones:</strong>
              </p>
              <ul className="list-disc pl-5">
                {row.original.tramiteObservaciones?.length > 0 ? (
                  row.original.tramiteObservaciones.map((observacion) => (
                    <li key={observacion.id}>
                      <div className="flex flex-col">
                        <span className="mb-1">
                          <strong>Usuario Creación:</strong>{" "}
                          {observacion.usuarioCreacionObservacion.nombres}{" "}
                          {observacion.usuarioCreacionObservacion.apellidos}
                        </span>
                        <span>
                          <strong>Detalle:</strong> {observacion.observacion}
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li>No hay observaciones</li>
                )}
              </ul>
            </>
          )}

          <p>
            <strong>Archivos:</strong>
          </p>
          <ul className="list-disc pl-5">
            {row.original.tramiteArchivos?.length > 0 ? (
              row.original.tramiteArchivos.map((archivo) => (
                <li key={archivo.id}>
                  <a
                    href={import.meta.env.VITE_BACKEND_URL + "/" + archivo.ruta}
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

          {row.original.usuarioRevisor?.UsuarioRevisor && (
            <p>
              <strong>Usuario Revisor:</strong>{" "}
              {row.original.usuarioRevisor.UsuarioRevisor}
            </p>
          )}

          {row.original.usuarioDespacho?.usuarioDespacho && (
            <p>
              <strong>Usuario Despacho:</strong>{" "}
              {row.original.usuarioDespacho.usuarioDespacho}
            </p>
          )}
          {row.original.fecha_despacho && (
            <p>
              <strong>Fecha Despacho:</strong> {row.original.fecha_despacho}
            </p>
          )}
          {row.original.hora_despacho && (
            <p>
              <strong>Hora Despacho:</strong> {row.original.hora_despacho}
            </p>
          )}
        </div>
      </td>
    </tr>
  );
});

const TablaTramitesBusqueda = ({ tramiteBusqueda, onTramiteUpdated }) => {
  // console.log(tramiteBusqueda);
  const location = useLocation();
  const isAsignarReasignar = location.pathname === "/admin/asignar-reasignar";
  const isAsignados = location.pathname === "/admin/asignados";
  const isCompletados = location.pathname === "/admin/completar-tramite";
  const isDespachar = location.pathname === "/admin/despachar-tramite";
  const isConsultar = location.pathname === "/admin/consultar-tramite";
  const { auth } = useAuth();

  const [tramiteExpandido, setTramiteExpandido] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDirecto, setIsModalOpenDirecto] = useState(false);
  const [isModalConsultar, setIsModalConsultar] = useState(false);
  const [selectedTramite, setSelectedTramite] = useState(null);

  const [alerta, setAlerta] = useState({});

  const [filtroTexto, setFiltroTexto] = useState("");

  const toggleExpandir = (id) => {
    // setTramiteExpandido(tramiteExpandido === id ? null : id);
    setTramiteExpandido((prev) => (prev === id ? null : id));
  };

  const openModal = (tramite) => {
    setSelectedTramite(tramite);
    setIsModalOpen(true);
  };

  const openModalDirecto = (tramite) => {
    setSelectedTramite(tramite);
    setIsModalOpenDirecto(true);
  };

  const openModalConsultar = (tramite) => {
    setSelectedTramite(tramite);
    setIsModalConsultar(true);
  };

  const closeModal = () => {
    setSelectedTramite(null); // Limpia el trámite seleccionado
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (alerta.message) {
      const timer = setTimeout(() => setAlerta({}), 3000);
      return () => clearTimeout(timer);
    }
  }, [alerta]);

  const dataFiltrada = useMemo(() => {
    if (!filtroTexto.trim()) return tramiteBusqueda;

    return tramiteBusqueda.filter((item) => {
      const texto = filtroTexto.toLowerCase();

      const numeroTramite = String(item.numero_tramite || "").toLowerCase();
      const numeroOficioRemitente = String(
        item.numero_oficio_remitente || ""
      ).toLowerCase();
      const asunto = String(item.asunto || "").toLowerCase();
      const departamentoRemitente = String(
        item?.departamentoRemitente?.nombre || ""
      ).toLowerCase();
      const remitente = String(
        item?.remitente?.nombreCompleto || ""
      ).toLowerCase();
      const fechaDocumento = String(item.fecha_documento || "");
      const estadoTramite = String(item.estado || "").toLowerCase();
      const usuarioRevisorTramite = item?.usuarioRevisor?.UsuarioRevisor
        ? String(item?.usuarioRevisor?.UsuarioRevisor).toLowerCase()
        : ""; // Caso null
      const sinRevisorTexto = "sin revisor";

      return (
        numeroTramite.includes(texto) ||
        numeroOficioRemitente.includes(texto) ||
        asunto.includes(texto) ||
        departamentoRemitente.includes(texto) ||
        remitente.includes(texto) ||
        fechaDocumento.includes(texto) ||
        estadoTramite.includes(texto) ||
        usuarioRevisorTramite.includes(texto) ||
        (item?.usuarioRevisor === null &&
          sinRevisorTexto.includes(texto.toLowerCase()))
      );
    });
  }, [filtroTexto, tramiteBusqueda]);

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
        cell: ({ row }) => {
          return (
            <button
              className={`px-3 py-1 rounded ${
                tramiteExpandido === row.original.id
                  ? "bg-red-500"
                  : "bg-blue-500"
              } text-white`}
              onClick={() => toggleExpandir(row.original.id)}
            >
              {tramiteExpandido === row.original.id ? "Ocultar" : "Más"}
            </button>
          );
        },
      },
    ];

    if (isConsultar || isAsignarReasignar || isCompletados) {
      // Columna condicional para el UsuarioRevisor dentro de isAsignarReasignar
      baseColumns.splice(
        baseColumns.findIndex((col) => col.header === "Detalle"),
        0,
        {
          header: "Revisor",
          accessorFn: (row) =>
            row.usuarioRevisor?.UsuarioRevisor || "Sin Revisor",
        }
      );
    }

    if (isAsignarReasignar) {
      baseColumns.push({
        header: "Asigna | Reasigna",
        cell: ({ row }) => (
          <div className="flex justify-between gap-3">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={() => openModal(row.original)}
            >
              {row.original.estado === "INGRESADO" ? "Asignar" : "Reasignar"}
            </button>
            {row.original.estado === "INGRESADO" ? (
              <button
                className="bg-purple-500 text-white px-3 py-1 rounded"
                onClick={() => openModalDirecto(row.original)}
              >
                {row.original.estado === "INGRESADO" ? "Despachar" : ""}
              </button>
            ) : (
              []
            )}
          </div>
        ),
      });
    }

    if (isAsignados || isCompletados || isDespachar) {
      baseColumns.push({
        header: "Acción",
        cell: ({ row }) => (
          <button
            className="bg-purple-600 text-white px-3 py-1 rounded"
            onClick={() => openModal(row.original)}
          >
            {isAsignados &&
              (row.original.estado === "PENDIENTE" ? "Completar" : "Editar")}
            {isCompletados &&
              (row.original.estado === "POR_FIRMAR" ? "Aprobar" : "Editar")}
            {isDespachar && "Despachar"}
          </button>
        ),
      });
    }

    if (auth.rol === "COORDINADOR" && isConsultar) {
      baseColumns.push({
        header: "Acción",
        cell: ({ row }) => (
          <button
            className="bg-red-600 text-white px-3 py-1 rounded"
            onClick={() => openModalConsultar(row.original)}
          >
            Eliminar
          </button>
        ),
      });
    }

    return baseColumns;
  }, [
    isAsignarReasignar,
    isAsignados,
    isCompletados,
    isDespachar,
    isConsultar,
    auth.rol,
    tramiteExpandido,
  ]);

  // Usar useMemo para memorizar los datos
  const data = useMemo(() => tramiteBusqueda, [tramiteBusqueda]);

  // Configuración de react-table por defecto para que funcione
  const table = useReactTable({
    // data: tramiteBusqueda,
    // data,
    data: dataFiltrada,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Hasta aqui configuracion por defecto para que funciones, seguido para la paginación
    initialState: {
      pagination: {
        pageSize: 30, // Cambia este valor al número de registros que deseas mostrar por página
      },
    },
  });

  const { message } = alerta;

  // console.log(tramiteBusqueda);
  // console.log("Renderizando tabla de trámites");

  return (
    <div className="overflow-x-auto">
      {message && <Alerta alerta={alerta} />}
      {tramiteBusqueda.length === 0 ? (
        <p className="text-center text-gray-500"> No hay támites disponibles</p>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Busqueda Avanzada
          </h3>
          <div className="flex justify-end gap-3 mb-5 ">
            <FiltroBusqueda
              filtroTexto={filtroTexto}
              setFiltroTexto={setFiltroTexto}
            />
            {/* Botones para export */}
            <ExportButtons data={tramiteBusqueda} />
          </div>

          {/* Tabla */}
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
                    <FilaExpandida row={row} columns={columns} />
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </>
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
        // <div className="fixed inset-0 bg-black opacity-95 flex justify-center items-center">
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {/* <div className="bg-white p-5 rounded-lg w-2/4 lg:w-1/3"> */}
          <div
            className={`bg-white max-h-screen overflow-y-auto p-6 rounded-lg shadow-lg ${
              isAsignarReasignar ? "w-1/3" : "w-10/12"
            }`}
          >
            {/* <h2 className="text-center font-bold mb-5"> */}
            <h2 className="text-xl text-center font-semibold mb-5">
              {" "}
              {isAsignarReasignar
                ? "Asignar|Reasignar Revisor para Trámite # " +
                  selectedTramite.numero_tramite
                : isAsignados
                ? (selectedTramite.estado === "PENDIENTE"
                    ? "Completar Trámite # "
                    : selectedTramite.estado === "COMPLETADO"
                    ? "Despachar Trámite # "
                    : "Editar Trámite # ") + selectedTramite.numero_tramite
                : // "Editar Trámite #") + selectedTramite.numero_tramite
                isCompletados
                ? (selectedTramite.estado === "POR_REVISAR"
                    ? "Aprobar Trámite # "
                    : "Para Despachar # ") + selectedTramite.numero_tramite
                : isDespachar
                ? (selectedTramite.estado === "COMPLETADO"
                    ? "Entregar Trámite # "
                    : "Para Finalizar # ") + selectedTramite.numero_tramite
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
            {isDespachar && (
              <DespacharTramite
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

      {isModalOpenDirecto && selectedTramite && (
        <div className="fixed inset-0 bg-black opacity-95 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-2/4 lg:w-1/3">
            <h2 className="text-center font-bold mb-5">
              {"Asignar Despachador para Trámite #" +
                selectedTramite.numero_tramite}
            </h2>

            {isAsignarReasignar && (
              <CompletarTramiteDirecto
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

      {isModalConsultar && selectedTramite && (
        <div className="fixed inset-0 bg-black opacity-95 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-2/4 lg:w-1/3">
            <h2 className="text-center font-bold mb-5">
              {"Elimar el Trámite #" + selectedTramite.numero_tramite}
            </h2>

            {isConsultar && (
              <EliminarTramite
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
