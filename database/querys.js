const sql = require("mssql");
const sqlConfig = require("./config");

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
    const result = await sql.query`SELECT codigobarra, nombreproducto, SUM(cantidad) as "cantidad" 
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
    const result = await sql.query`SELECT p.codigobarra, p.descripcion, p.descripcionale, p.empresa, s.iddeposito, d.codigo, s.existencia, p.pcosto, p.pcostod, p.preven, p.preven2, p.preven3, p.preven4, p.preven5, p.preven6, p.preven7, p.preven8, p.preven9, p.preven10, p.preven11, p.preven12, p.preven13, p.preven14, p.preven15, p.preven16, p.preven17, p.preven18, p.preven19, p.preven20
   FROM Producto p
    INNER JOIN STKDeposito s
    ON p.id = s.idproducto
    INNER JOIN deposito d
    ON s.iddeposito = d.id
    WHERE p.empresa = 4
    AND s.iddeposito = ${iddeposito}
    AND PATINDEX ('%' + CAST(${termino} AS VARCHAR) +'%',p.descripcion)  !=0
    ORDER BY p.id DESC
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

const buscarProductosCB = async (termino, iddeposito, desde, hasta) => {
  try {
    await sql.connect(sqlConfig);
    const result = await sql.query`SELECT p.codigobarra, p.descripcion, p.descripcionale, p.empresa, s.iddeposito, d.codigo, s.existencia,p.pcostod, p.pcosto, p.preven, p.preven2, p.preven3, p.preven4, p.preven5, p.preven6, p.preven7, p.preven8, p.preven9, p.preven10, p.preven11, p.preven12, p.preven13, p.preven14, p.preven15, p.preven16, p.preven17, p.preven18, p.preven19, p.preven20
    FROM Producto p
    INNER JOIN STKDeposito s
    ON p.id = s.idproducto
    INNER JOIN deposito d
    ON s.iddeposito = d.id
    WHERE p.empresa = 4
    AND s.iddeposito = ${iddeposito}
    AND p.codigobarra = ${termino}
    ORDER BY p.id DESC
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

const prueba = async (termino, iddeposito, desde, hasta) => {
  try {
    await sql.connect(sqlConfig);
    const result = await sql.query`SELECT *
    FROM producto p
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

module.exports = {
  productosMasVendidosDelDia,
  nuevosProductos,
  buscarProductos,
  buscarProductosCB,
  prueba,
};
