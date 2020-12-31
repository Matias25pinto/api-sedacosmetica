require("./config/config"); // leer el archivo confi, y ejecutarlo, para poder usar las variables globales

const mongoose = require("mongoose"); // importar mongoose, para conectar con la BD

const express = require("express"); // importar express, para trabajar con esta libreria de Node

const app = express();

const bodyParser = require("body-parser"); // Es un paquete que nos permite leer lo enviado en el body
const { use } = require("./routes/usuario");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); // es un middleware

// parse application/json
app.use(bodyParser.json()); // es un middleware

// configuración de rutas
app.use(require("./routes/index"));

// Conectar a MongoDB
mongoose.connect(
  process.env.URLDB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err, res) => {
    if (err) throw new err();

    console.log("Conectado a la Base de datos sedaCosmetico");
  }
);

// Le indicamos a express en que puerto se encuentra app

app.listen(process.env.PORT, () => {
  console.log(`La app esta conectado al puerto ${process.env.PORT}`);
});
