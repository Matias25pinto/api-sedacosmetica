const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const SucursalSchema = new Schema({
  titulo: {
    type: String,
    required: [true, "El titulo es obligatorio"],
    unique: true,
  },
  codigosucursal: {
    type: Number,
    required: [true, "El codigosucursal es obligatorio"],
  },
  direccion: {
    type: String,
    required: [true, "La dirección es obligatoria"],
  },
  tel: {
    type: String,
    required: [true, "El telefono es obligatorio"],
  },
  cel: {
    type: String,
    required: [true, "El celular es obligatorio"],
  },
  correo: {
    type: String,
    required: [true, "El correo es obligatorio"],
  },
  img: {
    type: String,
    required: [true, "El img es obligatorio"],
  },
});

mongoose.plugin(uniqueValidator, {
  message: "{PATH} debe de ser único",
});

module.exports = mongoose.model("Sucursal", SucursalSchema);
