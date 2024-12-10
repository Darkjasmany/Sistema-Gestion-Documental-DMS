import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alerta from "../../components/Alerta.components";
import clienteAxios from "../../config/axios.config";

const OlvidePassword = () => {
  const [email, setEmail] = useState("");
  const [alerta, setAlerta] = useState({});
  const [enviado, setEnviado] = useState(false); // Indica si el formulario fue enviado con éxito.
  const [enviando, setEnviando] = useState(false); // Indica si se está procesando la solicitud para deshabilitar el botón de envío.

  const navigate = useNavigate(); // Permite redirigir a otras rutas de la aplicación.

  // ** Redirigir Automáticamente
  // useEffect: Se ejecuta cada vez que cambia el valor de enviado.
  useEffect(() => {
    if (enviado) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2000);
      return () => clearTimeout(timer); // Limpia el temporizador para evitar fugas de memoria (clearTimeout).
    }
  }, [enviado, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === "" || !/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return setAlerta({
        message: "El Email es obligatorio y debe ser válido",
        error: true,
      });
    }

    setAlerta({}); // Limpia cualquier alerta anterior.
    setEnviando(true); // Indica que la solicitud está en proceso.

    try {
      // Envía el email al backend.
      const { data } = await clienteAxios.post("/usuarios/olvide-password", {
        email,
      });
      setAlerta({ message: data.message }); // Muestra el mensaje del backend.
      setEnviado(true); // Marca el formulario como enviado con éxito.
      setEmail(""); // Limpia el campo de email.
    } catch (error) {
      const message =
        error.response?.data?.message || "Ocurrió un error. Intenta de nuevo.";
      setAlerta({
        message,
        error: true,
      });
    } finally {
      setEnviando(false); // Restablece el estado del botón.
    }
  };

  const { message } = alerta;

  return (
    <>
      <div>
        <h1 className="text-indigo-600 font-black text-6xl">
          Recupera tu Acceso y no Pierdas tus{" "}
          <span className="text-black"> Documentos</span>
        </h1>
      </div>
      <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">
        {message && <Alerta alerta={alerta} />}
        {!enviado && (
          <>
            <form action="" onSubmit={handleSubmit}>
              <div className="my-5">
                <label
                  htmlFor="email"
                  className="uppercase font-bold text-xl text-gray-600"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                  placeholder="tu-email@ejemplo.com"
                  // required
                />
              </div>

              <input
                type="submit"
                value={enviando ? "Enviando..." : "Enviar Instrucciones"}
                className={`bg-indigo-700 w-full md:w-auto py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer ${
                  enviando
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-indigo-800"
                }`}
                disabled={enviando}
              />
            </form>

            <nav className="mt-10 lg:flex lg:justify-between">
              <Link to="/" className="block text-center my-5 text-gray-500">
                ¿Ya tienes una cuenta? Inicia Sesión
              </Link>
              <Link
                to="/registrar"
                className="block text-center my-5 text-gray-500"
              >
                ¿No tienes una cuenta? Registrate
              </Link>
            </nav>
          </>
        )}
      </div>
    </>
  );
};

export default OlvidePassword;
