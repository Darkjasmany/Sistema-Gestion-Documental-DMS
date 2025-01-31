const TablaTramitesBusqueda = ({ tramiteBusqueda }) => {
  console.log("📌 Datos recibidos en la tabla:", tramiteBusqueda);

  return (
    <div>
      {tramiteBusqueda.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Número de Trámite</th>
              <th className="py-2 px-4 border-b">Oficio Remitente</th>
              <th className="py-2 px-4 border-b">Asunto</th>
              <th className="py-2 px-4 border-b">Fecha Documento</th>
              <th className="py-2 px-4 border-b">Prioridad</th>
              <th className="py-2 px-4 border-b">Descripción</th>
              <th className="py-2 px-4 border-b">Departamento Remitente</th>
              <th className="py-2 px-4 border-b">Remitente</th>
              <th className="py-2 px-4 border-b">Archivos</th>
            </tr>
          </thead>
          <tbody>
            {tramiteBusqueda.map((tramite) => (
              <tr key={tramite.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{tramite.numero_tramite}</td>
                <td className="py-2 px-4 border-b">
                  {tramite.numero_oficio_remitente}
                </td>
                <td className="py-2 px-4 border-b">{tramite.asunto}</td>
                <td className="py-2 px-4 border-b">
                  {tramite.fecha_documento}
                </td>
                <td className="py-2 px-4 border-b">{tramite.prioridad}</td>
                <td className="py-2 px-4 border-b">{tramite.descripcion}</td>
                <td className="py-2 px-4 border-b">
                  {tramite.departamentoRemitente.nombre}
                </td>
                <td className="py-2 px-4 border-b">
                  {tramite.remitente.nombreCompleto}
                </td>
                <td className="py-2 px-4 border-b">
                  {tramite.tramiteArchivos.map((archivo) => (
                    <div key={archivo.id}>
                      <a
                        href={`http://tudominio.com/${archivo.ruta}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        {archivo.original_name}
                      </a>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay trámites disponibles</p>
      )}
    </div>
  );
};

export default TablaTramitesBusqueda;
