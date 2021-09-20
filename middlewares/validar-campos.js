const { request, response } = require("express");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongoose").Types.ObjectId;
const Usuario = require("../models/usuario");

const validarPrecios = async (req = request, res = response, next) => {
	let precios = [];
	let deposito = 5; //por defecto mandamos el id del deposito de la central
	let role = "";
	try {
		let token = req.get("token"); // de esta forma se lee los headers
		if (token) {
			jwt.verify(token, process.env.SEED, async (err, decode) => {
				const id = decode._id;
				const usuario = await Usuario.findById(id);
				if (!err) {
					precios = usuario["precios"];
					role = usuario["role"];
					deposito = usuario["deposito"];
				}
				req.precios = precios;
				req.deposito = deposito;
				req.role = role;
				next();
			});
		} else {
			req.precios = precios;
			req.deposito = deposito;
			req.role = role;
			next();
		}
	} catch (err) {
		req.precios = precios;
		req.deposito = deposito;
		req.role = role;
		next();
	}
};

const validarChecks = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors });
	}
	next();
};

const validarIdMongoose = (req, res, next) => {
	//Verificar si el id es un objeto válido de mongoose

	const { id } = req.params;
	try {
		if (id.length < 12) {
			return res
				.status(400)
				.json({ msg: `El id: ${id}, no es un id válido de mongoose` });
		}
		const idObjeto = new ObjectId(id);
		if (idObjeto != id) {
			return res
				.status(400)
				.json({ msg: `El id: ${id}, no es un id válido de mongoose` });
		}
		next();
	} catch (err) {
		return res
			.status(400)
			.json({ msg: `El id: ${id}, no es un id válido de mongoose` });
	}
};

module.exports = { validarPrecios, validarChecks, validarIdMongoose };
