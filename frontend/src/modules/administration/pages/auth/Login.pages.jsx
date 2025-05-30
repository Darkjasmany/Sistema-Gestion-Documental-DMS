// Para manejar enlaces
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Alerta from "../../../../components/Alerta.components";
import clienteAxios from "../../../../config/axios.config";
import useAuth from "../../../../hooks/useAuth.hook";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [alerta, setAlerta] = useState({});
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const token =
    localStorage.getItem("dms_token") || sessionStorage.getItem("dms_token");

  // ** Redirección automatica
  // Si el usuario esta autenticado y en mi Provider se almaceno la sesión del usuario en auth y si el token está en el localStorage y redirige automáticamente si ya inició sesión:
  useEffect(() => {
    if (auth?.id && token) {
      navigate("/admin");
    }
  }, [auth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([email, password].includes("")) {
      return setAlerta({
        message: "Todos los campos son obligatorios",
        error: true,
      });
    }

    const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
    if (!isEmailValid(email)) {
      return setAlerta({ message: "Correo no válido", error: true });
    }

    // ** Comunicarme con la API
    try {
      const { data } = await clienteAxios.post("/usuarios/login", {
        email,
        password,
      });

      // ** Guardar token según el estado del checkbox "Recuérdame"
      if (remember) {
        localStorage.setItem("dms_token", data.token);
      } else {
        sessionStorage.setItem("dms_token", data.token);
      }

      // Actualizar el contexto de autenticación
      setAuth(data);

      // Redireccionar al usuario
      navigate("/admin");
    } catch (error) {
      const message = error.response?.data?.message;
      setAlerta({ message, error: true });
    }
  };

  const { message } = alerta;

  return (
    <>
      <div>
        <h1 className="text-indigo-600 font-black text-6xl">
          Inicia Sesión y Administra tus{" "}
          <span className="text-black">Documentos</span>
        </h1>
      </div>
      <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">
        {message && <Alerta alerta={alerta} />}

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
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
              placeholder="name@naranjal.gob.ec"
              // required
            />
          </div>

          <div className="my-5">
            <label
              htmlFor="password"
              className="uppercase font-bold text-xl text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
              placeholder="Tu Password"
              // required
            />
          </div>

          <div className="flex items-start mb-5">
            <div className="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50"
                aria-label="Recuérdame"
              />
            </div>
            <label
              htmlFor="remember"
              className="ms-2 text-sm font-medium text-gray-900"
            >
              Recuérdame
            </label>
          </div>

          <input
            type="submit"
            value={"Iniciar Sesión"}
            className="bg-indigo-700 w-full md:w-auto py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-indigo-800"
          />
        </form>

        <nav className="mt-10 lg:flex lg:justify-between">
          <Link
            to="/registrar"
            className="block text-center my-5 text-gray-500"
          >
            ¿No tienes una cuenta? Registrate
          </Link>
          <Link
            to="/olvide-password"
            className="block text-center my-5 text-gray-500"
          >
            Olvide mi password
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Login;
