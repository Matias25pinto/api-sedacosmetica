const { Router } = require("express");

const {
  verificarToken,
  verificarAdminRol,
} = require("../middlewares/autenticacion");

const {
  getComprobantes,
  getComprobante,
  crearComprobante,
  modificarComprobante,
  eliminarComprobante,
} = require("../controllers/comprobantes");

const router = Router();

router.get("/", [verificarToken], getComprobantes);

router.get("/:id", [verificarToken], getComprobante);

router.post("/", [verificarToken], crearComprobante);

router.put("/:id", [verificarToken, verificarAdminRol], modificarComprobante);

router.delete("/:id", [verificarToken, verificarAdminRol], eliminarComprobante);

module.exports = router;
