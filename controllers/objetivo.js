const { request, response } = require("express");
const Objetivo = require("../models/objetivo");
const Sucursal = require("../models/sucursal");
const { calcularVentasPorSucursal } = require("../database/querys");
const {
	fechaFormatISODate,
	convertirT04,
} = require("../helpers/formatear-fecha");

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
		//para unificar la zona horaria del sistema utilizamos la función fechaFormatISODate()
		//Tratar fecha de objetivos
		//Crear las fechas start y end
		let start = `${year}-${mes}-${1}`; //mes-1;porque en js los meses son de 0 a 11
		//calcular último día del mes
		let mesAuxiliar1 = mes < 12 ? mes : 12;
		let diaAuxiliar1 = mes < 12 ? 0 : 31;
		let fechaAuxiliar1 = new Date(year, mesAuxiliar1, diaAuxiliar1);
		let end = `${year}-${mesAuxiliar1}-${fechaAuxiliar1.getDate()}`;

		console.log("start:", start, "end:", end, fechaAuxiliar1);

		//convertir con convertirT04
		start = convertirT04(start);
		end = convertirT04(end);
		console.log("startT04:", start, "endT04:", end);

		const primerDiaActual = new Date(start);
		const ultimoDiaActual = new Date(end);

		////Modificar las fechas start y end
		start = `${year - 1}-${mes}-${1}`; //mes-1;porque en js los meses son de 0 a 11
		//calcular último día del mes
		mesAuxiliar1 = mes < 12 ? mes : 12;
		diaAuxiliar1 = mes < 12 ? 0 : 31;
		fechaAuxiliar1 = new Date(year - 1, mesAuxiliar1, diaAuxiliar1);
		end = `${year - 1}-${mesAuxiliar1}-${fechaAuxiliar1.getDate()}`;

		console.log("start:", start, "end:", end, fechaAuxiliar1);

		//convertir con convertirT04
		start = convertirT04(start);
		end = convertirT04(end);
		console.log("startT04:", start, "endT04:", end);

		const primerDiaAnterior = new Date(start);
		const ultimoDiaAnterior = new Date(end);

		console.log(
			"primerDiaActual:",
			primerDiaActual,
			"ultimoDiaActual:",
			ultimoDiaActual
		);
		console.log(
			"primerDiaAnterior:",
			primerDiaAnterior,
			"ultimoDiaAnterior:",
			ultimoDiaAnterior
		);

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
