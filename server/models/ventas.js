const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator"); // importar uniqueValidator para validar valores unicos

let Schema = mongoose.Schema; // crear un schema que nos permite formatear nuestro documento

let ventasSchema = new Schema({
  codsucursal: {
    type: Number,
    unique: true, // indica que el campo es unico
    required: [true, "El codigo sucursal es obligatorio"], // indica que el campo es obligatorio
  },
  sucursal: {
    type: String,
    required: [true, "La sucursal es obligatorio"],
  },
  idvendedor: {
    type: Number,
    required: [true, "El idvendedor  es obligatorio"],
  },
  vendedor: {
    type: String,
    required: [true, "El vendedor es obligatorio"],
  },
  codlinea: {
    type: Number,
    required: [true, "El codigo de linea es obligatorio"],
  },
  linea: {
    type: String,
  },
  idfamilia: {
    type: Number,
  },
  familia: {
    type: String,
  },
  idmarca: {
    type: Number,
  },
  marca: {
    type: String,
  },
  fecha: {
    type: Date,
  },
  documento: {
    type: Number,
  },
  codcliente: {
    type: Number,
  },
  razonsocial: {
    type: String,
  },
  ruc: {
    type: String,
  },
  id: {
    type: Number,
  },
  codigo: {
    type: Number,
  },
  codigobarra: {
    type: Number,
  },
  producto: {
    type: String,
  },
  nivelprecio: {
    type: Number,
  },
  precioneto: {
    type: Number,
  },
  descuento: {
    type: Number,
  },
  pcosto: {
    type: Number,
  },
  cantidad: {
    type: Number,
  },
  pventa: {
    type: Number,
  },
});
ventasSchema.plugin(uniqueValidator, {
  message: "{PATH} debe de ser único",
}); // le decimos al Scheme que use un plugin

module.exports = mongoose.model("Ventas", ventasSchema); // Exportar el modelo
