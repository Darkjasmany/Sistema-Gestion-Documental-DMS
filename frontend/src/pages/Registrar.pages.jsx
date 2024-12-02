import { useState } from "react";
import { Link } from "react-router-dom";
import Alerta from "../components/Alerta.components";
import axios from "axios";

const Registrar = () => {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");

  const [alerta, setAlerta] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([nombres, apellidos, email, password, repetirPassword].includes("")) {
      setAlerta({ message: "Hay campos vacios", error: true });
      return;
    }

    if (password !== repetirPassword) {
      setAlerta({
        message: "Los Password ingresados no son iguales",
        error: true,
      });
      return;
    }

    if (password.length < 6) {
      setAlerta({
        message: "El Password debe tener al menos 6 caracteres",
        error: true,
      });
      return;
    }

    setAlerta({});

    // ** Crear el usuario con la API
    try {
      const url = "http://localhost:3000/api/usuarios";
      const respuesta = await axios.post(url, {
        nombres,
        apellidos,
        email,
        password,
      });
      console.log(respuesta);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Para eliminar la alerta
  const { message } = alerta;

  return (
    <>
      <div>
        <h1 className="text-indigo-600 font-black text-6xl">
          Crea tu Cuenta y Administra tus{" "}
          <span className="text-black"> Documentos</span>
        </h1>
      </div>
      <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">
        {/* De forma condicional si el message hay algo muestra la alerta */}
        {message && <Alerta alerta={alerta} />}

        <form action="" onSubmit={handleSubmit}>
          <div className="my-5">
            <label
              htmlFor="text"
              className="uppercase font-bold text-xl text-gray-600"
            >
              Nombres
            </label>
            <input
              type="text"
              id="nombres"
              value={nombres}
              // Guardar lo que el usuario Escribe
              onChange={(e) => setNombres(e.target.value)}
              className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
              placeholder="Tu Nombre"
              required
            />
          </div>

          <div className="my-5">
            <label
              htmlFor="text"
              className="uppercase font-bold text-xl text-gray-600"
            >
              Apellidos
            </label>
            <input
              type="text"
              id="apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
              placeholder="Tu Apellido"
              required
            />
          </div>

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
              placeholder="name@naranjal.gob.ec"
              required
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
            value={"Crear Cuenta"}
            className="bg-indigo-700 w-full md:w-auto py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-indigo-800"
          />
        </form>

        <nav className="mt-10 lg:flex lg:justify-between">
          <Link to="/" className="block text-center my-5 text-gray-500">
            ¿Ya tienes una cuenta? Inicia Sesión
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

export default Registrar;
