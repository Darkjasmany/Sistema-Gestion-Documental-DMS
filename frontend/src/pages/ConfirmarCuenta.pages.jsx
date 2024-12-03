import { useEffect, useState } from "react"; // Para que ejecute un codigo una vez que el componente este listo
import { useParams } from "react-router-dom"; //hook para leer los parametros de la URL
import axios from "axios"; // Importamos axios porque vamos hacer la peticion al Backend
import Alerta from "../components/Alerta.components";

const ConfirmarCuenta = () => {
  const [cuentaConfirma, setCuentaConfirmada] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState({});

  const params = useParams();
  const { token } = params; // extraigo el valor

  // Ejecutar este codigo cuando este listo el componente
  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `http://localhost:3000/api/usuarios/confirmar/${token}`;
        const { data } = await axios(url); // data Siempre es la respuesta que nos va a dar Axios axios.get(url) es por defecto
        setCuentaConfirmada(true);
        setAlerta({
          message: data.message, // Acceder a los datos del Backend para los errores
        });
      } catch (error) {
        setAlerta({
          message: error.response.data.message, // Acceder a los datos del Backend para los errores
          error: true,
        });
      }

      setCargando(false);
    };

    confirmarCuenta();
  }, []);

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
      </div>
    </>
  );
};

export default ConfirmarCuenta;
