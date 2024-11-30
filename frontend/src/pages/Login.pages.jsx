// Para manejar enlaces
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <div>
        <h1 className="text-indigo-600 font-black text-6xl">
          Inicia Sesión y Administra tus{" "}
          <span className="text-black">Documentos</span>
        </h1>
      </div>
      <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">
        <form action="">
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
              className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
              placeholder="Tu Password"
              required
            />
          </div>
          <div className="flex items-start mb-5">
            <div className="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                value={""}
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
              />
            </div>

            <label
              htmlFor="remember"
              className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-400"
            >
              Recuerdame
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
