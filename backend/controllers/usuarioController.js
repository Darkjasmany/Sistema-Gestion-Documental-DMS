import Usuario from "../models/Usuario.js";

const registrar = async (req, res) => {
  // TODO leer datos de un formulario req.body
  // console.log(req.body); // Cuando se envian datos accedemos a ellos con req.body
  const { nombres, apellidos, email, password } = req.body;

  // TODO: Prevenir usuarios duplicados

  // TODO: Guardar Nuevo Veterinario
  try {
    // Crear una instancia del modelo Usuario (sin guardar aún en la BD)
    const usuario = Usuario.build({
      nombres,
      apellidos,
      email,
      password, // Asegúrate de hashear la contraseña antes de guardar
    });
    // Guardar el usuario en la base de datos
    const usuarioGuardado = await usuario.save();

    res.json(usuarioGuardado);
    // res.json({
    //   msg: "Registrando usuario ...",
    // });
  } catch (error) {
    console.error(`Error al registrar el Usuario: ${error}`);
  }
};

const perfil = (req, res) => {
  res.json({ msg: "Mostrando Perfil ..." });
};

export { registrar, perfil };
