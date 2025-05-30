import { Link, Outlet, useLocation } from "react-router-dom";

const AdminDMS = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Panel de Configuración del Sistema DMS
      </h1>

      <nav className="flex gap-4 border-b pb-2 mb-6">
        <Link
          to="/admin/admin-dms/departamentos"
          className={`text-sm font-semibold px-3 py-2 rounded-md transition ${
            isActive("departamentos")
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Departamentos
        </Link>
        <Link
          to="/admin/admin-dms/empleados"
          className={`text-sm font-semibold px-3 py-2 rounded-md transition ${
            isActive("empleados")
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Empleados
        </Link>
        <Link
          to="/admin/admin-dms/tramites"
          className={`text-sm font-semibold px-3 py-2 rounded-md transition ${
            isActive("tramites")
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Trámites
        </Link>
      </nav>

      <section className="min-h-[200px]">
        <Outlet />
      </section>
    </div>
  );
};

export default AdminDMS;
