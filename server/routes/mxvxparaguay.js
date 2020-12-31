const express = require("express"); // importamos express

const cors = require("cors"); // cors, sirve para que cualquier front-end pueda hacer una petición a la API

const _ = require("underscore"); // por standar el undercore se usa _, vamos utilizar una funcion que permite filtrar elementos de un objeto

const app = express(); // creamos un objeto de tipo express

app.use(cors()); //para utilizar el cors, de esta forma cualquiera puede hacer peticiones a nuestra api

const Participante = require("../models/participante");
// hacer una peticion get

app.get("/participantes", function (req, res) {
  var condicion = "";
  if (req.query.categoria && req.query.modalidad) {
    let categoria = req.query.categoria;
    let modalidad = req.query.modalidad;
    condicion = `${categoria}.${modalidad}`;
  }
  //de esta es la forma de construir un objeto de forma dinamica

  let myObj = {};
  if (condicion != "") {
    let foo = condicion;
    let bar = true;
    myObj[foo] = bar;
  }
  Participante.find(myObj).exec((err, participantes) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        error: err,
      });
    }
    Participante.countDocuments(myObj, (err, conteo) => {
      res.json({
        ok: true,
        participantes,
        totalParticipantes: conteo,
      });
    });
  });
});
app.get("/participante", function (req, res) {
  let cedula = req.query.cedula || 0;
  cedula = Number(cedula);
  condicion = {
    cedula,
  };

  Participante.find(condicion).exec((err, participante) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        error: err,
      });
    }
    res.status(200).json({
      ok: true,
      participante,
    });
  });
});

app.post("/participante", async (req, res) => {
  let body = req.body; // OBTIENE la informacion que viene en el BODY, FUNCIONA PARA POST, PUT, Y DELETE
  // crear el objeto que se va enviar en la base de datos
  let participante = new Participante({
    nombre: body.nombre,
    apellido: body.apellido,
    cedula: body.cedula,
    celular: body.celular,
    correo: body.correo,
    ciudad: body.ciudad,
    confirmado: body.confirmado,
    aporte: body.aporte,
    motocross: body.motocross,
    velocross: body.velocross,
    Companion1: body.Companion1,
    Companion2: body.Companion2,
    Companion3: body.Companion3,
  }); // crea un nuevo usuario con el Schema
  // Guardamos en la base de datos el usuario creado
  participante.save((err, participanteBD) => {
    //CARGAR A BD
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    } else {
      // actualice agregando return al los res
      return res.json({
        ok: true,
        participante: participanteBD,
      });
    }
  });
});
//Obtener la cantidades de forma dinamica
app.get("/participantes/cantidades", function (req, res) {
  let categoria = req.query.categoria || "motocross";
  let modalidad = req.query.modalidad || "MX_1";
  let moto = `${categoria}.${modalidad}`;
  //de esta es la forma de construir un objeto de forma dinamica
  let foo = moto,
    bar = true;

  let myObj = {};

  myObj[foo] = bar;
  //Verificar cupos
  Participante.countDocuments(myObj, (err, count) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    } else {
      return res.status(200).json({
        ok: true,
        cantidad: count,
        massage: "aún hay cupos",
      });
    }
  });
});
app.delete("/participante/:id", (req, res) => {
  let id = req.params.id; // para obtener el parametro que viene por url
  // Eliminar el usuario fisicamente de la BD
  Participante.findByIdAndRemove(id, (err, participanteBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!participanteBorrado) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El id no existe",
        },
      });
    }
    res.json({
      ok: true,
      participante: participanteBorrado,
    });
  });
});
app.put("/participante/:id", function (req, res) {
  let id = req.params.id; // para obtener el parametro
  let body = _.pick(req.body, ["confirmado"]); //la funcion pick de undercore, permite filtrar solo las propiedades que quiero del objeto
  // findByIdAndUpdate actualiza el usuario usando el id como filtro
  Participante.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, participanteBD) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      return res.json({
        ok: true,
        participante: participanteBD,
      });
    }
  );
});
module.exports = app;
