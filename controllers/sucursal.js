const { request, response } = require("express");

const Sucursal = require("../models/sucursal");

const getSucursales = (req = request, res = response) => {
	try {
		Sucursal.find({ estado: true }).exec((err, sucursalesBD) => {
			if (err) {
				res.status(500).json({
					ok: false,
					err,
				});
			}
			res.status(200).json({
				ok: true,
				sucursalesBD,
			});
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};

const getSucursal = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		const sucursal = await Sucursal.findById(id);
		res.json(sucursal);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};

const crearSucursal = async (req = request, res = response) => {
	try {
		const { titulo, codigosucursal, direccion, tel, cel, correo, img } =
			req.body;
		const sucursal = new Sucursal({
			titulo,
			codigosucursal,
			direccion,
			tel,
			cel,
			correo,
			img,
		});

		await sucursal.save();

		res.json(sucursal);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};

const modificarSucursal = async (req, res) => {
	try {
		const { id } = req.params;
		const { titulo, codigosucursal, direccion, tel, cel, correo, img } =
			req.body;

		const sucursal = await Sucursal.findByIdAndUpdate(
			id,
			{ titulo, codigosucursal, direccion, tel, cel, correo, img },
			{ new: true }
		);

		res.json(sucursal);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};

const eliminarSucursal = async (req, res) => {
	try {
		const { id } = req.params;

		const estado = false;

		const sucursal = await Sucursal.findByIdAndUpdate(
			id,
			{ estado },
			{ new: true }
		);

		res.json(sucursal);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};

module.exports = {
	getSucursales,
	getSucursal,
	crearSucursal,
	modificarSucursal,
	eliminarSucursal,
};
