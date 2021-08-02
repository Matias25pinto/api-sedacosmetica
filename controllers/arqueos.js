const { request, response } = require("express");

const Arqueo = require("../models/arqueo");
const Sucursal = require("../models/sucursal");
const Comprobante = require("../models/comprobante");
const {
  fechaFormatISODate,
  numberFormat,
} = require("../helpers/formatear-fecha");

const {
  calcularArqueo,
  calcularArqueoPorSucursal,
} = require("../database/querys");

const getArqueos = (req = request, res = response) => {
  let usuario = req.usuario;
  let condicion = { anulado: false };
  if (usuario.role == "USER_ROLE") {
    let sucursal = usuario.sucursal;
    condicion = {
      anulado: false,
      sucursal,
    };
  }
  Arqueo.find(condicion)
    .sort({ fecha: "desc" })
    .populate("sucursal", "titulo")
    .exec((err, arqueosBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      Arqueo.countDocuments(condicion, (err, cantidad) => {
        res.status(200).json({
          ok: true,
          arqueosBD,
          total: cantidad,
        });
      });
    });
};

const getArqueo = (req = request, res = response) => {
  let id = req.params.id;
  Arqueo.findById(id)
    .populate("sucursal", "titulo")
    .exec((err, arqueoBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.status(200).json({
        ok: true,
        arqueoBD,
      });
    });
};

const setArqueo = (req = request, res = response) => {
  let body = req.body;
  let fechaBody = new Date(body.fecha);
  let yyyy = fechaBody.getFullYear();
  let MM = fechaBody.getMonth();
  let dd = fechaBody.getDate();
  let fecha = new Date(fechaFormatISODate(`${yyyy}-${MM + 1}-${dd}`));
  let totalUtilidad = body.venta - body.totalCosto;
  let usuarios = [req.usuario];
  let arqueo = new Arqueo({
    sucursal: body.sucursal,
    fecha,
    venta: body.venta,
    totalCosto: body.totalCosto,
    totalUtilidad,
    usuarios,
  });

  arqueo.save((err, arqueoBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    res.status(200).json({
      ok: true,
      arqueoBD,
    });
  });
};

const deleteArqueo = (req = request, res = response) => {
  let id = req.params.id;
  let actualizar = { anulado: true };

  Arqueo.findByIdAndUpdate(id, actualizar, { new: true }, (err, arqueoBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    res.status(200).json({
      ok: true,
      arqueoBD,
    });
  });
};

const setComprobantes = (req = request, res = response) => {
  let id = req.params.id;
  let body = req.body;
  let fechaBody = new Date(body.fArqueo);
  let yyyy = fechaBody.getFullYear();
  let MM = fechaBody.getMonth();
  let dd = fechaBody.getDate();
  let fArqueo = new Date(fechaFormatISODate(`${yyyy}-${MM + 1}-${dd}`));
  body.fArqueo = fArqueo;
  let comprobantes = [];
  let usuarios = [];
  let noAgregarUsuario = false;

  Arqueo.findById(id).exec((err, arqueoBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    //agregar comprobante
    if (arqueoBD.comprobantes.length > 0) {
      comprobantes = arqueoBD.comprobantes;
    }
    comprobantes.push(body);

    //actualizar usuarios
    usuarios = arqueoBD.usuarios;
    for (const usuario of usuarios) {
      if (usuario == req.usuario._id) {
        noAgregarUsuario = true;
      }
    }
    if (!noAgregarUsuario) {
      usuarios.push(req.usuario);
    }
    //actualizar
    Arqueo.findByIdAndUpdate(
      id,
      { comprobantes, usuarios },
      { new: true },
      (err, arqueoUpdate) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }
        res.status(200).json({
          ok: true,
          arqueoUpdate,
        });
      }
    );
  });
};

const deleteComprobante = (req = request, res = response) => {
  let id = req.params.id;
  let comprobantes = req.body;
  let usuarios = [];
  let noAgregarUsuario = false;

  Arqueo.findById(id).exec((err, arqueoBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    //actualizar usuarios
    usuarios = arqueoBD.usuarios;
    for (const usuario of usuarios) {
      if (usuario == req.usuario._id) {
        noAgregarUsuario = true;
      }
    }
    if (!noAgregarUsuario) {
      usuarios.push(req.usuario);
    }
    //actualizar
    Arqueo.findByIdAndUpdate(
      id,
      { comprobantes, usuarios },
      { new: true },
      (err, arqueoUpdate) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }
        res.status(200).json({
          ok: true,
          arqueoUpdate,
        });
      }
    );
  });
};

