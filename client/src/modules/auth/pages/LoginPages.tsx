// Para manejar enlaces
// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// import Alerta from "../../../components/Alerta.components";
// import clienteAxios from "../../../../config/axios.config";
// import useAuth from "../../../hooks/useAuth.hook";

const LoginPages = () => {
  /*
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
*/
  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-400 drop-shadow-[0_0_6px_rgba(99,102,241,0.8)]">
        Inicia Sesión
      </h1>
      <form action="" className=" space-y-5" noValidate>
        <div>
          <label htmlFor="email" className="block text-sm text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="name@naranjal.gob.ec"
            className="w-full p-3 rounded-md bg-black/30 text-white border border-white/20 placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm text-gray-300 mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-3 rounded-md bg-black/30 text-white border border-white/20 placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          />
        </div>
        <div className="flex items-center justify-between text-sm text-gray-400">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="w-4 h-4 text-indigo-500 border-gray-600 bg-transparent rounded focus:ring-indigo-500"
            />
            <span>Recuérdame</span>
          </label>
          <Link
            to="/olvide-password"
            className="hover:text-indigo-400 transition"
          >
            ¿Olvidaste tu password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-md shadow-lg shadow-indigo-500/20 transition-all"
        >
          INICIAR SESIÓN
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        ¿No tienes una cuenta?{" "}
        <Link to="/registrar" className="text-indigo-400 hover:underline">
          Regístrate
        </Link>
      </p>
    </>
  );
};

export default LoginPages;
