const Departamentos = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Gestión de Departamentos
      </h2>
      <p className="text-gray-600">
        Desde esta sección podrás administrar los departamentos del sistema,
        asignar un coordinador por área y visualizar su información.
      </p>

      {/* BONUS: Aquí podrías poner una tabla o formulario en el futuro */}
      <div className="mt-6 text-sm text-gray-500 italic">
        (Módulo en desarrollo - próximamente funcionalidades disponibles)
      </div>
    </div>
  );
};

export default Departamentos;
