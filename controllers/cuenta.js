const { request, response } = require("express");
const Cuenta = require("../models/cuenta");

const crearCuenta = async (req = request, res = response) => {
	try {
		const { banco, titular, nroCuenta } = req.body;
		const estado = true;
		let cuenta = new Cuenta({ banco, titular, nroCuenta, estado });
		await cuenta.save();
		return res.json(cuenta);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};

const modificarCuenta = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		const { banco, titular, nroCuenta } = req.body;
		let cuenta = await Cuenta.findByIdAndUpdate(
			id,
			{ banco, titular, nroCuenta },
			{ new: true }
		);
		return res.json(cuenta);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};

const cuentas = async (req = request, res = response) => {
	try {
		const banco = req.get("banco");
		const estado = true;

		const cuentas = await Cuenta.find({ estado, banco });

		return res.json(cuentas);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};

const cuenta = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		const cuenta = await Cuenta.findById(id);
		return res.json(cuenta);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};

const eliminarCuenta = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		const cuenta = await Cuenta.findByIdAndUpdate(
			id,
			{ estado: false },
			{ new: true }
		);
		return res.json(cuenta);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};

module.exports = {
	crearCuenta,
	modificarCuenta,
	cuentas,
	cuenta,
	eliminarCuenta,
};
