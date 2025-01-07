import useTramites from "../hooks/useTramites.hook";

// Destructuramos el tramite que nos llega como prop siendo un objeto
const Tramite = ({ tramite }) => {
  const { setEdicion } = useTramites();

  // console.log(tramite);

  const {
    id,
    asunto,
    createdAt,
    descripcion,
    externo,
    fecha_documento,
    numero_tramite,
    prioridad,
    referencia_tramite,
    departamentoRemitente,
    remitente,
  } = tramite;

  // Formatear fechas
  // Aqui usamos una api de JS para formatear la fecha sin modificar el formato de la fecha en la base de datos
  const formatearFecha = (fecha) => {
    const nuevaFecha = new Date(`${fecha}T00:00`); // Convierte la fecha a un objeto Date Sin la "Z" (evitamos UTC)
    return new Intl.DateTimeFormat("es-EC", { dateStyle: "long" }).format(
      nuevaFecha
    );
  };

  const nombreDepartamento = departamentoRemitente?.nombre || "No especificado";
  const nombreRemitente = remitente?.nombreCompleto || "No especificado";

  return (
    <>
      <div className="mx-5 my-10 bg-white shadow-md p-5 py-10 rounded-xl">
        <p className="font-bold uppercase text-indigo-700 my-2">
          Número de Trámite:{" "}
          <span className="font-normal normal-case text-black">
            {numero_tramite}
          </span>
        </p>
        <p className="font-bold uppercase text-indigo-700 my-2">
          Asunto:{" "}
          <span className="font-normal normal-case text-black">{asunto}</span>
        </p>
        <p className="font-bold uppercase text-indigo-700 my-2">
          Referencia:{" "}
          <span className="font-normal normal-case text-black">
            {referencia_tramite}
          </span>
        </p>
        <p className="font-bold uppercase text-indigo-700 my-2">
          Fecha del Trámite:{" "}
          <span className="font-normal normal-case text-black">
            {formatearFecha(fecha_documento)}
          </span>
        </p>
        <p className="font-bold uppercase text-indigo-700 my-2">
          Departamento Remitente:{" "}
          <span className="font-normal normal-case text-black">
            {nombreDepartamento}
          </span>
        </p>
        <p className="font-bold uppercase text-indigo-700 my-2">
          Remitente:{" "}
          <span className="font-normal normal-case text-black">
            {nombreRemitente}
          </span>
        </p>
        <p className="font-bold uppercase text-indigo-700 my-2">
          Prioridad:{" "}
          <span className="font-normal normal-case text-black">
            {prioridad}
          </span>
        </p>
        <p className="font-bold uppercase text-indigo-700 my-2">
          Descripción:{" "}
          <span className="font-normal normal-case text-black">
            {descripcion}
          </span>
        </p>
        <p className="font-bold uppercase text-indigo-700 my-2">
          Número de Trámite:{" "}
          <span className="font-normal normal-case text-black">
            {numero_tramite}
          </span>
        </p>

        <div className="flex justify-between my-5">
          <button
            type="button"
            className="py-2 px-10 bg-indigo-600 hover:bg-indigo-700 text-white uppercase font-bold rounded-lg"
            onClick={() => {
              setEdicion(tramite);
            }}
          >
            Editar
          </button>
          <button
            type="button"
            className="py-2 px-10 bg-red-600 hover:bg-red-700 text-white uppercase font-bold rounded-lg"
          >
            Eliminar
          </button>
        </div>
      </div>
    </>
  );
};

export default Tramite;
