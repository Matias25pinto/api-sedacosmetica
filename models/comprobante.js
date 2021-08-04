const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const comprobanteSchema = new Schema({
  sucursal: {
    type: Schema.Types.ObjectId,
    ref: "Sucursal",
    required: [true, "La sucursal es obligatoria"],
  },
  fArqueo: {
    type: Date,
    required: [true, "La fecha es obligatoria"],
  },
  monto: {
    type: Number,
    required: [true, "El monto es obligatorio"],
  },
  comprobante: {
    type: String,
    required: [true, "El comprobante es obligatorio"],
  },
  nis: {
    type: String,
    required: false,
  },
  fVencimiento: {
    type: Date,
    required: false,
  },
  nroComprobante: {
    type: String,
    required: false,
  },
  servicio: {
    type: String,
    required: false,
  },
  tipoComprobante: {
    type: String,
    required: false,
  },
  observacion: {
    type: String,
    required: false,
  },
  impuesto: {
    type: String,
    required: false,
  },
  nombreApellido: {
    type: String,
    required: false,
  },
  cedula: {
    type: String,
    required: false,
  },
  cargo: {
    type: String,
    required: false,
  },
  comercial: {
    type: String,
    required: false,
  },
  insumos: {
    type: String,
    required: false,
  },
  autorizaNA: {
    type: String,
    required: false,
  },
  autorizaCI: {
    type: String,
    required: false,
  },
  retiraNA: {
    type: String,
    required: false,
  },
  retiraCI: {
    type: String,
    required: false,
  },
  motivo: {
    type: String,
    required: false,
  },
  banco: {
    type: String,
    required: false,
  },
  cuentaBancaria: {
    type: String,
    required: false,
  },
  boleta: {
    type: String,
    required: false,
  },
  cuentaNro: {
    type: String,
    required: false,
  },
  chequeNro: {
    type: String,
    required: false,
  },
  paguese: {
    type: String,
    required: false,
  },
  empleadoNA: {
    type: String,
    required: false,
  },
  empleadoCI: {
    type: String,
    required: false,
  },
  fDeposito: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Comprobante", comprobanteSchema);

