import { useState, useEffect } from "react";
// import AdminNav from "../../components/AdminNav.components";
import Alerta from "../../../../components/Alerta.components";
import useAuth from "../../../../hooks/useAuth.hook";
const CambiarPassword = () => {
  const { guardarPassword } = useAuth();

  const [password, setPassword] = useState({
    pwd_actual: "",
    pwd_nuevo: "",
    pwd_repetir: "",
  });

  const [alerta, setAlerta] = useState({
    pwd_actual: "",
    pwd_nuevo: "",
    pwd_repetir: "",
  });

  // ** UseEffect para Alerta
  useEffect(() => {
    if (alerta.message) {
      const timer = setTimeout(() => setAlerta({}), 3000); // Limpia la alerta después de 3s
      return () => clearTimeout(timer);
    }
  }, [alerta]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si en sus propiedades tienen un campo vacio al menos 1
    // if (Object.values(password).some((campo) => campo === "")) {
    if (Object.values(password).some((campo) => campo.trim() === "")) {
      return setAlerta({
        message: "Todos los campos son obligatorios",
        error: true,
      });
    }

    if (password.pwd_nuevo.length < 6) {
      return setAlerta({
        message: "El Password debe tener mínimo 6 caracteres",
        error: true,
      });
    }

    if (password.pwd_nuevo === password.pwd_actual) {
      return setAlerta({
        message: "El Password Nuevo no puede ser igual al Password Actual",
        error: true,
      });
    }

    if (password.pwd_nuevo !== password.pwd_repetir) {
      return setAlerta({
        message: "El Password Nuevo no es igual al Password que repetiste",
        error: true,
      });
    }

    const respuesta = await guardarPassword(password);

    setAlerta(respuesta);

    // Limpiar los campos
    setPassword({
      pwd_actual: "",
      pwd_nuevo: "",
      pwd_repetir: "",
    });
  };

  const { message } = alerta;

  return (
    <>
      {/* Quito la barra de navegación de la página de cambio de password */}
      {/* <AdminNav /> */}
      <h2 className="font-black text-3xl text-center mt-10">
        Cambiar Password
      </h2>
      <p className="text-xl mt-5 mb-10 text-center">
        Modifica tu{" "}
        <span className="text-indigo-600 font-bold">Password aqui</span>
      </p>

      <div className="flex justify-center">
        <div className="w-full md:w-1/2 bg-white shadow rounded-lg p-5">
          <form action="" onSubmit={handleSubmit}>
            {message && <Alerta alerta={alerta} />}

            <div className="my-3">
              <label htmlFor="" className="uppercase font-bold text-gray-600  ">
                Password Actual
              </label>
              <input
                type="password"
                className="border-2 border-indigo-500 bg-indigo-50 w-full p-2 mt-5 rounded-lg focus:outline-none focus:border-indigo-700"
                name="pwd_actual"
                placeholder="Escribe tu password actual"
                value={password.pwd_actual || ""}
                onChange={(e) => {
                  setPassword({
                    ...password,
                    [e.target.name]: e.target.value,
                  });
                }}
              />
            </div>

            <div className="my-3">
              <label htmlFor="" className="uppercase font-bold text-gray-600  ">
                Nuevo Password
              </label>
              <input
                type="password"
                className="border-2 border-indigo-500 bg-indigo-50 w-full p-2 mt-5 rounded-lg focus:outline-none focus:border-indigo-700"
                name="pwd_nuevo"
                placeholder="Ingresa tu nuevo password"
                value={password.pwd_nuevo || ""}
                onChange={(e) => {
                  setPassword({
                    ...password,
                    [e.target.name]: e.target.value,
                  });
                }}
              />
            </div>

            <div className="my-3">
              <label htmlFor="" className="uppercase font-bold text-gray-600  ">
                Repite tu Nuevo Password
              </label>
              <input
                type="password"
                className="border-2 border-indigo-500 bg-indigo-50 w-full p-2 mt-5 rounded-lg focus:outline-none focus:border-indigo-700"
                name="pwd_repetir"
                placeholder="Repite tu password nuevo"
                value={password.pwd_repetir || ""}
                onChange={(e) => {
                  setPassword({
                    ...password,
                    [e.target.name]: e.target.value,
                  });
                }}
              />
            </div>

            <input
              type="submit"
              value={"Actualizar Password"}
              className="bg-indigo-700 px-10 py-3 font-bold text-white rounded-lg uppercase w-full mt-5 cursor-pointer hover:bg-indigo-800"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default CambiarPassword;
