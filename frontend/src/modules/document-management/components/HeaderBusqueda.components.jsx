import { useState, useEffect } from "react";
import Select from "react-select";
import clienteAxios from "../../../config/axios.config";
import useTramites from "../../../hooks/useTramites.hook";
import Alerta from "../../../components/Alerta.components";
import useAuth from "../../../hooks/useAuth.hook";

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
    estado: "",
    usuarioRevisor: "",
  });

  const [departamentos, setDepartamentos] = useState([]);
  const [revisores, setRevisores] = useState([]);
  const { auth } = useAuth();

  const [remitentes, setRemitentes] = useState([]);

  const { buscarTramites } = useTramites();

  const [alerta, setAlerta] = useState({});

  // Cargar departamentos al montar el componente
  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const { data } = await clienteAxios("/departamentos");
        // setDepartamentos(data);
        setDepartamentos(data.map((d) => ({ value: d.id, label: d.nombre })));
      } catch (error) {
        console.error("Error al cargar departamentos:", error);
      }
    };

    fetchDepartamentos();
  }, []);

  useEffect(() => {
    const fecthRevisores = async () => {
      const rol = ["REVISOR"];
      try {
        if (!auth.departamentoId) {
          console.error("departamentoId no está definido en auth");
          return;
        }
        const { data } = await clienteAxios.get(
          `/usuarios/revisor-departamento/${auth.departamentoId}/${rol}`
        );
        // setRevisores(data);
        setRevisores(
          data.map((r) => ({
            value: r.id,
            label: `${r.nombres} ${r.apellidos} `,
          }))
        );
      } catch (error) {
        console.error("Error al cargar los datos", error);
      }
    };

    fecthRevisores();

    console.log(revisores);
  }, [auth.departamentoId]);

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
      // setRemitentes(data);
      setRemitentes(
        data.map((r) => ({
          value: r.id,
          label: `${r.nombres} ${r.apellidos}`,
        }))
      );
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

  // const handleLimpiarFormulario = () => {
  //   const camposVacios = Object.fromEntries(
  //     Object.keys(formData).map((key) => [key, ""])
  //   );

  //   setFormData(camposVacios);

  //   // Pequeña espera para que setFormData termine antes de ejecutar buscarTramites
  //   setTimeout(() => {
  //     buscarTramites({});
  //   }, 0);
  // };

  const handleLimpiarFormulario = () => {
    setFormData({
      numeroTramite: "",
      oficioRemitente: "",
      asunto: "",
      fechaInicio: "",
      fechaFin: "",
      departamentoRemitenteId: "",
      remitenteId: "",
      prioridad: "",
      tramiteExterno: "",
      estado: "",
      usuarioRevisor: "",
    });

    setRemitentes([]); // Limpia la lista también

    setTimeout(() => {
      buscarTramites({});
    }, 0);
  };

  const { message } = alerta;

  return (
    <>
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
            {/* <select
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
            </select> */}
            <Select
              options={departamentos}
              value={
                departamentos.find(
                  (d) => d.value === formData.departamentoRemitenteId
                ) || null
              }
              onChange={(selected) => {
                // setDepartamentoRemitenteId(selected.value);
                // handleDepartamentoChange({ target: { value: selected.value } });
                const value = selected ? selected.value : "";
                setFormData({ ...formData, departamentoRemitenteId: value });
                handleDepartamentoChange({ target: { value } });
              }}
              placeholder="Selecciona un departamento..."
              isClearable
            />
          </div>

          {/* Remitente */}
          <div>
            <label
              htmlFor="remitenteId"
              className="block text-gray-700 font-medium mb-1"
            >
              Remitente:
            </label>
            {/* <select
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
            </select> */}
            <Select
              options={remitentes}
              value={
                remitentes.find((r) => r.value === formData.remitenteId) || null
              }
              onChange={(selected) => {
                const value = selected ? selected.value : "";
                setFormData({ ...formData, remitenteId: value });
              }}
              placeholder="Selecciona un remitente..."
              isClearable
            />
          </div>

          {/* Revisores */}
          <div>
            <label
              htmlFor="revisor"
              className="block text-gray-700 font-medium mb-1"
            >
              Revisor:
            </label>
            {/* <select
              id="revisor"
              name="revisor"
              value={formData.usuarioRevisor}
              onChange={handleInputChange}
              className="w-full border-2 rounded-md h-10 p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 uppercase"
            >
              <option value="">Seleccione un revisor</option>
              {revisores.map((r) => (
                <option key={r.id} value={r.id}>
                  {`${r.nombres} ${r.apellidos}`}
                </option>
              ))}
              <option value="sin revisor">Sin revisor</option>
            </select> */}
            <Select
              options={revisores}
              value={
                revisores.find((r) => r.value === formData.usuarioRevisor) ||
                null
              }
              onChange={(selected) => {
                const value = selected ? selected.value : "";
                setFormData({ ...formData, usuarioRevisor: value });
              }}
              placeholder="Selecciona un revisor..."
              isClearable
            />
          </div>

          {/* Estado */}
          <div>
            <label
              htmlFor="estado"
              className="block text-gray-700 font-medium mb-1"
            >
              Estado:
            </label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              className="w-full border-2 rounded-md h-10 p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 uppercase"
            >
              <option value="">Seleccione un estado</option>
              <option value="INGRESADO">Ingresado</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="POR_FIRMAR">Por Firmar</option>
              <option value="COMPLETADO">Completado</option>
              <option value="POR_CORREGIR">Por Corregir</option>
              <option value="DESPACHADO">Despachado</option>
              <option value="POR_FINALIZAR">Por Finalizar</option>
              <option value="FINALIZADO">Finalizado</option>
              <option value="RECHAZADO">Rechazado</option>
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
              className="w-full border-2 rounded-md h-10 p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 uppercase"
            >
              <option value="">Seleccione una Prioridad</option>
              <option value="NORMAL">NORMAL</option>
              <option value="MEDIA">MEDIA</option>
              <option value="ALTA">ALTA</option>
            </select>
          </div>
        </div>

        <div className="mt-6 text-right flex justify-end gap-5">
          <button
            type="button"
            onClick={handleLimpiarFormulario}
            className="bg-gray-300 text-gray-700 px-6 py-2 font-bold rounded-md hover:bg-gray-400 transition-colors"
          >
            Limpiar Formulario
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition-colors"
          >
            Buscar Trámites
          </button>
        </div>
      </form>
    </>
  );
};

export default HeaderBusqueda;
