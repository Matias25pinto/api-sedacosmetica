const jwt = require("jsonwebtoken");
//Verificar el token
let verificaToken = (req, res, next) => {
  let token = req.get("token"); // de esta forma se lee los headers

  jwt.verify(token, "secret", (err, decode) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        message: "Error de Token",
        err,
      });
    }
    req.usuario = decode.usuarioBD; // guardamos el usuario que realiza el cambio para poder verificar su rol
    next();
  });
};

let verificaRol = (req, res, next) => {
  let usuario = req.usuario;
  if (usuario.role == "ADMIN_ROLE") {
    next();
    return;
  }
  res.status(500).json({
    ok: false,
    message: "El usuario necesita permiso de administrador",
  });
};

module.exports = {
  verificaToken,
  verificaRol,
};
