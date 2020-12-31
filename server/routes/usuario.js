const express = require("express"); //Para poder utilizar el framework de express

const bcrypt = require("bcrypt"); //Para poder encriptar el password

const _ = require("underscore"); //Para poder filtrar los elementos de un objeto

const app = express(); //El objeto de express()
const { verificaToken, verificaRol } = require("../middlewares/autenticacion");
const Usuario = require("../models/usuario"); // Para poder usar el Schema de mongoose

app.get("/usuarios", [verificaToken], (req, res) => {
  let condicion = {
    estado: true,
  };
  let desde = req.query.desde || 0;
  desde = Number(desde);
  let limite = req.query.limite || 5;
  limite = Number(limite);

  Usuario.find(condicion)
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      Usuario.countDocuments(condicion, (err, conteo) => {
        res.json({
          ok: true,
          usuarios,
          totalUsuarios: conteo,
        });
      });
    });
});

app.post("/usuario", [verificaToken, verificaRol], (req, res) => {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    apellido: body.apellido,
    cedula: body.cedula,
    ruc: body.ruc,
    celular: body.celular,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role,
  });

  usuario.save((err, usuarioBD) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      usuario: usuarioBD,
    });
  });
});

app.put("/usuario/:id", [verificaToken, verificaRol], (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, [
    "nombre",
    "apellido",
    "cedula",
    "celular",
    "email",
    "img",
    "role",
    "estado",
  ]); //la funcion pick de undercore, permite filtrar solo las propiedades que quiero del objeto

  Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioUpdate) => {
    if (err) {
      res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      message: "Usuario Actualizado",
      usuario: usuarioUpdate,
    });
  });
});

app.delete("/usuario/:id", [verificaToken, verificaRol], (req, res) => {
  let id = req.params.id;
  let cambiarEstado = {
    estado: false,
  };
  //obse {new:true} devuelve el objeto nuevo, y {new:false} devuelve el objeto antes de ser actualizado
  Usuario.findByIdAndUpdate(
    id,
    cambiarEstado,
    { new: true },
    (err, usuarioEliminado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      if (!usuarioEliminado) {
        return res.status(404).json({
          ok: false,
          message: "El id no existe",
        });
      }
      res.json({
        ok: true,
        message: "Usuario Eliminado",
        usuario: usuarioEliminado,
      });
    }
  );
});

module.exports = app;
