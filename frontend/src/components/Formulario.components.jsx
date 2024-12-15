import { useState, useEffect } from "react";
import clienteAxios from "../config/axios.config";
import Alerta from "../components/Alerta.components";

const Formulario = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [remitentes, setRemitentes] = useState([]);

  const [alerta, setAlerta] = useState({});

  const handleDepartamentoChange = async (e) => {
    const departamentoId = e.target.value;

    if (!departamentoId) {
      return setRemitentes([]); // Limpia la lista si no hay un departamento seleccionado
    }

    try {
      const { data } = await clienteAxios(
        `/empleados/por-departamento/${departamentoId}`
      );

      setRemitentes(data);
    } catch (error) {
      console.error(error.response?.data?.message);
      setRemitentes([]); // Limpia la lista en caso de error
    }
  };

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const { data } = await clienteAxios("/departamentos");
        setDepartamentos(data);
      } catch (error) {
        console.lo(error.response?.data?.message);
      }
    };

    fetchDepartamentos();
  }, []);

  const { message } = alerta;
  return (
    <>
      <p className="text-lg text-center mb-10">
        Añade tus trámites y{" "}
        <span className="text-indigo-600 font-bold">Administralos</span>
      </p>
      <form
        action=""
        className="bg-white py-10 px-5 mb-10 lg:mb-0 shadow-md rounded-md"
      >
        {message && <Alerta alerta={alerta} />}
        {/* Campo para el Asunto */}
        <div className="mb-5">
          <label htmlFor="asunto" className="text-gray-700 uppercase font-bold">
            Asunto
          </label>
          <input
            type="text"
            id="asunto"
            placeholder="Ingresa el asunto del Trámite"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          />
        </div>

        {/* Campo para la Referencia */}
        <div className="mb-5">
          <label
            htmlFor="referenciaTramite"
            className="text-gray-700 uppercase font-bold"
          >
            Referencia
          </label>
          <input
            type="text"
            id="referenciaTramite"
            placeholder="Ingresa la referencia del Trámite"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          />
        </div>

        {/* Campo para la Fecha */}
        <div className="mb-5">
          <label
            htmlFor="fechaDocumento"
            className="text-gray-700 uppercase font-bold"
          >
            Fecha del Trámite
          </label>
          <input
            type="date"
            id="fechaDocumento"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          />
        </div>

        {/* Campo para seleccionar Departamento */}
        <div className="mb-5">
          <label
            htmlFor="departamentoRemitenteId"
            className="text-gray-700 uppercase font-bold"
          >
            Departamento Remitente
          </label>
          <select
            name="departamentoRemitenteId"
            id="departamentoRemitenteId"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
            onChange={handleDepartamentoChange}
          >
            <option value="">Seleccione un departamento</option>
            {departamentos.map((departamento) => (
              <option value={departamento.id} key={departamento.id}>
                {departamento.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Campo para seleccionar Remitente */}
        <div className="mb-5">
          <label
            htmlFor="remitenteId"
            className="text-gray-700 uppercase font-bold"
          >
            Remitente
          </label>
          <select
            name="remitenteId"
            id="remitenteId"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          >
            <option value="">Seleccione un remitente</option>

            {remitentes.map((remitente) => (
              <option value={remitente.id} key={remitente.id}>
                {remitente.nombres} {remitente.apellidos}
              </option>
            ))}
          </select>
        </div>

        {/* Campo para seleccionar Prioridad */}
        <div className="mb-5">
          <label
            htmlFor="remitenteId"
            className="text-gray-700 uppercase font-bold"
          >
            Prioridad
          </label>
          <select
            name="remitenteId"
            id="remitenteId"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          >
            <option value="NORMAL" defaultChecked>
              NORMAL
            </option>
            <option value="MEDIA">MEDIA</option>
            <option value="ALTA">ALTA</option>
          </select>
        </div>

        {/* Campo para la Descripción */}
        <div className="mb-5">
          <label
            htmlFor="descripcion"
            className="text-gray-700 uppercase font-bold"
          >
            Descripción
          </label>
          <textarea
            id="descripcion"
            placeholder="Ingresa la descripción del Trámite"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          />
        </div>

        {/* Campo para cargar Archivos */}
        <div className="mb-5">
          <label
            htmlFor="archivo"
            className="text-gray-700 uppercase font-bold"
          >
            Cargar Archivos
          </label>
          <input
            type="file"
            id="archivo"
            accept=".jpg,.png,.zip,.rar"
            multiple
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          />
        </div>

        {/* Checkbox para Trámite Externo */}
        <div className="flex items-start mb-5">
          <div className="flex items-center h-5">
            <input
              id="tramiteExterno"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50"
              aria-label="Trámite Externo"
            />
          </div>
          <label
            htmlFor="tramiteExterno"
            className="ms-2 text-sm font-medium text-gray-900"
          >
            Trámite Externo
          </label>
        </div>

        <input
          type="submit"
          value={"Agregar Trámite"}
          className="bg-indigo-600 text-white w-full p-3 uppercase font-bold hover:bg-indigo-800 cursor-pointer transition-colors"
        />
      </form>
    </>
  );
};

export default Formulario;
