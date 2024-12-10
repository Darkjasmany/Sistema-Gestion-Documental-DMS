import "./Spinner.components.css"; // Archivo de estilos

const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>Cargando...</p>
    </div>
  );
};

export default Spinner;
