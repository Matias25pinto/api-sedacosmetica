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
				try {
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
				} catch {
					req.precios = precios;
					req.deposito = deposito;
					req.role = role;
					next();
				}
			});
		} else {
			req.precios = precios;
			req.deposito = deposito;
			req.role = role;
			next();
		}
	} catch (err) {
		console.log(err);
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

const validarObjetivo = (req, res, next) => {
	//Verificar si el id es un objeto válido de mongoose

	const { sucursal, mes, year } = req.query;
	try {
		if (sucursal.length < 12 || !sucursal) {
			return res
				.status(400)
				.json({ msg: `El id: ${sucursal}, no es un id válido de mongoose` });
		}
		const idObjeto = new ObjectId(sucursal);
		if (idObjeto != sucursal) {
			return res
				.status(400)
				.json({ msg: `El id: ${sucursal}, no es un id válido de mongoose` });
		}
		if (parseInt(mes) > 12 || parseInt(mes) < 1 || !mes) {
			return res
				.status(400)
				.json({ msg: `El mes: ${mes}, no es un mes válido` });
		}
		if (year.length != 4 || !year) {
			return res
				.status(400)
				.json({ msg: `El año: ${year}, no es un año válido` });
		}

		next();
	} catch (err) {
		return res
			.status(400)
			.json({ msg: `ERROR!!! ingrese una sucursal, mes, year válido` });
	}
};

module.exports = { validarPrecios, validarChecks, validarIdMongoose, validarObjetivo };
