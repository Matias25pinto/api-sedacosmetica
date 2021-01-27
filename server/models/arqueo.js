const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const usuarios = {
  type: Schema.Types.ObjectId,
  ref: "Usuario",
};

const arqueoSchema = new Schema({
  sucursal: {
    type: Schema.Types.ObjectId,
    ref: "Sucursal",
    required: [true, "La sucursal es obligatoria"],
  },
  fecha: {
    type: Date,
    required: [true, "La fecha es obligatoria"],
  },
  venta: {
    type: Number,
    required: [true, "El totalVenta es obligatorio"],
  },
  montoCaja: {
    type: Number,
    required: false,
    default: 0,
  },
  sobranteCaja: {
    type: Number,
    required: false,
    default: 0,
  },
  comprobantes: {
    type: Array,
    required: false,
  },
  totalCosto: {
    type: Number,
    required: [true, "El totalCosto es obligatorio"],
  },
  totalUtilidad: {
    type: Number,
    require: [true, "El totalUtilidad es obligatorio"],
  },
  usuarios: [usuarios],
  anulado: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Arqueo", arqueoSchema);
