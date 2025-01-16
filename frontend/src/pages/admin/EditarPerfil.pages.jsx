import { useEffect, useState } from "react";
import AdminNav from "../../components/AdminNav.components";
import useAuth from "../../hooks/useAuth.hook";
import Alerta from "../../components/Alerta.components";

const EditarPerfil = () => {
  const { auth, setAuth, actualizarPerfil } = useAuth();

  const [perfil, setPerfil] = useState({});
  const [alerta, setAlerta] = useState({});

  useEffect(() => {
    setPerfil(auth);
  }, [auth]);

  // ** UseEffect para Alerta
  useEffect(() => {
    if (alerta.message) {
      const timer = setTimeout(() => setAlerta({}), 3000); // Limpia la alerta después de 3s
      return () => clearTimeout(timer);
    }
  }, [alerta]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(perfil);

    const { nombres, apellidos, email } = perfil;

    if ([nombres, apellidos, email].includes("")) {
      setAlerta({
        message: "Nombres y Apellidos son obligatorios",
        error: true,
      });
      return;
    }

    const resultado = await actualizarPerfil(perfil);

    setAlerta(resultado);
  };

  const { message } = alerta;
  return (
    <>
      <AdminNav />
      <h2 className="font-black text-3xl text-center mt-10">Editar Perfil</h2>
      <p className="text-xl mt-5 mb-10 text-center">
        Modifica tu{" "}
        <span className="text-indigo-600 font-bold">Información aqui</span>
      </p>

      <div className="flex justify-center">
        <div className="w-full md:w-1/2 bg-white shadow rounded-lg p-5">
          <form action="" onSubmit={handleSubmit}>
            {message && <Alerta alerta={alerta} />}

            <div className="my-3">
              <label htmlFor="" className="uppercase font-bold text-gray-600">
                Nombres
              </label>
              <input
                type="text"
                className="border bg-gray-50 w-full p-2 mt-5 rounded-lg"
                name="nombres"
                value={perfil.nombres || ""}
                onChange={(e) =>
                  setPerfil({ ...perfil, [e.target.name]: e.target.value })
                }
              />
            </div>

            <div className="my-3">
              <label htmlFor="" className="uppercase font-bold text-gray-600">
                Apellidos
              </label>
              <input
                type="text"
                className="border bg-gray-50 w-full p-2 mt-5 rounded-lg"
                name="apellidos"
                value={perfil.apellidos || ""}
                onChange={(e) =>
                  setPerfil({ ...perfil, [e.target.name]: e.target.value })
                }
              />
            </div>

            <div className="my-3">
              <label htmlFor="" className="uppercase font-bold text-gray-600">
                Email
              </label>
              <input
                disabled
                type="email"
                className="border bg-gray-50 w-full p-2 mt-5 rounded-lg"
                name="email"
                value={perfil.email || ""}
                // onChange={(e) =>
                //   setPerfil({ ...perfil, [e.target.name]: e.target.value })
                // }
              />
            </div>

            <div className="my-3">
              <label htmlFor="" className="uppercase font-bold text-gray-600">
                Rol
              </label>
              <input
                disabled
                type="text"
                className="border bg-gray-50 w-full p-2 mt-5 rounded-lg"
                name="rol"
                value={perfil.rol || ""}
              />
            </div>

            <div className="my-3">
              <label htmlFor="" className="uppercase font-bold text-gray-600">
                Departamento
              </label>
              <input
                disabled
                type="text"
                className="border bg-gray-50 w-full p-2 mt-5 rounded-lg"
                name="departamento"
                value={perfil.departamento ? perfil.departamento.nombre : ""}
              />
            </div>

            <input
              type="submit"
              value={"Guardar Cambios"}
              className="bg-indigo-600 px-10 py-3 mt-5 font-bold text-white rounded-lg uppercase w-full hover:bg-indigo-800
              cursor-pointer
              transition-colors"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default EditarPerfil;
