const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");


class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.productosPath = "/api/productos";
    this.loginPath = "/api/login";
    this.arqueosPath = "/api/arqueos";
    this.sucursalesPath = "/api/sucursales";
    //Conectar a BD
    this.connectBD();
    //middlewares
    this.middleware();

    //routes
    this.routes();
  }

  async connectBD() {
    await mongoose.connect(
      process.env.URLMONGODB,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      },
      (err, res) => {
        if (err) throw new err();
        console.log("Conectado a la Base de datos Seda Cosmética");
      }
    );
  }

  routes() {
    //Rutas de productos
    this.app.use(this.productosPath, require("../routes/productos"));

    //Rutas de Login
    this.app.use(this.loginPath, require("../routes/login"));

    //Rutas de arqueos
    this.app.use(this.arqueosPath, require("../routes/arqueos"));

    //Rutas de sucursales
    this.app.use(this.sucursalesPath, require("../routes/sucursal"));
  }

  middleware() {
    //CORDS
    this.app.use(cors());
    //Poder enviar JSON
    this.app.use(express.json());
  }

  listen() {
    try {
      this.app.listen(this.port, ()=>{
	console.log("Servidor montado en el puerto: ",this.port);
      });
      
    } catch (err) {
      console.log("ERROR!!! no se pudo iniciar el servidor", err);
    }
  }
}

module.exports = Server;
