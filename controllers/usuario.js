const { request, response } = require("express");

const bcrypt = require("bcrypt"); // Importamos bcrypt para poder comparar dos password encriptados

const jwt = require("jsonwebtoken"); // Importamos jwt para poder crear Json Web Tokens

const Usuario = require("../models/usuario");

const login = async (req = request, res = response) => {
	try {
		let { email, password } = req.body;

		let usuario = await Usuario.findOne({ email: email });

		if (!bcrypt.compareSync(password, usuario.password)) {
			return res.status(400).json({
				msg: "Usuario o Contraseña incorrecta",
			});
		}
		let token = jwt.sign(
			{
				_id: usuario._id,
			},
			process.env.SEED,
			{ expiresIn: "12h" }
		);
		res.json({ token });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};

const getUsuarios = async (req = request, res = response) => {
	try {
		let usuarios = await Usuario.find({ estado: true }).populate(
			"sucursal",
			"titulo"
		);
		res.json(usuarios);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};

const getUsuario = async (req = request, res = response) => {
	try {
		const { id } = req.params;

		const usuario = await Usuario.findById(id);
		if (!usuario) {
			return res
				.status(400)
				.json({ msg: `No existe usuario con el id: ${id}` });
		}
		return res.json(usuario);
	} catch (err) {
		console.log("ERROR!!!", err);
		return res.status(500).json({ err });
	}
};

const crearUsuario = async (req = request, res = response) => {
	try {
		const {
			nombre,
			apellido,
			cedula,
			celular,
			email,
			role,
			sucursal,
			precios,
			deposito,
		} = req.body;
		let password = bcrypt.hashSync(req.body.password, 10);
		const usuario = new Usuario({
			nombre,
			apellido,
			cedula,
			celular,
			email,
			password,
			role,
			sucursal,
			precios,
			deposito,
		});

		await usuario.save();

		res.json(usuario);
	} catch (err) {
		console.log("ERROR!!!", err);
		return res.status(500).json({ err });
	}
};

const modificarUsuario = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		const {
			nombre,
			apellido,
			cedula,
			celular,
			email,
			role,
			sucursal,
			precios,
			deposito,
		} = req.body;

		const usuario = await Usuario.findByIdAndUpdate(
			id,
			{
				nombre,
				apellido,
				cedula,
				celular,
				email,
				role,
				sucursal,
				precios,
				deposito,
			},
			{ new: true }
		);
		if (!usuario) {
			return res
				.status(400)
				.json({ msg: `No existe el usuario con id: ${id}` });
		}

		res.json(usuario);
	} catch (err) {
		console.log("ERROR!!!", err);
		return res.status(500).json({ err });
	}
};

const eliminarUsuario = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		const estado = false;
		const usuario = await Usuario.findByIdAndUpdate(
			id,
			{ estado },
			{ new: true }
		);
		return res.json(usuario);
	} catch (err) {
		console.log("ERROR!!!", err);
		return res.status(500).json({ err });
	}
};

module.exports = {
	getUsuarios,
	getUsuario,
	login,
	crearUsuario,
	modificarUsuario,
	eliminarUsuario,
};
