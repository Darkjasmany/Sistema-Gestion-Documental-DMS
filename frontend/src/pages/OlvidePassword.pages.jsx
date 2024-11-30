import { Link } from "react-router-dom";
const OlvidePassword = () => {
  return (
    <>
      <div>
        <h1 className="text-indigo-600 font-black text-6xl">
          Recupera tu Acceso y no Pierdas tus{" "}
          <span className="text-black"> Documentos</span>
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

          <input
            type="submit"
            value={"Enviar Instrucciones"}
            className="bg-indigo-700 w-full md:w-auto py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-indigo-800"
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
      </div>
    </>
  );
};

export default OlvidePassword;
