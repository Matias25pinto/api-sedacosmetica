const { request, response } = require("express");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);
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
		//Guardar la imagen en cloudinary
		const { tempFilePath } = req.files.img;
		const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
		data["img"] = secure_url;

		//Crear comprobante
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

const actualizarImagen = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		const usuario = req.usuario;

		let comprobante = await Comprobante.findById(id);
		if (!comprobante) {
			return res.status(400).json({ msg: "No existe el comprobante" });
		}
		//Validar si se puede actualizar el comprobante
		let actualizar = false;
		if (usuario.role == "ADMIN_ROLE") {
			actualizar = true;
		} else {
			let mesComprobante = comprobante.fArqueo.getMonth();
			let mesActual = new Date().getMonth();
			if (mesComprobante == mesActual) {
				actualizar = true;
			}
		}
		if (!actualizar) {
			return res.status(400).json({
				msg: "El rango de fecha permitido para actualizar ya fue superado",
			});
		}
		if (comprobante.img) {
			//Eliminar la imagen del comprobante antes de subir la nueva img
			const nombreArr = comprobante.img.split("/");
			const nombre = nombreArr[nombreArr.length - 1];
			const [public_id] = nombre.split(".");
			cloudinary.uploader.destroy(public_id);
		}
		//Guardar la imagen en cloudinary
		const { tempFilePath } = req.files.img;
		const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
		comprobante.img = secure_url;
		await comprobante.save();
		res.json(comprobante);
	} catch (err) {
		console.log(err);
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
		const usuario = req.usuario;
		//Validar si se puede eliminar el comprobante
		let eliminar = false;

		let comprobante = await Comprobante.findById(id);

		if (usuario.role == "ADMIN_ROLE") {
			eliminar = true;
		} else {
			//Si es el mes actual se podra eliminar el comprobante
			let mesComprobante = comprobante.fArqueo.getMonth();
			let mesActual = new Date().getMonth();
			if (mesComprobante == mesActual) {
				eliminar = true;
			}
		}
		if (eliminar) {
			if (comprobante.img) {
				//Eliminar la imagen del comprobante antes de subir la nueva img
				const nombreArr = comprobante.img.split("/");
				const nombre = nombreArr[nombreArr.length - 1];
				const [public_id] = nombre.split(".");
				await cloudinary.uploader.destroy(public_id);
			}
			let comprobanteEliminado = await Comprobante.findByIdAndDelete(id);
			res.json(comprobanteEliminado);
		} else {
			return res.status(400).json({
				msg: "El rango de fecha permitido para eliminar ya fue superado",
			});
		}
	} catch (err) {
		console.log(err);
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
	actualizarImagen,
};
