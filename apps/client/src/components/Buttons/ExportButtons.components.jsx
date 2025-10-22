import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import moment from "moment";

const ExportButtons = ({ data, filtros }) => {
  // Exportar a Excel
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Trámites");

    // Cabeceras
    worksheet.columns = [
      { header: "N°", key: "numero", width: 5 },
      { header: "Trámite", key: "numero_tramite", width: 20 },
      { header: "Oficio Remitente", key: "numero_oficio_remitente", width: 20 },
      { header: "Asunto", key: "asunto", width: 30 },
      { header: "Fecha Documento", key: "fecha_documento", width: 15 },
      { header: "Depto. Remitente", key: "departamentoRemitente", width: 25 },
      { header: "Remitente", key: "remitente", width: 25 },
      { header: "Estado", key: "estado", width: 15 },
      // { header: "Descripción", key: "descripcion", width: 30 },
      {
        header: "Destinatarios",
        key: "destinatarios",
        width: 30,
      },
      {
        header: "Observaciones",
        key: "observaciones",
        width: 40,
      },
      { header: "Usuario_Creador", key: "usuarioCreacion", width: 20 },
      { header: "Usuario_Revisor", key: "usuarioRevisor", width: 20 },
      { header: "Usuario_Despacho", key: "usuarioDespacho", width: 20 },
      { header: "Fecha_Creación", key: "fechaCreacion", width: 20 },
    ];

    // Agregar datos
    data.forEach((t, index) => {
      worksheet.addRow({
        numero: index + 1,
        numero_tramite: t.numero_tramite,
        numero_oficio_remitente: t.numero_oficio_remitente,
        asunto: t.asunto,
        fecha_documento: t.fecha_documento,
        departamentoRemitente:
          t.departamentoRemitente?.nombre || "Sin departamento",
        remitente: t.remitente?.nombreCompleto || "Sin remitente",
        estado: t.estado,
        // descripcion: t.descripcion,
        destinatarios:
          t.destinatarios
            ?.map(
              (d) => `- ${d.destinatario?.nombres} ${d.destinatario?.apellidos}`
            )
            .join("\n") || "Sin destinatarios",
        observaciones:
          t.tramiteObservaciones
            ?.map(
              (o) =>
                `- ${o.observacion} (por ${o.usuarioCreacionObservacion?.nombres} ${o.usuarioCreacionObservacion?.apellidos})`
            )
            .join("\n") || "Sin observaciones",
        usuarioCreacion: t.usuario?.UsuarioCreacion || "",
        usuarioRevisor: t.usuarioRevisor?.UsuarioRevisor || "",
        usuarioDespacho: t.usuarioDespacho?.usuarioDespacho || "",
        fechaCreacion: moment(t.createdAt).format("YYYY-MM-DD HH:mm"),
      });
    });

    // Formato de celdas
    worksheet.columns.forEach((column) => {
      column.alignment = {
        vertical: "middle",
        horizontal: "left",
        wrapText: true,
      };
    });

    // Generar el archivo y descargar
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "Tramites.xlsx");
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
      // t.descripcion,
      t.destinatarios
        ?.map(
          (d) => `- ${d.destinatario?.nombres} ${d.destinatario?.apellidos}`
        )
        .join("\n") || "Sin destinatarios",

      t.tramiteObservaciones
        ?.map(
          (o) =>
            `- ${o.observacion} (por ${o.usuarioCreacionObservacion?.nombres} ${o.usuarioCreacionObservacion?.apellidos})`
        )
        .join("\n") || "Sin observaciones",

      t.usuario?.UsuarioCreacion || "",
      t.usuarioRevisor?.UsuarioRevisor || "",
      t.usuarioDespacho?.usuarioDespacho || "",
      moment(t.createdAt).format("YYYY-MM-DD HH:mm"),
    ]);

    // Configuración de la tabla
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
          // "Descripción",
          "Destinatarios",
          "Observaciones",
          "Usuario_Creador",
          "Usuario_Revisor",
          "Usuario_Despacho",
          "Fecha_Creación",
        ],
      ],
      body: tableData,
      styles: { fontSize: 6 },
      startY: startY,
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
        const date = moment().format("YYYY-MM-DD HH:mm");
        const footerText = `Fecha de impresión: ${date}  |  Página ${pageNumber} de ${pageCount}`;
        doc.setFontSize(9);
        doc.text(
          footerText,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
      autoSize: true,
    });

    // Descargar el archivo PDF
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
