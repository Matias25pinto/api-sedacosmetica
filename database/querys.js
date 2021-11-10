const sql = require("mssql");
const sqlConfig = require("./config");

const { fechaQuery } = require("../helpers/formatear-fecha");

const productosMasVendidosDelDia = async () => {
	try {
		//agregamos zona horaria de paraguay
		let fechaString = new Date().toLocaleString("es-PY", {
			timeZone: "America/Asuncion",
		});
		//La fecha se convierte a un string que vamos transformando
		let fechaArray = fechaString.split("/");
		let yearHour = fechaArray[2].split(" ");
		let year = yearHour[0];
		let month = fechaArray[1];
		let day = fechaArray[0];
		if (month < 10) {
			month = "0" + month.toString();
		}
		if (day < 10) {
			day = "0" + day.toString();
		}
		const condicion = year.toString() + month + day;
		// make sure that any items are correctly URL encoded in the connection string
		await sql.connect(sqlConfig);
		const result =
			await sql.query`SELECT codigobarra, nombreproducto, SUM(cantidad) as "cantidad" 
                                        FROM VENTAS_SMARKET_VIEW 
                                        WHERE fecha = ${condicion} 
                                        GROUP BY codigobarra, nombreproducto 
                                        ORDER BY 3 DESC
                                        OFFSET 0 ROWS
                                        FETCH FIRST 10 ROWS ONLY`;
		let productos = [];
		for (let row of result.recordset) {
			productos.push({
				codigoBarra: row.codigobarra,
				producto: row.nombreproducto,
			});
		}
		return productos;
	} catch (err) {
		console.log("ERROR!!! no se pudo realizar la consulta", err);
		return [];
		// ... error checks
	}
};

const nuevosProductos = async () => {
	try {
		await sql.connect(sqlConfig);
		const result = await sql.query`SELECT codigobarra, descripcion, empresa
                                               FROM Producto 
                                               WHERE empresa = 4
                                               ORDER BY id DESC
                                               OFFSET 0 ROWS 
                                               FETCH FIRST 10 ROWS ONLY`;
		let productos = [];
		for (let row of result.recordset) {
			productos.push({
				codigoInterno: row.codigo,
				codigoBarra: row.codigobarra,
				producto: row.descripcion,
			});
		}

		return productos;
	} catch (err) {
		console.log("ERROR!!! no se pudo realizar la consulta", err);
		return [];
	}
};

const buscarProductos = async (termino, iddeposito, desde, hasta) => {
	try {
		await sql.connect(sqlConfig);
		const result =
			await sql.query`SELECT p.id, p.codigobarra, p.descripcion, p.descripcionale, p.empresa, s.iddeposito, d.codigo, SUM(s.existencia) as "existencia", p.pcosto, p.pcostod, p.preven, p.preven2, p.preven3, p.preven4, p.preven5, p.preven6, p.preven7, p.preven8, p.preven9, p.preven10, p.preven11, p.preven12, p.preven13, p.preven14, p.preven15, p.preven16, p.preven17, p.preven18, p.preven19, p.preven20
   FROM Producto p
    INNER JOIN STKDeposito s
    ON p.id = s.idproducto
    INNER JOIN deposito d
    ON s.iddeposito = d.id
    WHERE p.empresa = 4
    AND s.iddeposito = ${iddeposito}
    AND PATINDEX ('%' + CAST(${termino} AS VARCHAR) +'%',p.descripcion)  !=0
    GROUP BY p.id, p.codigobarra, p.descripcion, p.descripcionale, p.empresa, s.iddeposito, d.codigo, p.pcostod, p.pcosto, p.preven, p.preven2, p.preven3, p.preven4, p.preven5, p.preven6, p.preven7, p.preven8, p.preven9, p.preven10, p.preven11, p.preven12, p.preven13, p.preven14, p.preven15, p.preven16, p.preven17, p.preven18, p.preven19, p.preven20
    ORDER BY 1 DESC
    OFFSET ${desde} ROWS
    FETCH FIRST ${hasta} ROWS ONLY
    `;
		let productos = [];
		for (let row of result.recordset) {
			productos.push(row);
		}

		return productos;
	} catch (err) {
		console.log("ERROR!!! no se pudo realizar la consulta", err);
		return [];
	}
};

const buscarProductosCB = async (
	termino,
	longitud,
	iddeposito,
	desde,
	hasta
) => {
	try {
		await sql.connect(sqlConfig);
		const result =
			await sql.query`SELECT p.id, p.codigobarra, p.descripcion, p.descripcionale, p.empresa, s.iddeposito, d.codigo, SUM(s.existencia) as "existencia",p.pcostod, p.pcosto, p.preven, p.preven2, p.preven3, p.preven4, p.preven5, p.preven6, p.preven7, p.preven8, p.preven9, p.preven10, p.preven11, p.preven12, p.preven13, p.preven14, p.preven15, p.preven16, p.preven17, p.preven18, p.preven19, p.preven20
    FROM Producto p
    INNER JOIN STKDeposito s
    ON p.id = s.idproducto
    INNER JOIN deposito d
    ON s.iddeposito = d.id
    WHERE p.empresa = 4
    AND s.iddeposito = ${iddeposito}
    AND RIGHT(p.codigobarra, ${longitud}) = ${termino}
    GROUP BY p.id, p.codigobarra, p.descripcion, p.descripcionale, p.empresa, s.iddeposito, d.codigo, p.pcostod, p.pcosto, p.preven, p.preven2, p.preven3, p.preven4, p.preven5, p.preven6, p.preven7, p.preven8, p.preven9, p.preven10, p.preven11, p.preven12, p.preven13, p.preven14, p.preven15, p.preven16, p.preven17, p.preven18, p.preven19, p.preven20
    ORDER BY 1 DESC
    OFFSET ${desde} ROWS
    FETCH FIRST ${hasta} ROWS ONLY`;
		let productos = [];
		for (let row of result.recordset) {
			productos.push(row);
		}
		return productos;
	} catch (err) {
		console.log("ERROR!!! no se pudo realizar la consulta", err);
		return [];
	}
};

