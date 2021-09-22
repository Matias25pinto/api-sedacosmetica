const { Router } = require("express");
const { validarPrecios } = require("../middlewares/validar-campos");

const {
  productosMasVendidos,
  productosAgregados,
  productos,
  pruebas
} = require("../controllers/productos");

const router = Router();

router.get("/mas-vendidos", [], productosMasVendidos);

router.get("/nuevos-productos", [], productosAgregados);

router.get("/buscar", [validarPrecios], productos);

module.exports = router;
