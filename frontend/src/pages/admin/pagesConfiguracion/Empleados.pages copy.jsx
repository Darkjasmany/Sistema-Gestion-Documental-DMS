const Empleados = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Gestión de Empleados
      </h2>
      <p className="text-gray-600">
        Aquí podrás registrar, editar o eliminar los empleados del sistema. En
        futuras versiones también podrás asignar roles o departamentos.
      </p>

      {/* BONUS: Aquí podrías poner una tabla o formulario en el futuro */}
      <div className="mt-6 text-sm text-gray-500 italic">
        (Módulo en desarrollo - próximamente funcionalidades disponibles)
      </div>
    </div>
  );
};

export default Empleados;
