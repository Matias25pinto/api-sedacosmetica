const { request, response } = require("express");

const bcrypt = require("bcrypt"); // Importamos bcrypt para poder comparar dos password encriptados

const jwt = require("jsonwebtoken"); // Importamos jwt para poder crear Json Web Tokens

const Usuario = require("../models/usuario"); // Importamos usuario para hacer peticiones a usuarios

const iniciarSesion = (req = request, res = response) => {
  let { email, password } = req.body;

  let condicion = {
    email,
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
        msg: "Usuario o Contraseña incorrecta",
      });
    }
    if (!bcrypt.compareSync(password, usuarioBD.password)) {
      return res.status(400).json({
        msg: "Usuario o Contraseña incorrecta",
      });
    }
    console.log(usuarioBD);
    let token = jwt.sign(
      {
        usuarioBD,
      },
      process.env.SEED,
      { expiresIn: "12h" }
    );

    res.json({ token });
  });
};

module.exports = { iniciarSesion };