const calcularArqueo = async (desde = new Date(), hasta = new Date()) => {
	try {
		const fecha1 = fechaQuery(desde);
		const fecha2 = fechaQuery(hasta);

		// make sure that any items are correctly URL encoded in the connection string
		await sql.connect(sqlConfig);
		const result =
			await sql.query`SELECT su.codigo AS "codigosucursal", ltrim(rtrim(su.descripcion)) nombresucursal ,  SUM(a.cantidad) AS "cantidad", 
                                        SUM(pr.pcosto*a.cantidad) AS "totalCosto", 
                                        SUM((ROUND(a.precioneto,0))*a.cantidad) AS "totalVentas", 
                                        SUM(((ROUND(a.precioneto,0))*a.cantidad)-(pr.pcosto*a.cantidad)) AS "totalUtilidad"
                                        FROM Facturadet a
                                        INNER JOIN Factura fa ON fa.id=a.idfactura
                                        LEFT OUTER JOIN STKTipoMov tm ON tm.id=fa.idstktipomov
                                        INNER JOIN producto pr ON pr.id=a.idproducto
                                        INNER JOIN Deposito de ON de.id=fa.iddeposito
                                        INNER JOIN Sucursal su ON su.id=de.idsucursal
                                        LEFT OUTER JOIN Cliente cl ON cl.id=fa.idcliente
                                        WHERE fa.tipo='VE'
                                        AND fa.estado=0
                                        AND fa.fecha BETWEEN ${fecha1} AND ${fecha2} 
                                        GROUP BY su.codigo, su.descripcion;`;
		let productos = [];
		for (let row of result.recordset) {
			productos.push(row);
		}
		return productos;
	} catch (err) {
		console.log("ERROR!!! no se pudo realizar la consulta", err);
		return [];
	}
};

const calcularArqueoPorSucursal = async (
	desde = new Date(),
	hasta = new Date(),
	codigoSucursal
) => {
	try {
		const fecha1 = fechaQuery(desde);
		const fecha2 = fechaQuery(hasta);
		await sql.connect(sqlConfig);
		const result =
			await sql.query`SELECT su.codigo AS "codigosucursal", ltrim(rtrim(su.descripcion)) nombresucursal ,  SUM(a.cantidad) AS "cantidad", 
                                        SUM(pr.pcosto*a.cantidad) AS "totalCosto", 
                                        SUM((ROUND(a.precioneto,0))*a.cantidad) AS "totalVentas", 
                                        SUM(((ROUND(a.precioneto,0))*a.cantidad)-(pr.pcosto*a.cantidad)) AS "totalUtilidad"
                                        FROM Facturadet a
                                        INNER JOIN Factura fa ON fa.id=a.idfactura
                                        LEFT OUTER JOIN STKTipoMov tm ON tm.id=fa.idstktipomov
                                        INNER JOIN producto pr ON pr.id=a.idproducto
                                        INNER JOIN Deposito de ON de.id=fa.iddeposito
                                        INNER JOIN Sucursal su ON su.id=de.idsucursal
                                        LEFT OUTER JOIN Cliente cl ON cl.id=fa.idcliente
                                        WHERE fa.tipo='VE'
                                        AND fa.estado=0
                                        AND fa.fecha BETWEEN ${fecha1} AND ${fecha2} 
                                        AND su.codigo = ${codigoSucursal}
                                        GROUP BY su.codigo, su.descripcion;`;
		let productos = [];
		for (let row of result.recordset) {
			productos.push(row);
		}
		return productos;
	} catch (err) {
		console.log("ERROR!!! no se pudo realizar la consulta", err);
		return [];
	}
};

const calcularVentasPorSucursal = async (
	desde = new Date(),
	hasta = new Date(),
	codigoSucursal
) => {
	try {
		const fecha1 = fechaQuery(desde);
		const fecha2 = fechaQuery(hasta);
		await sql.connect(sqlConfig);
		const result =
			await sql.query`SELECT su.codigo AS "codigosucursal", ltrim(rtrim(su.descripcion)) nombresucursal, SUM((ROUND(a.precioneto,0))*a.cantidad) AS "totalVentas"
FROM Facturadet a
INNER JOIN Factura fa ON fa.id=a.idfactura
LEFT OUTER JOIN STKTipoMov tm ON tm.id=fa.idstktipomov
INNER JOIN producto pr ON pr.id=a.idproducto
INNER JOIN Deposito de ON de.id=fa.iddeposito
INNER JOIN Sucursal su ON su.id=de.idsucursal
LEFT OUTER JOIN Cliente cl ON cl.id=fa.idcliente
WHERE fa.tipo='VE'
AND fa.estado=0
AND fa.fecha BETWEEN ${fecha1} AND ${fecha2} 
AND su.codigo = ${codigoSucursal}
GROUP BY su.codigo, su.descripcion;`;
		let productos = [];
		for (let row of result.recordset) {
			productos.push(row);
		}
		return productos;
	} catch (err) {
		console.log("ERROR!!! no se pudo realizar la consulta", err);
		return [];
	}
};

module.exports = {
	productosMasVendidosDelDia,
	nuevosProductos,
	buscarProductos,
	buscarProductosCB,
	calcularArqueo,
	calcularArqueoPorSucursal,
	calcularVentasPorSucursal,
};
