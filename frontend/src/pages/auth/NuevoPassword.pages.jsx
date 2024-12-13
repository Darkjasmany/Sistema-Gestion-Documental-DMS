import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Alerta from "../../components/Alerta.components";
import clienteAxios from "../../config/axios.config";

const NuevoPassword = () => {
  const [password, setPassword] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");
  const [alerta, setAlerta] = useState({});
  const [tokenValido, setTokenValido] = useState(false);
  const [passwordModificado, setPasswordModificado] = useState(false);

  const params = useParams();
  const { token } = params;
  const navigate = useNavigate();

  const validarToken = async () => {
    if (!token) {
      setTokenValido(false);
      setAlerta({ message: "Token inválido o inexistente", error: true });
      return;
    }
    try {
      await clienteAxios(`/usuarios/olvide-password/${token}`);
      setTokenValido(true);
      setAlerta({ message: "Coloca tu nuevo Password" });
    } catch (error) {
      const message =
        error.response?.data?.message || "Error al validar el token.";
      setAlerta({ message, error: true });
      setTokenValido(false);
    }
  };

  // Ejecuta solo una vez cuando carga el componente o cambia el token.
  useEffect(() => {
    validarToken();
  }, [token]);

  // Si el token no es valido, redirige
  useEffect(() => {
    if (!tokenValido) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [tokenValido, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([password, repetirPassword].includes("")) {
      return setAlerta({
        message: "Todos los campos son obligatorios",
        error: true,
      });
    }

    if (password.length < 6) {
      return setAlerta({
        message: "El Password debe tener al menos 6 caracteres",
        error: true,
      });
    }

    if (password !== repetirPassword) {
      return setAlerta({
        message: "Los Password deben ser iguales",
        error: true,
      });
    }

    setAlerta({});

    try {
      const url = `/usuarios/olvide-password/${token}`;
      const { data } = await clienteAxios.post(url, { password });
      setAlerta({ message: data.message });
      setPasswordModificado(true);

      setPassword("");
      setRepetirPassword("");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      const message =
        error.response?.data?.message || "Error al cambiar el password.";
      setAlerta({ message, error: true });
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

        {/* //**Si el token es valido && no ha sido modificado el Password muestra el formulario */}
        {tokenValido && !passwordModificado ? (
          <form action="" onSubmit={handleSubmit}>
            <div className="my-5">
              <label
                htmlFor="password"
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
        ) : (
          passwordModificado && (
            <p className="text-center text-green-600 font-bold">
              Password cambiado correctamente. Redirigiendo...
            </p>
          )
        )}
      </div>
    </>
  );
};

export default NuevoPassword;
