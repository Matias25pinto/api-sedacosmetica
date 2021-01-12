const mongoose = require("mongoose"); // importar mongoose
const uniqueValidator = require("mongoose-unique-validator"); // importar uniqueValidator para validar valores unicos

let Schema = mongoose.Schema; // crear un schema que nos permite formatear nuestro documento

let motocrossSchema = new Schema({
  MX_1: {
    type: Boolean,
    required: [true, "La categoria MX_1 es obligatorio"],
  },
  MX_2: {
    type: Boolean,
    required: [true, "La categoria MX_2 es obligatorio"],
  },
  MX_JUNIOR: {
    type: Boolean,
    required: [true, "La categoria MX_JUNIOR es obligatorio"],
  },
  MX_3: {
    type: Boolean,
    required: [true, "La categoria MX_3 es obligatorio"],
  },
  MX_NOVICIOS: {
    type: Boolean,
    required: [true, "La categoria MX_NOVICIOS es obligatorio"],
  },
  MX_4: {
    type: Boolean,
    required: [true, "La categoria MX_4 es obligatorio"],
  },
  MX_INTERMEDIA: {
    type: Boolean,
    required: [true, "La categoria MX_INTERMEDIA es obligatorio"],
  },
  MX_5: {
    type: Boolean,
    required: [true, "La categoria MX_5 es obligatorio"],
  },
  MINICROSS: {
    type: Boolean,
    required: [true, "La categoria MINICROSS es obligatorio"],
  },
  MAMADERA: {
    type: Boolean,
    required: [true, "La categoria MAMADERA es obligatorio"],
  },
});
let velocrossSchema = new Schema({
  VX_NOVICIOS_NAC: {
    type: Boolean,
    required: [true, "La categoria VX_NOVICIOS_NAC es obligatorio"],
  },
  VX_SPORT: {
    type: Boolean,
    required: [true, "La categoria VX_SPORT es obligatorio"],
  },
  VX_DAMAS: {
    type: Boolean,
    required: [true, "La categoria VX_DAMAS es obligatorio"],
  },
  VX_INTERMEDIA_NAC: {
    type: Boolean,
    required: [true, "La categoria VX_INTERMEDIA_NAC es obligatorio"],
  },
  VX_1: {
    type: Boolean,
    required: [true, "La categoria VX_1 es obligatorio"],
  },
  VX_3: {
    type: Boolean,
    required: [true, "La categoria VX_3 es obligatorio"],
  },
  VX_EXPERTO_NAC_200CC: {
    type: Boolean,
    required: [true, "La categoria VX_EXPERTO_NAC_200CC es obligatorio"],
  },
  VX_OPEN_35FL: {
    type: Boolean,
    required: [true, "La categoria VX_OPEN_35FL es obligatorio"],
  },
  CAT_110K: {
    type: Boolean,
    required: [true, "La categoria CAT_110K es obligatorio"],
  },
  ATV_PRO_10: {
    type: Boolean,
    required: [true, "La categoria ATV_PRO_10 es obligatorio"],
  },
  ATV_OPEN_10: {
    type: Boolean,
    required: [true, "La categoria ATV_PRO_10 es obligatorio"],
  },
});
let companionSchema = new Schema({
  nombre: {
    type: String,
  },
  apellido: {
    type: String,
  },
  cedula: {
    type: Number,
  },
  celular: {
    type: Number,
  },
});
let aporteSchema = new Schema({
  comprobante: {
    type: Number,
  },
  formaPago: {
    type: String,
  },
  fecha: { type: String },
  monto: {
    type: Number,
  },
});
let participanteSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  apellido: {
    type: String,
    required: [true, "El apellido es obligatorio"],
  },
  cedula: {
    type: Number,
    unique: true, // indica que el campo es unico
    required: [true, "La cédula es obligatorio"], // indica que el campo es obligatorio
  },
  celular: {
    type: String,
    required: [true, "El celular es obligatorio"], // indica que el campo es obligatorio
  },
  correo: {
    type: String,
  },
  ciudad: {
    type: String,
    required: [true, "La ciudad es obligatorio"],
  },
  confirmado: {
    type: String,
    required: [true, "El estado es obligatorio"],
  },
  aporte: [aporteSchema],
  motocross: [motocrossSchema],
  velocross: [velocrossSchema],
  Companion1: [companionSchema],
  Companion2: [companionSchema],
  Companion3: [companionSchema],
});

participanteSchema.plugin(uniqueValidator, {
  message: "{PATH} debe de ser único",
}); // le decimos al Scheme que use un plugin
//mongoose.model(nombre_del_documento,El_modelo_a_ser_guardado)
//en el local = mongoose.model("ParticipantePrueba", participanteSchema)
//en el servidor = mongoose.model("Participante", participanteSchema)
module.exports = mongoose.model("Participantefinal", participanteSchema); // Exportar el modelo
