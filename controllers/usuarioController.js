const Usuario = require("../models/Usuario");
const bcrypjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
exports.crearUsuario = async (req, res) => {
  //revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //extraer emial y password
  const { email, password } = req.body;
  try {
    //revisar que el usuario registrado sea unico
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }
    //crear el nuevo usuario
    usuario = new Usuario(req.body);
    //hashear el password
    const salt = await bcrypjs.genSalt(10);
    usuario.password = await bcrypjs.hash(password, salt);
    // guarda el usuario
    await usuario.save();
    //crear y firmar JWT
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };
    //firmar el jwt
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600,
      },
      (error, token) => {
        if (error) throw error;
        res.json({ token });
      }
    );
    //Mensaje de confirmacion
  } catch (error) {
    console.log(error);
    res.status(400).send("HUBO UN ERROR");
  }
};