const reportes = async (req = request, res = response) => {
  try {
    let sucursal = req.params.sucursal;
    //calcular rango de fecha
    let start = req.get("start");
    let end = req.get("end");

    if (!start || !end) {
      return res.status(500).json({
        ok: false,
        err: {
          message: "Falta fecha desde o fecha hasta",
        },
      });
    }
    //{ $gte: start, $lte: end }, la fecha debe ser mayor o igual que y menor o igual
    let condicion = {
      sucursal: sucursal,
      fArqueo: {
        $gte: fechaFormatISODate(start),
        $lte: fechaFormatISODate(end),
      },
    };

    let fecha1 = new Date(start);
    let fecha2 = new Date(end);
    let { codigosucursal, titulo } = await Sucursal.findById(sucursal);
    let arqueos = await calcularArqueoPorSucursal(
      fecha1,
      fecha2,
      codigosucursal
    );
    let arqueo = arqueos[0];
    let comprobantes = await Comprobante.find(condicion);

    //Total de ventas
    let montoComprobantes = 0;
    let totalGasto = 0;
    let totalRetiro = 0;
    let totalTarjeta = 0;
    let totalCheque = 0;
    let totalDeposito = 0;
    let ganancia = 0;
    let comprobantesGasto = [];
    let comprobanteRetiro = [];
    let comprobanteTarjeta = [];
    let comprobanteCheque = [];
    let comprobantesDeposito = [];

    for await (const comprobante of comprobantes) {
      if (
        comprobante.comprobante != "RETIRO" &&
        comprobante.comprobante != "TARJETA" &&
        comprobante.comprobante != "CHEQUE" &&
        comprobante.comprobante != "DEPOSITO"
      ) {
        totalGasto = totalGasto + comprobante.monto;
        comprobantesGasto.push(comprobante);
      }
      if (comprobante.comprobante == "RETIRO") {
        totalRetiro = totalRetiro + comprobante.monto;
        comprobanteRetiro.push(comprobante);
      }
      if (comprobante.comprobante == "TARJETA") {
        totalTarjeta = totalTarjeta + comprobante.monto;
        comprobanteTarjeta.push(comprobante);
      }
      if (comprobante.comprobante == "CHEQUE") {
        totalCheque = totalCheque + comprobante.monto;
        comprobanteCheque.push(comprobante);
      }
      if (comprobante.comprobante == "DEPOSITO") {
        totalDeposito = totalDeposito + comprobante.monto;
        comprobantesDeposito.push(comprobante);
      }
      montoComprobantes = montoComprobantes + comprobante.monto;
    }
    let ventaNeta = arqueo.totalVentas;
    let totalCosto = arqueo.totalCosto;
    let totalUtilidad = arqueo.totalUtilidad;
    let totalEfectivo = arqueo.totalVentas - totalGasto;
    ganancia = totalUtilidad - totalGasto;
    return res.status(200).json({
      ok: true,
      sucursal: titulo,
      desde: fechaFormatISODate(start),
      hasta: fechaFormatISODate(end),
      ventaNeta,
      costo: totalCosto,
      totalEfectivo,
      totalUtilidad,
      totalGasto,
      totalRetiro,
      totalTarjeta,
      totalCheque,
      totalDeposito,
      montoComprobantes,
      ganancia,
      comprobantesGasto,
      comprobanteRetiro,
      comprobanteTarjeta,
      comprobanteCheque,
      comprobantesDeposito,
    });
  } catch (err) {
    console.log(err);
    if (err) {
      console.log("ERROR!!!", err);
      return res.status(500).json({
        ok: false,
        err,
      });
    }
  }
};

