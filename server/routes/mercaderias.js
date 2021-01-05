const express = require("express"); // importamos express

const cors = require("cors"); // cors, sirve para que cualquier front-end pueda hacer una petición a la API

const app = express(); // creamos un objeto de tipo express

app.use(cors()); //para utilizar el cors, de esta forma cualquiera puede hacer peticiones a nuestra api

const Mercaderia = require("../models/mercaderia");

// hacer una peticion get
app.get("/mercaderias", function (req, res) {
  let desde = req.query.desde | 0;
  desde = Number(desde);
  let limite = req.query.limite | 20;
  limite = Number(limite);

  Mercaderia.find()
    .sort({ codigo: "desc" })
    .skip(desde)
    .limit(limite)
    .exec((err, mercaderias) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          error: err,
        });
      }
      Mercaderia.countDocuments({}, (err, cantidad) => {
        let paginas = Math.ceil(cantidad / limite);
        let pagina =
          Math.ceil(cantidad / limite) - Math.ceil((cantidad - desde) / limite);
        pagina = pagina + 1;
        res.json({
          ok: true,
          mercaderias,
          pagina,
          paginas,
        });
      });
    });
});
// hacer una peticion get de las ultimas mercaderias
app.get("/mercaderias/ultimas", function (req, res) {
  let desde = req.query.desde | 0;
  desde = Number(desde);
  let limite = req.query.limite | 10;
  limite = Number(limite);

  Mercaderia.find()
    .sort({ codigo: "desc" })
    .skip(desde)
    .limit(limite)
    .exec((err, mercaderias) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          error: err,
        });
      }
      Mercaderia.countDocuments({}, (err, cantidad) => {
        let paginas = Math.ceil(cantidad / limite);
        let pagina =
          Math.ceil(cantidad / limite) - Math.ceil((cantidad - desde) / limite);
        pagina = pagina + 1;
        res.json({
          ok: true,
          mercaderias,
          pagina,
          paginas,
        });
      });
    });
});
// hacer una peticion de las mercaderias más vendidas
app.get("/mercaderias/masvendidas", function (req, res) {
  let desde = req.query.desde | 0;
  desde = Number(desde);
  let limite = req.query.limite | 20;
  limite = Number(limite);

  Mercaderia.find({
    codigo: [4833, 974, 10985, 205, 974, 47, 3662, 12613, 11131],
  })
    .skip(desde)
    .limit(limite)
    .exec((err, mercaderias) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          error: err,
        });
      }
      Mercaderia.countDocuments(
        {
          codigo: [4833, 974, 10985, 205, 974, 47, 3662, 12613, 11131],
        },
        (err, cantidad) => {
          let paginas = Math.ceil(cantidad / limite);
          let pagina =
            Math.ceil(cantidad / limite) -
            Math.ceil((cantidad - desde) / limite);
          pagina = pagina + 1;
          res.json({
            ok: true,
            mercaderias,
            pagina,
            paginas,
          });
        }
      );
    });
});
// El filtro de find funciona
app.get("/mercaderia", function (req, res) {
  let codigo = req.query.codigo;
  codigo = Number(codigo);
  let codigobarra = req.query.codigobarra;
  codigobarra = Number(codigobarra);
  let busqueda;
  if (codigo) {
    busqueda = Mercaderia.find({ codigo: codigo });
  } else {
    busqueda = Mercaderia.find({ codigobarra: codigobarra });
  }
  busqueda.exec((err, mercaderia) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        error: err,
      });
    }
    res.json({
      ok: true,
      mercaderia,
    });
  });
});

//Buscar Mercaderias
app.get("/mercaderias/buscar/:termino", (req, res) => {
  let termino = req.params.termino;
  let regex = new RegExp(termino, "i"); //Creamos una expresion regular de nuestro termino de busqueda, de esta forma se realiza las busquedas
  //Se usa query cunado no es un parametro obligatorio
  var desde = req.query.desde | 0;
  desde = Number(desde);
  let limite = 10;

  Mercaderia.find({ productonombre: regex })
    .skip(desde)
    .limit(limite)
    .exec((err, mercaderiasBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!mercaderiasBD) {
        return res.status(500).json({
          ok: false,
          err: {
            message: "No existe mercaderia",
          },
        });
      }
      Mercaderia.countDocuments({ productonombre: regex }, (err, cantidad) => {
        let paginas = Math.ceil(cantidad / limite);
        let pagina = cantidad - desde;
        pagina = Math.ceil(pagina / limite);
        pagina = paginas - pagina + 1;
        res.status(200).json({
          ok: true,
          mercaderias: mercaderiasBD,
          pagina,
          paginas,
        });
      });
    });
});
//Filtrar Mercaderias por MARCA
app.get("/mercaderias/marca/:marca", (req, res) => {
  let marca = req.params.marca;
  let desde = req.query.desde | 0;
  desde = Number(desde);
  let limite = 20;

  Mercaderia.find({ marcanombre: marca })
  	.sort({ codigo: "desc" })
    .exec((err, mercaderias) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (mercaderias.length == 0) {
        return res.status(500).json({
          ok: false,
          err: {
            message: "La marca no existe",
          },
        });
      }
      res.json({
        ok: true,
        mercaderias,
      });
    });
});

module.exports = app;
