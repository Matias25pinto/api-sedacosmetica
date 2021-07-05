const { Router } = require("express");

const {
  verificarToken,
  verificarAdminRol,
} = require("../middlewares/autenticacion");

const { getSucursales, setSucursales } = require("../controllers/sucursal");

const router = Router();

router.get("/", [], getSucursales);

router.post("/", [verificarToken, verificarAdminRol], setSucursales);

module.exports = router;
