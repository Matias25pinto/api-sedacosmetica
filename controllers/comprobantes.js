const { request, response } = require("express");
const { fechaFormatISODate } = require("../helpers/formatear-fecha");
const Comprobante = require("../models/comprobante");

const getComprobantes = async (req = request, res = response) => {
	try {
		let desde = req.get("desde") || 0;
		let hasta = req.get("hasta") || 10;
		let sucursal = req.get("sucursal") || undefined;
		let fechaDesde = req.get("fechaDesde") || undefined;
		let fechaHasta = req.get("fechaHasta") || undefined;
		let comprobante = req.get("comprobante") || undefined;
		desde = parseInt(desde);
		hasta = parseInt(hasta);
		let condicion = {};
		if (sucursal) {
			condicion["sucursal"] = sucursal;
		}
		if (fechaDesde && fechaHasta) {
			let fecha1 = new Date(fechaFormatISODate(fechaDesde));
			let fecha2 = new Date(fechaFormatISODate(fechaHasta));
			condicion["fArqueo"] = {
				$gte: fecha1,
				$lte: fecha2,
			};
		}
		if (comprobante) {
			condicion["comprobante"] = comprobante;
		}
		let [cantidadComprobantes, comprobantes] = await Promise.all([
			Comprobante.countDocuments(condicion),
			Comprobante.find(condicion)
				.populate("banco")
				.populate("cuentaBancaria")
				.sort({ fArqueo: -1 })
				.skip(desde)
				.limit(hasta),
		]);

		res.json({ cantidadComprobantes, comprobantes });
	} catch (err) {
		console.log("ERROR!!!", err);
		return res.json({ cantidadComprobantes: 0, comprobantes: [] });
	}
};

const getComprobante = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		const comprobante = await Comprobante.findById(id);
		res.json(comprobante);
	} catch (err) {
		return res
			.status(500)
			.json({ msg: "ERROR!!! ocurrio un error en el servidor" });
	}
};

const crearComprobante = async (req = request, res = response) => {
	try {
		let data = req.body;
		data.fArqueo = fechaFormatISODate(data.fArqueo);
		if (data.fDeposito) {
			data.fDeposito = fechaFormatISODate(data.fDeposito);
		}
		let comprobante = new Comprobante(data);
		let comprobanteBD = await comprobante.save();
		res.json(comprobanteBD);
	} catch (err) {
		console.log("ERROR!!!", err);
		return res
			.status(500)
			.json({ msg: "ERROR!!! ocurrio un error en el servidor" });
	}
};

const modificarComprobante = async (req = request, res = response) => {
	try {
		res.json({ msg: "Funciona el controlador de modificarComprobante" });
	} catch (err) {
		return res
			.status(500)
			.json({ msg: "ERROR!!! ocurrio un error en el servidor" });
	}
};

const eliminarComprobante = async (req = request, res = response) => {
	try {
		const id = req.params.id;
		let comprobanteEliminado = await Comprobante.findByIdAndDelete(id);
		res.json(comprobanteEliminado);
	} catch (err) {
		return res
			.status(500)
			.json({ msg: "ERROR!!! ocurrio un error en el servidor" });
	}
};

const cambiarBancoNroCuenta = async (req = request, res = response) => {
	try {
		let comprobantes = [];
		let comprobantesDeposito = await Comprobante.find({
			comprobante: "DEPOSITO",
		});
		let nuevosComprobantes = comprobantesDeposito.filter((comprobante) => {
			if (!comprobante.cuentaBancaria) {
				comprobante["banco"] = "615a7a561b0e382aa38696c9";
				comprobante["cuentaBancaria"] = "615ae56a069cf60aae5bb3a9";
				return comprobante;
			}
		});
		return res.json(nuevosComprobantes);
		let contador = 0;
		for await (let comprobanteDeposito of nuevosComprobantes) {
			if (comprobanteDeposito.cuentaBancaria != null) {
				let id = comprobanteDeposito._id;
				let cuentaBancaria = comprobanteDeposito.cuentaBancaria;
				let banco = comprobanteDeposito.banco;
				let resp = await Comprobante.findByIdAndUpdate(
					id,
					{ cuentaBancaria, banco },
					{ new: true }
				);
				console.log(resp);
				comprobantes.push(resp);
				contador++;
			}
		}
		console.log("FIN", "cantidad:", contador);
		res.json(comprobantes);
	} catch (err) {
		console.log(err);
		return res
			.status(500)
			.json({ msg: "ERROR!!! ocurrio un error en el servidor" });
	}
};

module.exports = {
	getComprobantes,
	getComprobante,
	crearComprobante,
	modificarComprobante,
	eliminarComprobante,
	cambiarBancoNroCuenta,
};
