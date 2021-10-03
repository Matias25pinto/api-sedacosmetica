const { request, response } = require("express");

const Banco = require("../models/banco");

const crearBanco = async (req = request, res = response) => {
	try {
		let { nombre, desc } = req.body;
		nombre = nombre.toUpperCase();
		desc = desc.toUpperCase();

		let banco = new Banco({ nombre, desc });

		await banco.save();

		return res.json(banco);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};

const modificarBanco = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		let { nombre, desc } = req.body;
		nombre = nombre.toUpperCase();
		desc = desc.toUpperCase();

		const banco = await Banco.findByIdAndUpdate(
			id,
			{ nombre, desc },
			{ new: true }
		);
		if (banco === null) {
			return res
				.status(404)
				.json({ message: `El id: ${id} no pertenece a ningún banco.` });
		}
		return res.json(banco);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};

const bancos = async (req = request, res = response) => {
	try {
		let { nombre = "" } = req.query;
		let condicion = {};
		condicion["estado"] = true;
		if (nombre != "") {
			condicion["nombre"] = nombre.toUpperCase();
		}
		const bancos = await Banco.find(condicion);
		return res.json(bancos);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};

const banco = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		const banco = await Banco.findById(id);
		return res.json(banco);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};

const eliminarBancos = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		const estado = false;
		const banco = await Banco.findByIdAndUpdate(id, { estado }, { new: true });
		return res.json(banco);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};

module.exports = {
	crearBanco,
	modificarBanco,
	bancos,
	banco,
	eliminarBancos,
};
