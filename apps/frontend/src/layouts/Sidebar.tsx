import type { RootState } from "@/core/store/store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function getIcon(name: string) {
  // simple mapper: map string to react-icon component
  // e.g. 'FileText' -> import { FiFileText } from 'react-icons/fi'
  return <span className="text-xl">📁</span>;
}

export default function Sidebar() {
  const modules = useSelector((s: RootState) => s.auth.modules || []);
  return (
    <aside className="w-64 bg-white shadow p-4">
      <h2 className="text-xl font-bold text-blue-700 mb-4">SELNIC</h2>
      <nav className="flex flex-col gap-2">
        {modules.map((m: any) => (
          <Link
            key={m.id}
            to={m.ruta || m.route || "#"}
            className="flex items-center gap-2 p-2 rounded hover:bg-blue-50"
          >
            {getIcon(m.icono || m.icon)}
            <span>{m.nombre}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
