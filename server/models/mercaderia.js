const mongoose = require("mongoose"); // importar mongoose
const uniqueValidator = require("mongoose-unique-validator"); // importar uniqueValidator para validar valores unicos

let Schema = mongoose.Schema; // crear un schema que nos permite formatear nuestro documento

let mercaderiaSchema = new Schema({
  codigo: {
    type: Number,
    unique: true, // indica que el campo es unico
    required: [true, "El codigo es obligatorio"], // indica que el campo es obligatorio
  },
  codigobarra: {
    type: Number,
    required: [true, "El codigo de barra es obligatorio"],
  },
  productonombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  linea: {
    type: Number,
    required: [true, "La linea es obligatoria"],
  },
  lineanombre: {
    type: String,
    required: [true, "El  nombre de la linea es obligatoria"],
  },
  marca: {
    type: String,
    required: [true, "La marca es obligatoria"],
  },
  marcanombre: {
    type: String,
    required: [true, "El nombre de la marca es obligatorio"],
  },
  familia: {
    type: Number,
  },
  familianombre: {
    type: String,
  },
  referencia: {
    type: Number,
  },
  bo: {
    type: Number,
  },
  pcosto: {
    type: Number,
  },
  pcostod: {
    type: Number,
  },
  precio1: {
    type: Number,
  },
  precio2: {
    type: Number,
  },
  precio3: {
    type: Number,
  },
  precio4: {
    type: Number,
  },
  precio5: {
    type: Number,
  },
  precio6: {
    type: Number,
  },
  precio7: {
    type: Number,
  },
  precio8: {
    type: Number,
  },
  precio9: {
    type: Number,
  },
  precio10: {
    type: Number,
  },
  precio11: {
    type: Number,
  },
  precio12: {
    type: Number,
  },
  precio13: {
    type: Number,
  },
  precio14: {
    type: Number,
  },
  precio15: {
    type: Number,
  },
  precio16: {
    type: Number,
  },
  precio17: {
    type: Number,
  },
  precio18: {
    type: Number,
  },
  precio19: {
    type: Number,
  },
  precio20: {
    type: Number,
  },
});

mercaderiaSchema.plugin(uniqueValidator, {
  message: "{PATH} debe de ser único",
}); // le decimos al Scheme que use un plugin

module.exports = mongoose.model("Mercaderia", mercaderiaSchema); // Exportar el modelo