const reportesAntiguo = (req = request, res = response) => {
  let sucursal = req.params.sucursal;
  //calcular rango de fecha
  let start = fechaFormatISODate(req.get("start"));
  let end = fechaFormatISODate(req.get("end"));
  if (!start || !end) {
    return res.status(500).json({
      ok: false,
      err: {
        message: "Falta fecha desde o fecha hasta",
      },
    });
  }
  //{ $gte: start, $lte: end }, la fecha debe ser mayor o igual que y menor o igual que
  let condicion = {
    sucursal: sucursal,
    anulado: false,
    fecha: { $gte: start, $lte: end },
  };
  Arqueo.find(condicion)
    .populate("sucursal", "titulo")
    .exec((err, arqueosBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      //Total de ventas
      let ventas = 0;
      let montoComprobantes = 0;
      let totalCosto = 0;
      let totalUtilidad = 0;
      let totalGasto = 0;
      let totalRetiro = 0;
      let totalTarjeta = 0;
      let totalCheque = 0;
      let totalDeposito = 0;
      let ganancia = 0;
      let comprobantesGasto = [];
      let comprobanteRetiro = [];
      let comprobanteTarjeta = [];
      let comprobanteCheque = [];
      let comprobantesDeposito = [];
      let existeArqueo = true;
      if (arqueosBD.length == 0) {
        existeArqueo = false;
      }
      //CALCULAR LOS GASTOS
      //Los gastos son todos los comprobantes donde sale plata de la empresa
      if (existeArqueo) {
        for (const arqueo of arqueosBD) {
          if (arqueo.comprobantes.length > 0) {
            //NO SON GASTOS: RETIRO, TARJETA, CHEQUE, DEPOSITO
            for (const comprobante of arqueo.comprobantes) {
              if (
                comprobante.comprobante != "RETIRO" &&
                comprobante.comprobante != "TARJETA" &&
                comprobante.comprobante != "CHEQUE" &&
                comprobante.comprobante != "DEPOSITO"
              ) {
                totalGasto = totalGasto + numberFormat(comprobante.monto);
                comprobantesGasto.push(comprobante);
              }
              if (comprobante.comprobante == "RETIRO") {
                totalRetiro = totalRetiro + numberFormat(comprobante.monto);
                comprobanteRetiro.push(comprobante);
              }
              if (comprobante.comprobante == "TARJETA") {
                totalTarjeta = totalTarjeta + numberFormat(comprobante.monto);
                comprobanteTarjeta.push(comprobante);
              }
              if (comprobante.comprobante == "CHEQUE") {
                totalCheque = totalCheque + numberFormat(comprobante.monto);
                comprobanteCheque.push(comprobante);
              }
              if (comprobante.comprobante == "DEPOSITO") {
                totalDeposito = totalDeposito + numberFormat(comprobante.monto);
                comprobantesDeposito.push(comprobante);
              }
              montoComprobantes =
                montoComprobantes + numberFormat(comprobante.monto);
            }
          }
          ventas = ventas + arqueo.venta;
          totalCosto = totalCosto + arqueo.totalCosto;
          totalUtilidad = totalUtilidad + arqueo.totalUtilidad;
          ganancia = totalUtilidad - totalGasto;
        }
      }
      //Nombre de la sucursal
      Sucursal.findById({ _id: sucursal }, (err, sucursalBD) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }
        res.status(200).json({
          ok: true,
          sucursal: sucursalBD.titulo,
          desde: start,
          hasta: end,
          ventaNeta: ventas,
          costo: totalCosto,
          totalUtilidad,
          totalGasto,
          totalRetiro,
          totalTarjeta,
          totalCheque,
          totalDeposito,
          montoComprobantes,
          ganancia,
          comprobantesGasto,
          comprobanteRetiro,
          comprobanteTarjeta,
          comprobanteCheque,
          comprobantesDeposito,
        });
      });
    });
};

const buscarComprobantes = async (req = request, res = response) => {
  try {
    let arqueos = await Arqueo.find();
    let depositos = [];
    for (let arqueo of arqueos) {
      let comprobantes = [];
      comprobantes = arqueo.comprobantes;
      for (let comprobante of comprobantes) {
        if (comprobante.comprobante == "DEPOSITO") {
          if (comprobante.nroComprobante == "7455295") {
            depositos.push(comprobante);
          }
        }
      }
    }
    res.json({ depositos });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "ERROR!!! ocurrio un error en el servidor", err });
  }
};

