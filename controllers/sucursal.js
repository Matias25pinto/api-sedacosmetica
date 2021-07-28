const { request, response } = require("express");

const Sucursal = require("../models/sucursal");

const getSucursales = (req = request, res = response) => {
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
};

const setSucursales = (req = request, res = response) => {
  let body = req.body;
  const sucursal = new Sucursal({
    titulo: body.titulo,
    codigosucursal: body.codigosucursal,
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
};

module.exports = { getSucursales, setSucursales };
