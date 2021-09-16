const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");
let verificarAdminRole = (req, res, next) => {
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

module.exports = { verificarToken, verificarAdminRole };
