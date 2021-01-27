const express = require("express");

const { verificaRol, verificaToken } = require("../middlewares/autenticacion");

const Sucursal = require("../models/sucursal");

const cors = require("cors"); // cors, sirve para que cualquier front-end pueda hacer una petición a la API

const app = express();

app.use(cors()); //para utilizar el cors, de esta forma cualquiera puede hacer peticiones a nuestra api

app.get("/sucursales", (req, res) => {
  Sucursal.find().exec((err, sucursalesBD) => {
    if (err) {
      res.status(500).json({
        ok: false,
        err,
      });
    }
    res.status(200).json({
      ok: true,
      sucursalesBD,
    });
  });
});

app.post("/sucursal", [verificaToken, verificaRol], (req, res) => {
  let body = req.body;
  const sucursal = new Sucursal({
    titulo: body.titulo,
    direccion: body.direccion,
    tel: body.tel,
    cel: body.cel,
    correo: body.correo,
    img: body.img,
  });

  sucursal.save((err, sucursalBD) => {
    if (err) {
      res.status(500).json({
        ok: false,
        err,
      });
    }
    res.status(200).json({
      ok: true,
      sucursalBD,
      usuario: req.usuario,
    });
  });
});
module.exports = app;
