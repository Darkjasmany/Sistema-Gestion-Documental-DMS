import React from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";

const ExportButtons = ({ data }) => {
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
      Destinatarios:
        t.destinatarios?.map((d) => d.nombreCompleto).join(", ") ||
        "Sin destinatarios",
      Observaciones:
        t.historialObservaciones
          ?.map((o) => `(${o.fecha}) ${o.observacion}`)
          .join(" | ") || "Sin observaciones",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trámites");
    XLSX.writeFile(workbook, "Tramites.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF("landscape"); //horizontal x defecto vacio que es ("portrait")

    const tableData = data.map((t, index) => [
      index + 1,
      t.numero_tramite,
      t.numero_oficio_remitente,
      t.asunto,
      t.fecha_documento,
      t.departamentoRemitente?.nombre || "Sin departamento",
      t.remitente?.nombreCompleto || "Sin remitente",
      t.estado,
      t.destinatarios?.map((d) => d.nombreCompleto).join(", ") ||
        "Sin destinatarios",
      t.historialObservaciones
        ?.map((o) => `(${o.fecha}) ${o.observacion}`)
        .join(" | ") || "Sin observaciones",
    ]);

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
          "Destinatarios",
          "Observaciones",
        ],
      ],
      body: tableData,
      styles: { fontSize: 6 },
      columnStyles: {
        8: { cellWidth: 60 },
        9: { cellWidth: 80 },
      },
    });

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
