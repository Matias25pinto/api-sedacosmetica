const express = require("express");

const cors = require("cors"); // cors, sirve para que cualquier front-end pueda hacer una petición a la API

const { verificaRol, verificaToken } = require("../middlewares/autenticacion");

const Arqueo = require("../models/arqueo");
const { countDocuments } = require("../models/arqueo");

const app = express();

app.use(cors()); //para utilizar el cors, de esta forma cualquiera puede hacer peticiones a nuestra api
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
  let condicion = {anulado: false,};
  if (usuario.role == "USER_ROLE") {
    let sucursal = usuario.sucursal;
    condicion = {
      anulado: false,
      sucursal,
    };
  } 
  Arqueo.find(condicion)
    .sort({fecha:'desc'})
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
app.put("/arqueo/sucursal/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;
  let usuarios = [];
  let montoCaja = body.montoCaja;
  let sobranteCaja = body.sobranteCaja;
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
      { usuarios, montoCaja, sobranteCaja },
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

app.put("/arqueo/comprobantes/eliminar/:id", [verificaToken, verificaRol], (req, res) => {
  
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

});

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

module.exports = app;
