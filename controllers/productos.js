const { request, response } = require("express");
const {
	productosMasVendidosDelDia,
	nuevosProductos,
	buscarProductos,
	buscarProductosCB,
} = require("../database/querys");
const productosMasVendidos = async (req = request, res = response) => {
	try {
		const productos = await productosMasVendidosDelDia();

		res.json(productos);
	} catch (err) {
		res
			.status(500)
			.json({ msg: "ERROR!!! ocurrio un error en el servidor", err });
	}
};

const productosAgregados = async (req = request, res = response) => {
	try {
		const productos = await nuevosProductos();
		res.json(productos);
	} catch (err) {
		res
			.status(500)
			.json({ msg: "ERROR!!! ocurrio un error en el servidor", err });
	}
};

const productos = async (req = request, res = response) => {
	try {
		let { termino = "", desde = 0, hasta = 10 } = req.query;
		if (parseInt(desde) < 0) {
			desde = 0;
		}
		const precios = req.precios;
		let deposito = req.deposito;
		if (termino === "") {
			return res
				.status(400)
				.json({ msg: "ERROR!!! El termino es obligatorio" });
		}
		deposito = parseInt(deposito);
		desde = parseInt(desde);
		hasta = parseInt(hasta);
		if (!isNaN(parseInt(termino))) {
			let productos = [];

			let longitud = termino.length <= 13 ? termino.length : 13;
			productos = await buscarProductosCB(
				termino,
				longitud,
				deposito,
				desde,
				hasta
			);

			let resp = productos.map((producto) => {
				let productoFormateado = new Object();
				productoFormateado["codigoBarra"] = producto.codigobarra;
				productoFormateado["producto"] = producto.descripcion;
				if (precios.length > 0) {
					productoFormateado["empresa"] = producto.empresa;
					productoFormateado["iddeposito"] = producto.iddeposito;
					productoFormateado["codigoDeposito"] = producto.codigo;
					productoFormateado["existencia"] = producto.existencia;
					if (req.role === "ADMIN_ROLE") {
						productoFormateado["referencia"] = producto.descripcionale;
					}
					let totalPrecios = [];
					for (let precio of precios) {
						let valor = producto[precio];
						totalPrecios.push({
							tipoPrecio: precio,
							precio: valor,
						});
					}
					productoFormateado["precios"] = totalPrecios;
				}
				return productoFormateado;
			});
			res.json(resp);
		} else {
			const productos = await buscarProductos(termino, deposito, desde, hasta);
			let resp = productos.map((producto) => {
				let productoFormateado = new Object();
				productoFormateado["codigoBarra"] = producto.codigobarra;
				productoFormateado["producto"] = producto.descripcion;
				if (precios.length > 0) {
					productoFormateado["empresa"] = producto.empresa;
					productoFormateado["iddeposito"] = producto.iddeposito;
					productoFormateado["codigoDeposito"] = producto.codigo;
					productoFormateado["existencia"] = producto.existencia;
					if (req.role === "ADMIN_ROLE") {
						productoFormateado["referencia"] = producto.descripcionale;
					}

					let totalPrecios = [];
					for (let precio of precios) {
						let valor = producto[precio];
						totalPrecios.push({
							tipoPrecio: precio,
							precio: valor,
						});
					}
					productoFormateado["precios"] = totalPrecios;
				}
				return productoFormateado;
			});
			res.json(resp);
		}
	} catch (err) {
		console.log(err);
		res
			.status(500)
			.json({ msg: "ERROR!!! ocurrio un error en el servidor", err });
	}
};

module.exports = { productosMasVendidos, productosAgregados, productos };
