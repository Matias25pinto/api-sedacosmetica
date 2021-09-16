const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");
//Verificar el token
let verificarToken = (req, res, next) => {
	try {
		let token = req.get("token"); // de esta forma se lee los headers

		jwt.verify(token, process.env.SEED, async (err, decode) => {
			if (err) {
				return res.status(401).json({
					ok: false,
					message: "Error de Token",
					err,
				});
			}
			const id = decode._id;
			const usuario = await Usuario.findById(id);
			req.usuario = usuario; // guardamos el usuario que realiza el cambio para poder verificar su rol
			next();
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};



let verificarAdminRol = (req, res, next) => {
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
  verificarToken,
  verificarAdminRol,
};
