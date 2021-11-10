const { request, response } = require("express");
const Objetivo = require("../models/objetivo");
const Sucursal = require("../models/sucursal");
const { calcularVentasPorSucursal } = require("../database/querys");

const crearObjetivto = async (req = request, res = response) => {
	try {
		const { incremento, mes, sucursal } = req.body;
		const fecha = new Date();
		const year = fecha.getFullYear();
		const objetivo = new Objetivo({ incremento, mes, year, sucursal });
		const existeObjetivo = await Objetivo.findOne({ sucursal, mes, year });
		if (existeObjetivo) {
			return res
				.status(400)
				.json({ err: "Ya existe objetivo en el mes seleccionado " });
		}
		await objetivo.save();
		res.json(objetivo);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};

const cambiarIncremento = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		const { incremento = 0 } = req.body;
		const objetivo = await Objetivo.findByIdAndUpdate(
			id,
			{ incremento },
			{ new: true }
		);

		res.json(objetivo);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};

const objetivo = async (req, res) => {
	try {
		const { sucursal, mes, year } = req.query;
		let query = {};
		if (sucursal) {
			query["sucursal"] = sucursal;
		}
		if (mes) {
			if (parseInt(mes) <= 12) {
				query["mes"] = mes;
			}
		}
		if (year) {
			if (year.length == 4) {
				query["year"] = year;
			}
		}
		let sucursalObjeto = await Sucursal.find({ _id: sucursal });
		//en javascript 11 es diciembre y 0 es enero
		const primerDiaActual = new Date(year, mes - 1, 1);
		const ultimoDiaActual = new Date(year, mes, 0); //si se envia día cero este devuelve el último día del mes anterior

		const primerDiaAnterior = new Date(year - 1, mes - 1, 1);
		const ultimoDiaAnterior = new Date(year - 1, mes, 0);

		const [ventasActual, ventasAnterior, objetivos] = await Promise.all([
			calcularVentasPorSucursal(
				primerDiaActual,
				ultimoDiaActual,
				sucursalObjeto[0].codigosucursal
			),
			calcularVentasPorSucursal(
				primerDiaAnterior,
				ultimoDiaAnterior,
				sucursalObjeto[0].codigosucursal
			),
			Objetivo.find(query).populate("sucursal", "titulo").sort({ mes: 1 }),
		]);

		let resp = {};

		if (objetivos.length > 0) {
			if (!ventasActual[0]) {
				ventasActual[0] = { totalVentas: 0 };
			}
			if (!ventasAnterior[0]) {
				ventasAnterior[0] = { totalVentas: 0 };
			}
			const ventaActual = ventasActual[0].totalVentas;
			const ventaAnterior = ventasAnterior[0].totalVentas;

			resp = {
				_id: objetivos[0]._id,
				ventaActual,
				ventaAnterior,
				incremento: objetivos[0].incremento,
				mes: objetivos[0].mes,
				year: objetivos[0].year,
				sucursal: objetivos[0].sucursal.titulo,
			};
		}
		res.json(resp);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err });
	}
};

module.exports = { crearObjetivto, cambiarIncremento, objetivo };