const nuevaBaseDatos = async (req = request, res = response) => {
  const arqueos = await Arqueo.find({ anulado: false });

  //comprobantes es un arreglo de arreglos de comprobantes
  const comprobantes = arqueos.map((arqueo) => {
    return arqueo.comprobantes.map((comprobante) => {
      comprobante["fArqueo"] = arqueo.fecha;
      comprobante["sucursal"] = arqueo.sucursal;
      comprobante["monto"] = parseInt(comprobante.monto);
      if (!comprobante.monto) {
        comprobante.monto = 0;
      }
      if (comprobante.comprobante == "DEPOSITO") {
        if (comprobante.banco == "") {
          comprobante.banco = "CAMPO EN BLANCO";
        }
        if (comprobante.cuentaBancaria == "") {
          comprobante.cuentaBancaria = "CAMPO EN BLANCO";
        }
        if (comprobante.nroComprobante == "") {
          comprobante.nroComprobante = "CAMPO EN BLANCO";
        }
        if (comprobante.fPago == "") {
          comprobante.fPago = "CAMPO EN BLANCO";
        }
      }
      if (comprobante.comprobante == "TARJETA") {
        if (comprobante.boleta == "") {
          comprobante.boleta = "CAMPO EN BLANCO";
        }
        if (comprobante.fPago == "") {
          comprobante.fPago = "CAMPO EN BLANCO";
        }
      }
      if (comprobante.comprobante == "SALARIO") {
        if (comprobante.cedula == "." || Array.isArray(comprobante.cedula)) {
          comprobante.cedula = "CAMPO EN BLANCO";
        }

        if (comprobante.cargo == "." || Array.isArray(comprobante.cargo)) {
          comprobante.cargo = "CAMPO EN BLANCO";
        }
        if (
          comprobante.tipoComprobante == "." ||
          Array.isArray(comprobante.tipoComprobante)
        ) {
          comprobante.tipoComprobante = "CAMPO EN BLANCO";
        }
        if (comprobante.nroComprobante == ".") {
          comprobante.nroComprobante = "CAMPO EN BLANCO";
        }
        if (comprobante.observacion == ".") {
          comprobante.observacion = "CAMPO EN BLANCO";
        }
      }
      if (comprobante.comprobante == "DESCUENTO") {
        if (comprobante.autorizaNA == " " || comprobante.autorizaNA == ".") {
          comprobante.autorizaNA = "CAMPO EN BLANCO";
        }
        if (comprobante.autorizaCI == " " || comprobante.autorizaCI == ".") {
          comprobante.autorizaCI = "CAMPO EN BLANCO";
        }
        if (comprobante.empleadoCI == " " || comprobante.empleadoCI == ".") {
          comprobante.empleadoCI = "CAMPO EN BLANCO";
        }
      }
      return comprobante;
    });
  });
  let comprobantesUnificados = [];
  //Unificar todos los comprobantes en un solo arreglo
  for (let arregloComprobante of comprobantes) {
    arregloComprobante.map((comprobante) => {
      comprobantesUnificados.push(comprobante);
      return;
    });
  }
  return res.json({ msg: "No se cargo en la Base de Datos" });
  let contador = 0;
  let longitudArrelgo = comprobantesUnificados.length;
  for await (let comprobante of comprobantesUnificados) {
    let comprobanteLocal = new Comprobante(comprobante);
    let comprobanteBD = await comprobanteLocal.save();
    contador++;
  }

  console.log(`Contador: ${contador}, Longitud: ${longitudArrelgo}`);
  res.json(comprobantesUnificados);
};

const generarArqueos = async (req = request, res = response) => {
  try {
    let { desde, hasta, codigoSucursal = undefined } = req.body;
    let fecha1 = new Date(desde);
    let fecha2 = new Date(hasta);
    let arqueos;
    if (codigoSucursal) {
      arqueos = await calcularArqueoPorSucursal(fecha1, fecha2, codigoSucursal);
    } else {
      arqueos = await calcularArqueo(fecha1, fecha2);
    }

    res.json(arqueos);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "ERROR!!! ocurrio un error en el servidor", err });
  }
};

module.exports = {
  getArqueos,
  getArqueo,
  setArqueo,
  deleteArqueo,
  setComprobantes,
  deleteComprobante,
  reportes,
  buscarComprobantes,
  nuevaBaseDatos,
  generarArqueos,
};
