/*import Usuario from "../models/Usuario.js";

const registrar = async (req, res) => {
  // TODO leer datos de un formulario req.body
  // console.log(req.body); // Cuando se envian datos accedemos a ellos con req.body
  const { nombres, apellidos, email, password } = req.body;

  // TODO: Prevenir usuarios duplicados

  // TODO: Guardar Nuevo Veterinario
  try {
    const usuario = new Usuario.build(req.body);

    res.json(usuarioGuardado);
  } catch (error) {
    console.error(`Error al registrar el Usuario: ${error}`);
  }

  res.json({
    msg: "Registrando usuario ...",
  });
};

const perfil = (req, res) => {
  res.json({ msg: "Mostrando Perfil ..." });
};

export { registrar, perfil };
*/
