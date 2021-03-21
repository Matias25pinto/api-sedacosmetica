const express = require("express");

const cors = require("cors"); // cors, sirve para que cualquier front-end pueda hacer una petición a la API

const { verificaRol, verificaToken } = require("../middlewares/autenticacion");

const Arqueo = require("../models/arqueo");
const Sucursal = require("../models/sucursal");
const { find } = require("../models/arqueo");

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
  let fechaBody = new Date(body.fecha);
  let yyyy = fechaBody.getFullYear();
  let MM = fechaBody.getMonth();
  let dd = fechaBody.getDate();
  let fecha = new Date(fecha_formatISODate(`${yyyy}-${MM + 1}-${dd}`));
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
  let fechaBody = new Date(body.fecha);
  let yyyy = fechaBody.getFullYear();
  let MM = fechaBody.getMonth();
  let dd = fechaBody.getDate();
  let fecha = new Date(fecha_formatISODate(`${yyyy}-${MM + 1}-${dd}`));
  body.fecha = fecha;
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

app.get("/arqueo/reporte/ventas/:sucursal", (req, res) => {
  let sucursal = req.params.sucursal;

  //calcular rango de fecha

  let start = fecha_formatISODate(req.get("start"));

  let end = fecha_formatISODate(req.get("end"));

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
                totalGasto = totalGasto + Number(comprobante.monto);
                comprobantesGasto.push(comprobante);
              }
              if (comprobante.comprobante == "RETIRO") {
                totalRetiro = totalRetiro + Number(comprobante.monto);
                comprobanteRetiro.push(comprobante);
              }
              if (comprobante.comprobante == "TARJETA") {
                totalTarjeta = totalTarjeta + Number(comprobante.monto);
                comprobanteTarjeta.push(comprobante);
              }
              if (comprobante.comprobante == "CHEQUE") {
                totalCheque = totalCheque + Number(compronbate.monto);
                comprobanteCheque.push(comprobante);
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
});
//Funciones
function fecha_formatISODate(fechaString) {
  /**
   * Para poder resolver que la fecha generada en el servidor era T0 y la del local T3
   * construi la fecha ISO con un T03 que es como esta guardado las fechas en la BD
   * **/
  let arrelgoFecha = fechaString.split("-");
  let dd = arrelgoFecha[2];
  let mm = arrelgoFecha[1];
  let yyyy = arrelgoFecha[0];

  if (dd < 10 && dd.length == 1) {
    dd = "0" + dd;
  }
  if (mm < 10 && mm.length == 1) {
    mm = "0" + mm;
  }
  let fecha = `${yyyy}-${mm}-${dd}T03:00:00.000Z`;
  return fecha;
}
//Pruebas
//buscar T4
app.get("/buscar", (req, res) => {
  Arqueo.find().exec((err, arqueosBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    let fechas = [];
    for (const arqueo of arqueosBD) {
      let cadenaFecha = new String(arqueo.fecha);

      if (fechas.indexOf(cadenaFecha) < 0) {
        fechas.push(cadenaFecha);
      }
    }

    res.status(200).json({
      ok: true,
      fechas,
    });
  });
});

//Cambiar el T3 a T0
app.get("/cambiarT", (req, res) => {
  Arqueo.find().exec((err, arqueosBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    let fechas = [];
    let fechaprueba = [];
    for (const arqueo of arqueosBD) {
      let fecha = new Date(arqueo.fecha);
      let dd = fecha.getDate();
      let MM = fecha.getMonth();
      let yyyy = fecha.getFullYear();

      let fechaISO = fecha_formatISODate(`${yyyy}-${MM + 1}-${dd}`);

      let newFecha = new Date(fechaISO);
      let options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      if (dd == "24" && MM + 1 == "2") {
        fechaprueba.push(arqueo.fecha);
        fechaprueba.push(fecha);
        fechaprueba.push(fechaISO);
        fechaprueba.push(fecha.toLocaleString("py-PY", options));
        fechaprueba.push(newFecha.toLocaleString("us-US", options));
      }

      fechas.push(newFecha.toLocaleString("py-PY", options));
    }

    res.status(200).json({
      ok: true,
      fechaprueba,
    });
  });
});

module.exports = app;
