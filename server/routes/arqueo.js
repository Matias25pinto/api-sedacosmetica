const express = require("express");

const cors = require("cors"); // cors, sirve para que cualquier front-end pueda hacer una petición a la API

const { verificaRol, verificaToken } = require("../middlewares/autenticacion");

const Arqueo = require("../models/arqueo");
const Sucursal = require("../models/sucursal");

const app = express();

let corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

//app.use(cors(corsOptions)); //para utilizar el cors, de esta forma cualquiera puede hacer peticiones a nuestra api

app.get("/arqueo/:id", verificaToken, (req, res) => {
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
});
app.get("/arqueos", verificaToken, (req, res) => {
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
});

app.post("/arqueo", [verificaToken, verificaRol], (req, res) => {
  let body = req.body;
  //let fecha = new Date(body.fecha);
  let fecha = body.fecha;
  let totalUtilidad = body.venta - body.totalCosto;
  let usuarios = [req.usuario];
  console.log(fecha);
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
});

app.put(
  "/arqueo/comprobantes/eliminar/:id",
  [verificaToken, verificaRol],
  (req, res) => {
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
  }
);

app.put("/arqueo/comprobantes/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;
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
});

app.delete("/arqueo/:id", [verificaToken, verificaRol], (req, res) => {
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
});

//retportes

app.get("/arqueo/reporte/ventas/:sucursal", cors(), (req, res) => {
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

  let condicion = {};
  //si es igual enviar solo una fecha
  if (start == end) {
    condicion = {
      sucursal: sucursal,
      anulado: false,
      fecha: start,
    };
  } else {
    condicion = {
      sucursal: sucursal,
      anulado: false,
      fecha: { $gte: start, $lte: end },
    };
  }

  Arqueo.find(condicion)
    .populate("sucursal", "titulo")
    .exec((err, arqueosBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (arqueosBD.length === 0) {
        return res.status(404).json({
          ok: false,
          err: {
            message: "No existen arqueo en esta sucursal",
            start,
            end,
          },
        });
      }
      //Total de ventas
      let ventas = 0;
      let montoComprobantes = 0;
      let totalCosto = 0;
      let totalUtilidad = 0;
      let totalGasto = 0;
      let totalDeposito = 0;
      let ganancia = 0;
      let comprobantesGasto = [];
      let comprobantesDeposito = [];

      //CALCULAR LOS GASTOS
      //Los gastos son todos los comprobantes donde sale plata de la empresa

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
              totalGasto = totalGasto + Number(comprobante.monto);
              comprobantesGasto.push(comprobante);
            }
            if (comprobante.comprobante == "DEPOSITO") {
              totalDeposito = totalDeposito + Number(comprobante.monto);
              comprobantesDeposito.push(comprobante);
            }
            montoComprobantes = montoComprobantes + Number(comprobante.monto);
          }
        }
        ventas = ventas + arqueo.venta;
        totalCosto = totalCosto + arqueo.totalCosto;
        totalUtilidad = totalUtilidad + arqueo.totalUtilidad;
        ganancia = totalUtilidad - totalGasto;
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
          totalDeposito,
          montoComprobantes,
          ganancia,
          comprobantesGasto,
          comprobantesDeposito,
        });
      });
    });
});

module.exports = app;
