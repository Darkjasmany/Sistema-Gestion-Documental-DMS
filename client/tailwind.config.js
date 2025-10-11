import { defineConfig } from "tailwindcss";

// Tailwind config para SelNic: define la paleta global y rutas de contenido
export default defineConfig({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      colors: {
        base: {
          dark: "#0f172a",
          mid: "#1e293b",
          border: "#334155",
        },
        accent: {
          sky: "#38bdf8",
          cyan: "#7dd3fc",
        },
      },
    },
  },
  plugins: [],
});

{
  /* <div className="bg-base-dark text-accent-cyan border border-base-border p-4 rounded-md">
  Bienvenido a SelNic
</div>; */
}
