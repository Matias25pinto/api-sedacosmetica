const Usuario = require("../models/usuario");
const Banco = require("../models/banco");
const Sucursal = require("../models/sucursal");

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

const existeRole = async (role = "") => {
	const roles = ["ADMIN_ROLE", "USER_ROLE", "CLIENT_ROLE", "CAJERO_ROLE"];
	const existe = roles.includes(role);
	if (!existe) {
		throw new Error(`No existe el rol ${role}`);
	}
};
const existeSucursal = async (idSucursal = "") => {
	const sucursal = await Sucursal.findById(idSucursal);

	if (!sucursal && idSucursal != "") {
		throw new Error(`No existe la sucursal con id: ${idSucursal}`);
	}
};


module.exports = { existeEmail, existeBanco, existeRole, existeSucursal};
