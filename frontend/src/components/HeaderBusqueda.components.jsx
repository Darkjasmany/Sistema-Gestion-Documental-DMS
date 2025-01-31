import { useState, useEffect } from "react";
import clienteAxios from "../config/axios.config";
import useTramites from "../hooks/useTramites.hook";
import Alerta from "../components/Alerta.components";

const HeaderBusqueda = () => {
  const [formData, setFormData] = useState({
    numeroTramite: "",
    oficioRemitente: "",
    asunto: "",
    fechaInicio: "",
    fechaFin: "",
    departamentoRemitenteId: "",
    remitenteId: "",
    prioridad: "",
    tramiteExterno: "",
  });

  const [departamentos, setDepartamentos] = useState([]);
  const [remitentes, setRemitentes] = useState([]);

  const { buscarTramites } = useTramites();

  const [alerta, setAlerta] = useState({});

  // Cargar departamentos al montar el componente
  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const { data } = await clienteAxios("/departamentos");
        setDepartamentos(data);
      } catch (error) {
        console.error("Error al cargar departamentos:", error);
      }
    };

    fetchDepartamentos();
  }, []);

  useEffect(() => {
    if (alerta.message) {
      const timer = setTimeout(() => setAlerta({}), 3000); // Limpia la alerta después de 3s
      return () => clearTimeout(timer);
    }
  }, [alerta]);

  // Manejar cambio de inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar cambio del departamento y cargar remitentes
  const handleDepartamentoChange = async (e) => {
    const departamentoId = e.target.value;
    setFormData({ ...formData, departamentoRemitenteId: departamentoId });

    if (!departamentoId) {
      setRemitentes([]);
      return;
    }

    try {
      const { data } = await clienteAxios(
        `/empleados/por-departamento/${departamentoId}`
      );
      setRemitentes(data);
    } catch (error) {
      console.error("Error al cargar remitentes:", error);
      setRemitentes([]);
    }
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // ** El formData es un objecto por lo que convierto los valores del objeto a un array y aplico .every para  Retorna true si todos los valores son falsy ("", undefined, null, 0, false). Si al menos uno tiene un valor válido, devuelve false y permite continuar.

    // Validar que al menos un campo de búsqueda tenga valor
    if (Object.values(formData).every((valor) => !valor)) {
      setAlerta({
        message: "Al menos debes enviar un parametro de busqueda",
        error: true,
      });
      return;
    }

    // Construir objeto de búsqueda dinámicamente

    const filtros = { ...formData };

    // Si solo ponen una fecha, enviar como filtro único
    if (!formData.fechaInicio) delete filtros.fechaInicio;
    if (!formData.fechaFin) delete filtros.fechaFin;

    buscarTramites(filtros);
  };

  const { message } = alerta;

  return (
    <>
      <h2 className="font-black text-3xl text-center mt-10">
        Consultas de Trámites
      </h2>
      <p className="text-xl mt-5 mb-4 text-center">
        Búsqueda Avanzada de{" "}
        <span className="text-indigo-600 font-bold">Trámites</span>
      </p>

      <form onSubmit={handleSubmit} className="py-8 px-6 space-y-6">
        {message && <Alerta alerta={alerta} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Número de Trámite */}
          <div>
            <label
              htmlFor="numeroTramite"
              className="block text-gray-700 font-medium mb-1"
            >
              Número de Trámite:
            </label>
            <input
              type="text"
              id="numeroTramite"
              name="numeroTramite"
              value={formData.numeroTramite}
              onChange={handleInputChange}
              placeholder="Número de Trámite"
              className="w-full border-2 rounded-md h-10 p-2 placeholder-gray-400 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Oficio Remitente */}
          <div>
            <label
              htmlFor="oficioRemitente"
              className="block text-gray-700 font-medium mb-1"
            >
              Número de Oficio/Memo:
            </label>
            <input
              type="text"
              id="oficioRemitente"
              name="oficioRemitente"
              value={formData.oficioRemitente}
              onChange={handleInputChange}
              placeholder="Número Oficio/Memo"
              className="w-full border-2 rounded-md h-10 p-2 placeholder-gray-400 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Asunto */}
          <div>
            <label
              htmlFor="asunto"
              className="block text-gray-700 font-medium mb-1"
            >
              Asunto del Trámite:
            </label>
            <input
              type="text"
              id="asunto"
              name="asunto"
              value={formData.asunto}
              onChange={handleInputChange}
              placeholder="Asunto"
              className="w-full border-2 rounded-md h-10 p-2 placeholder-gray-400 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Fecha Documento Inicio*/}
          <div>
            <label
              htmlFor="fechaInicio"
              className="block text-gray-700 font-medium mb-1"
            >
              Fecha Inicio:
            </label>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleInputChange}
              className="w-full border-2 rounded-md h-10 p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Fecha Documento Fin*/}
          <div>
            <label
              htmlFor="fechaFin"
              className="block text-gray-700 font-medium mb-1"
            >
              Fecha Fin:
            </label>
            <input
              type="date"
              id="fechaFin"
              name="fechaFin"
              value={formData.fechaFin}
              onChange={handleInputChange}
              className="w-full border-2 rounded-md h-10 p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Departamento Remitente */}
          <div>
            <label
              htmlFor="departamentoRemitenteId"
              className="block text-gray-700 font-medium mb-1"
            >
              Departamento Remitente:
            </label>
            <select
              id="departamentoRemitenteId"
              name="departamentoRemitenteId"
              value={formData.departamentoRemitenteId}
              onChange={handleDepartamentoChange}
              className="w-full border-2 rounded-md h-10 p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Seleccione un departamento</option>
              {departamentos.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Remitente */}
          <div>
            <label
              htmlFor="remitenteId"
              className="block text-gray-700 font-medium mb-1"
            >
              Remitente:
            </label>
            <select
              id="remitenteId"
              name="remitenteId"
              value={formData.remitenteId}
              onChange={handleInputChange}
              className="w-full border-2 rounded-md h-10 p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Seleccione un remitente</option>
              {remitentes.map((rem) => (
                <option key={rem.id} value={rem.id}>
                  {rem.nombres} {rem.apellidos}
                </option>
              ))}
            </select>
          </div>

          {/* Prioridad */}
          <div>
            <label
              htmlFor="prioridad"
              className="block text-gray-700 font-medium mb-1"
            >
              Prioridad:
            </label>
            <select
              id="prioridad"
              name="prioridad"
              value={formData.prioridad}
              onChange={handleInputChange}
              className="w-full border-2 rounded-md h-10 p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Seleccione una Prioridad</option>
              <option value="NORMAL">NORMAL</option>
              <option value="MEDIA">MEDIA</option>
              <option value="ALTA">ALTA</option>
            </select>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700"
          >
            Buscar Trámites
          </button>
        </div>
      </form>
    </>
  );
};

export default HeaderBusqueda;
