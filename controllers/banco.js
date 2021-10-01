const { request, response } = require("express");

const Banco = require("../models/banco");

const crearBanco = async (req = request, res = response) => {
	try {
		const { nombre, desc } = req.body;

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
		const { nombre, desc } = req.body;
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
		let { desde = 0, limite = 1000 } = req.query;
		desde = parseInt(desde);
		limite = parseInt(limite);
		const estado = true;
		const bancos = await Banco.find({ estado }).skip(desde).limit(limite);
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

module.exports = { crearBanco, modificarBanco, bancos, banco, eliminarBancos };
