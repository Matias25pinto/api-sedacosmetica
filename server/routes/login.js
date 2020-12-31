const express = require("express"); // Importarmos express para poder hacer peticiones http

const bcrypt = require("bcrypt"); // Importamos bcrypt para poder comparar dos password encriptados

const jwt = require("jsonwebtoken"); // Importamos jwt para poder crear Json Web Tokens

const app = express();

const Usuario = require("../models/usuario"); // Importamos usuario para hacer peticiones a usuarios

app.post("/login", (req, res) => {
  let body = req.body;
  let condicion = {
    email: body.email,
  };
  Usuario.findOne(condicion, (err, usuarioBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!usuarioBD) {
      return res.status(400).json({
        ok: false,
        message: "(Usuario) o Contraseña incorrecta",
      });
    }
    if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
      return res.status(400).json({
        ok: false,
        ingresado: body.password,
        password: usuarioBD.password,
        message: "Usuario o (Contraseña) incorrecta",
      });
    }
    let token = jwt.sign(
      {
        usuarioBD,
      },
      "secret",
      { expiresIn: "1h" }
    );

    res.json({
      ok: true,
      token,
    });
  });
});

module.exports = app;
