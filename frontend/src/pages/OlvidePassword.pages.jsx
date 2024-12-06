import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alerta from "../components/Alerta.components";
import clienteAxios from "../config/axios.config";

const OlvidePassword = () => {
  const [email, setEmail] = useState("");
  const [alerta, setAlerta] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (enviado) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2000);
      return () => clearTimeout(timer); // Limpia el timeout
    }
  }, [enviado, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === "" || !/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setAlerta({
        message: "El Email es obligatorio y debe ser válido",
        error: true,
      });
      return;
    }

    setAlerta({});
    setEnviando(true);

    try {
      const { data } = await clienteAxios.post("/usuarios/olvide-password", {
        email,
      });
      setAlerta({ message: data.message });
      setEnviado(true);
      setEmail("");
    } catch (error) {
      setAlerta({
        message: error.response.data.message,
        error: true,
      });
    } finally {
      setEnviando(false);
    }
  };

  // if (enviado) {
  //   setTimeout(() => {
  //     navigate("/");
  //   }, 2000);
  // }
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
