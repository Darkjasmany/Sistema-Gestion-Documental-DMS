import { ParametroSistema } from "../models/SystemParameter.model.js";

// Objeto que almacenará los parámetros de configuración
export const config = {};

// Función para cargar los parametros
export const cargarParametros = async () => {
  try {
    const parametros = await ParametroSistema.findAll();

    // Transforma cada registro en una propiedad del objeto `config` con su clave y valor
    parametros.forEach((parametro) => {
      config[parametro.clave] = parametro.valor;
    });
    console.log("Parametros cargados correctamente", config);
  } catch (error) {
    console.log("Error al cargar los parametros:", error);
  }
};
