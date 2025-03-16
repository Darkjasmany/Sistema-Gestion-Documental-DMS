import React from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import moment from "moment";

const ExportButtons = ({ data, filtros }) => {
  // Exportar a Excel
  const exportToExcel = () => {
    const worksheetData = data.map((t, index) => ({
      "N°": index + 1,
      Trámite: t.numero_tramite,
      "Oficio Remitente": t.numero_oficio_remitente,
      Asunto: t.asunto,
      "Fecha Documento": t.fecha_documento,
      "Depto. Remitente": t.departamentoRemitente?.nombre || "Sin departamento",
      Remitente: t.remitente?.nombreCompleto || "Sin remitente",
      Estado: t.estado,
      Descripción: t.descripcion,
      Destinatarios:
        t.destinatarios?.map((d) => d.nombreCompleto).join(", ") ||
        "Sin destinatarios",
      Observaciones:
        t.historialObservaciones
          ?.map((o) => `(${o.fecha}) ${o.observacion}`)
          .join(" | ") || "Sin observaciones",
      Usuario_Creador: t.usuario?.UsuarioCreacion || "",
      Fecha_Creación: moment(t.createdAt).format("YYYY-MM-DD HH:mm"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trámites");
    XLSX.writeFile(workbook, "Tramites.xlsx");
  };

  // Exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF("landscape"); // o "portrait" = vertical

    // Cabecera
    doc.setFontSize(16);
    doc.text("DMS - Sistema de Gestión Documental", 14, 15);

    // Mostrar filtros aplicados
    /*let filtrosTexto = "";
    if (filtros && Object.keys(filtros).length > 0) {
      filtrosTexto = Object.entries(filtros)
        .map(([clave, valor]) => `${clave}: ${valor}`)
        .join(" | ");

      doc.setFontSize(10);
      doc.text(`Filtros aplicados: ${filtrosTexto}`, 14, 25);
    }*/

    // Ajuste para la tabla para que no se sobreponga con el título
    const startY = 20; // Ubicación de la tabla (después del título y filtros)

    // Insertar los datos a la tabla con autoTable
    const tableData = data.map((t, index) => [
      index + 1,
      t.numero_tramite,
      t.numero_oficio_remitente,
      t.asunto,
      t.fecha_documento,
      t.departamentoRemitente?.nombre || "Sin departamento",
      t.remitente?.nombreCompleto || "Sin remitente",
      t.estado,
      t.descripcion,
      t.destinatarios?.map((d) => d.nombreCompleto).join(", ") ||
        "Sin destinatarios",
      t.historialObservaciones
        ?.map((o) => `(${o.fecha}) ${o.observacion}`)
        .join(" | ") || "Sin observaciones",
      t.usuario?.UsuarioCreacion || "",
      moment(t.createdAt).format("YYYY-MM-DD HH:mm"),
    ]);

    // ✅ Insertar la tabla con autoTable
    autoTable(doc, {
      head: [
        [
          "N°",
          "Trámite",
          "Oficio Remitente",
          "Asunto",
          "Fecha Documento",
          "Depto. Remitente",
          "Remitente",
          "Estado",
          "Descripción",
          "Destinatarios",
          "Observaciones",
          "Usuario_Creador",
          "Fecha_Creación",
        ],
      ],
      body: tableData,
      styles: { fontSize: 6 },
      columnStyles: {
        8: { cellWidth: 60 },
        9: { cellWidth: 80 },
      },
      startY: startY, // Inicia la tabla en la posición ajustada
      didDrawPage: (data) => {
        // ✅ Pie de página: Número de página
        const pageCount = doc.internal.getNumberOfPages();
        const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
        const str = `Página ${pageNumber} de ${pageCount}`;
        doc.setFontSize(9);
        doc.text(
          str,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
    });

    // ✅ Descargar el archivo PDF
    doc.save("Tramites.pdf");
  };

  return (
    <div className="flex gap-3 my-4">
      <button
        onClick={exportToExcel}
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-md"
      >
        <FaFileExcel className="text-white text-lg" />
        Excel
      </button>
      <button
        onClick={exportToPDF}
        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 shadow-md"
      >
        <FaFilePdf className="text-white text-lg" />
        PDF
      </button>
    </div>
  );
};

export default ExportButtons;
