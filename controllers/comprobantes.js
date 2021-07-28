const { request, response } = require("express");
const { fechaFormatISODate } = require("../helpers/formatear-fecha");
const Comprobante = require("../models/comprobante");

const getComprobantes = async (req = request, res = response) => {
  try {
    let {
      desde = 0,
      hasta = 10,
      sucursal = undefined,
      fechaDesde = undefined,
      fechaHasta = undefined,
      comprobante = undefined,
    } = req.body;
    desde = parseInt(desde);
    hasta = parseInt(hasta);
    let condicion = {};
    if (sucursal) {
      condicion["sucursal"] = sucursal;
    }
    if (fechaDesde && fechaHasta) {
      let fecha1 = new Date(fechaDesde);
      let fecha2 = new Date(fechaHasta);
      condicion["fArqueo"] = {
        $gte: new Date(
          fechaFormatISODate(
            `${fecha1.getFullYear()}-${fecha1.getMonth()}-${fecha1.getDate()}`
          )
        ),
        $lte: new Date(
          fechaFormatISODate(
            `${fecha2.getFullYear()}-${fecha2.getMonth()}-${fecha2.getDate()}`
          )
        ),
      };
    }
    if (comprobante) {
      condicion["comprobante"] = comprobante;
    }
    let comprobantes = await Comprobante.find(condicion)
      .skip(desde)
      .limit(hasta);
    let cantidadComprobantes = await Comprobante.countDocuments(condicion);
    res.json({ cantidadComprobantes, comprobantes });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "ERROR!!! ocurrio un error en el servidor", err });
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
