const Usuario = require("../models/usuario");

const existeEmail = async (email = "") => {
	const usuario = await Usuario.findOne({ email: email });
	if (!usuario) {
		throw new Error(`No existe el email ${email}`);
	}
};

module.exports = {existeEmail};
