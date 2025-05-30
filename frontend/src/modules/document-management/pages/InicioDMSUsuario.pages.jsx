import useAuth from "../../../hooks/useAuth.hook";

const InicioDMSUsuario = () => {
  const { auth } = useAuth();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-blue-800 ">
        {auth?.nombre
          ? `Hola, ${auth.nombre}`
          : "Bienvenido al  Sistema de Gestión Documental - DMS"}
      </h2>
      <p className="text-gray-600">
        Has iniciado sesión como{" "}
        <strong>
          {auth?.nombres + " " + auth?.apellidos + " - " + auth?.rol}
        </strong>
        . Utiliza el menú superior para acceder a tus funciones.
      </p>

      {auth?.rol === "usuario" && (
        <p className="mt-2 text-gray-500 text-sm italic">
          * Puedes ingresar trámites, consultar su estado y ver tu perfil.
        </p>
      )}
      {auth?.rol === "coordinador" && (
        <p className="mt-2 text-gray-500 text-sm italic">
          * Como coordinador, puedes gestionar, asignar y completar trámites.
        </p>
      )}
    </div>
  );
};

export default InicioDMSUsuario;
