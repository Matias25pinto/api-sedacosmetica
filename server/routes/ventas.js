const express = require("express"); // importamos express
const app = express(); // creamos un objeto de tipo express

const Ventas = require("../models/ventas");

// hacer una peticion get
app.get("/ventas", function (req, res) {
  let codsucursal = req.query.codsucursal || 1;
  let fechaInicial = req.query.fechaInicial;
  let fechaFinal = req.query.fechaFinal;
  let ventaTotal = [];
  let sumaTotal = 0;
  const sumar = (accumulator, currentValue) => accumulator + currentValue; // callback que suma los valores
  Ventas.find({ codsucursal: codsucursal }).exec((err, venta) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    ventaTotal = venta.map((ven) => {
      return ven.pventa;
    });
    sumtaTotal = ventaTotal.reduce(sumar);
    res.json({ ok: true, codsucursal, total_venta: sumtaTotal });
  });
});

module.exports = app;
