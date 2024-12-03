import { useEffect, useState } from "react"; // useEffect -> para manejar la llamada a la API una vez que el componente se monta. useState -> para manejar el estado de cuentaConfirma, cargando, y alerta.
import { useParams, Link } from "react-router-dom"; // hook para leer los parámetros de la URL
import clienteAxios from "../config/axios.config"; // Importamos axios porque vamos a hacer la petición al Backend
import Alerta from "../components/Alerta.components";

const ConfirmarCuenta = () => {
  const [cuentaConfirma, setCuentaConfirmada] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState({});

  const params = useParams();
  const { token } = params; // Extraer el valor del token desde la URL

  // Función para confirmar la cuenta a través de la API
  const confirmarCuenta = async () => {
    try {
      const url = `/usuarios/confirmar/${token}`;

      const { data } = await clienteAxios.get(url); // Llamada GET para confirmar cuenta

      setCuentaConfirmada(true);

      setAlerta({ message: data.message });
    } catch (error) {
      setAlerta({
        message: error.response.data.message || "Error en el servidor",
        error: true,
      });
    } finally {
      setCargando(false);
    }
  };

  // Ejecutar la confirmación cuando el componente esté listo
  useEffect(() => {
    confirmarCuenta();
  }, [token]);

  return (
    <>
      <div>
        <h1 className="text-indigo-600 font-black text-6xl">
          Confirma tu Cuenta y Comienza a Administrar{" "}
          <span className="text-black">tus Documentos</span>
        </h1>
      </div>
      <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">
        {!cargando && <Alerta alerta={alerta} />}
        {cuentaConfirma && (
          <Link to="/" className="block text-center my-5 text-gray-500">
            Iniciar Sesión
          </Link>
        )}
      </div>
    </>
  );
};

export default ConfirmarCuenta;
