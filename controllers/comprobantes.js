const { request, response } = require("express");
const Comprobante = require("../models/comprobante");

const getComprobantes = async (req = request, res = response) => {
  try {
    let comprobantes = await Comprobante.find();
    let cantidadComprobantes = await Comprobante.countDocuments();
    res.json({ cantidadComprobantes, comprobantes });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "ERROR!!! ocurrio un error en el servidor" });
  }
};

const getComprobante = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const comprobante = await Comprobante.findById(id);
    res.json(comprobante);
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "ERROR!!! ocurrio un error en el servidor" });
  }
};

const crearComprobante = async (req = request, res = response) => {
  try {
    res.json({ msg: "Funciona el controlador de crearComprobante" });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "ERROR!!! ocurrio un error en el servidor" });
  }
};

const modificarComprobante = async (req = request, res = response) => {
  try {
    res.json({ msg: "Funciona el controlador de modificarComprobante" });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "ERROR!!! ocurrio un error en el servidor" });
  }
};

const eliminarComprobante = async (req = request, res = response) => {
  try {
    res.json({ msg: "Funciona el controlador de eliminarComprobante" });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "ERROR!!! ocurrio un error en el servidor" });
  }
};

module.exports = {
  getComprobantes,
  getComprobante,
  crearComprobante,
  modificarComprobante,
  eliminarComprobante,
};
