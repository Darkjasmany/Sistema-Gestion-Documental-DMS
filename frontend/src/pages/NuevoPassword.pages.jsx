import { useEffect, useState } from "react";
import Alerta from "../components/Alerta.components";
import clienteAxios from "../config/axios.config";
import { useParams } from "react-router-dom";

const NuevoPassword = () => {
  const [password, setPassword] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");
  const [alerta, setAlerta] = useState({});
  const [tokenValido, setTokenValido] = useState(false);

  const params = useParams();
  const { token } = params;

  const validarToken = async () => {
    if (!token) {
      setAlerta({ message: "Token inválido o inexistente", error: true });
      return;
    }
    try {
      await clienteAxios(`/usuarios/olvide-password/${token}`);
      setAlerta({ message: "Coloca tu nuevo Password" });
      setTokenValido(true);
    } catch (error) {
      setAlerta({ message: error.response.data.message, error: true });
    }
  };

  // Va a ejecutarse cuando el componente cargue y decimos que se ejecute 1 sola vez []
  useEffect(() => {
    validarToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([password, repetirPassword].includes("")) {
      setAlerta({ message: "Todos los campos son obligatorios", error: true });
      return;
    }

    if (password.length < 6) {
      setAlerta({
        message: "El Password debe tener al menos 6 caracteres",
        error: true,
      });
      return;
    }

    if (password !== repetirPassword) {
      setAlerta({
        message: "Los Password deben ser iguales",
        error: true,
      });
      return;
    }

    setAlerta({});

    try {
      const { data } = await clienteAxios.post(
        `/usuarios/olvide-password/${token}`
      );
      setAlerta({ message: data.message });
    } catch (error) {
      setAlerta({ message: error.response.data.message, error: true });
    }
  };

  const { message } = alerta;

  return (
    <>
      <div>
        <h1 className="text-indigo-600 font-black text-6xl">
          Restable tu password no Pierdas Acceso a{" "}
          <span className="text-black">tus Documentos</span>
        </h1>
      </div>
      <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">
        {message && <Alerta alerta={alerta} />}

        {/* //**Si el token es valido muestra el formulario */}
        {tokenValido && (
          <form action="" onSubmit={handleSubmit}>
            <div className="my-5">
              <label
                htmlFor="text"
                className="uppercase font-bold text-xl text-gray-600"
              >
                Ingresa tu nuevo Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                placeholder="Tu Password"
                required
              />
            </div>

            <div className="my-5">
              <label
                htmlFor="password2"
                className="uppercase font-bold text-xl text-gray-600"
              >
                Repitir Password
              </label>
              <input
                type="password"
                id="password2"
                value={repetirPassword}
                onChange={(e) => setRepetirPassword(e.target.value)}
                className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                placeholder="Repite tu Password"
                required
              />
            </div>

            <input
              type="submit"
              value={"Restablecer Password"}
              className="bg-indigo-700 w-full md:w-auto py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-indigo-800"
            />
          </form>
        )}
      </div>
    </>
  );
};

export default NuevoPassword;
