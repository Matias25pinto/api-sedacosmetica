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
      let fecha1 = new Date(fechaFormatISODate(fechaDesde));
      let fecha2 = new Date(fechaFormatISODate(fechaHasta));
      condicion["fArqueo"] = {
        $gte: fecha1,
        $lte: fecha2,
      };
    }
    if (comprobante) {
      condicion["comprobante"] = comprobante;
    }
    let comprobantes = await Comprobante.find(condicion)
      .sort({ fArqueo: -1 })
      .skip(desde)
      .limit(hasta);
    let cantidadComprobantes = await Comprobante.countDocuments(condicion);
    res.json({ cantidadComprobantes, comprobantes });
  } catch (err) {
    console.log("ERROR!!!", err);
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
    let data = req.body;
    data.fArqueo = fechaFormatISODate(data.fArqueo);
    console.log(data);
    let comprobante = new Comprobante(data);
    let comprobanteBD = await comprobante.save();
    res.json(comprobanteBD);
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
    const id = req.params.id;
    let comprobanteEliminado = await Comprobante.findByIdAndDelete(id);
    res.json(comprobanteEliminado);
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
