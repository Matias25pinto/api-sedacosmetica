const { request, response } = require("express");

const jwt = require("jsonwebtoken");

const validarPrecios = (req = request, res = response, next) => {
  let precios = [];
  let deposito = 5;//por defecto mandamos el id del deposito de la central
  let role = "";
  try {
    let token = req.get("token"); // de esta forma se lee los headers
    jwt.verify(token, process.env.SEED, (err, decode)=>{
      if(!err){
	precios = decode.usuarioBD.precios;
	deposito = decode.usuarioBD.deposito;
	role = decode.usuarioBD.role;
      }
      req.precios = precios;
      req.deposito = deposito;
      req.role = role;
    });
  } catch (err) {
    req.precios = precios;
    req.deposito = deposito;
    req.role = role;
  }
  next();
};

module.exports = { validarPrecios };
