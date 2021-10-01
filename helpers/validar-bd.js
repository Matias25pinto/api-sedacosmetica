const Usuario = require("../models/usuario");
const Banco = require("../models/banco");

const existeEmail = async (email = "") => {
	const usuario = await Usuario.findOne({ email: email });
	if (!usuario) {
		throw new Error(`No existe el email ${email}`);
	}
};

const existeBanco = async (bancoId = "") => {
	const banco = await Banco.findOne({ _id: bancoId });
	if (!banco) {
		throw new Error(`No existe el banco con id: ${bancoId}`);
	}
};

module.exports = { existeEmail, existeBanco };
