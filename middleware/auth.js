const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  //Leer el token de header
  const token = req.header("x-auth-token");

  //si no hay tocken
  if (!token) {
    return res.status(401).json({ msg: "No hay token , permiso no válido" });
  }

  //validar token
  try {
    const cifrado = jwt.verify(token, process.env.SECRETA);
    req.usuario = cifrado.usuario;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token no es válido" });
  }
};
