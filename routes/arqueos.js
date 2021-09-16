const { Router } = require("express");

const {
  verificarToken,
  verificarAdminRol,
} = require("../middlewares/autenticacion");

const {
  getArqueos,
  getArqueo,
  setArqueo,
  deleteArqueo,
  setComprobantes,
  deleteComprobante,
  reportes,
  buscarComprobantes,
  nuevaBaseDatos,
  generarArqueos
} = require("../controllers/arqueos");

const router = Router();

router.get("/", [verificarToken], generarArqueos);//Generar arqueos de forma dinamica

router.get("/:id", [verificarToken], getArqueo);

router.post("/", [verificarToken, verificarAdminRol], setArqueo);

router.delete("/:id", [verificarToken, verificarAdminRol], deleteArqueo);

router.put("/comprobantes/:id", [verificarToken], setComprobantes);

router.put(
  "/comprobantes/eliminar/:id",
  [verificarToken, verificarAdminRol],
  deleteComprobante
);

//reportes
router.get("/reporte/ventas/:sucursal", [verificarToken], reportes);

//Busquedas
router.get("/comprobantes/buscar", [verificarToken], buscarComprobantes);

//Crear base de datos de comprobantes
router.get("/comprobantes/nueva-base-datos", [verificarToken, verificarAdminRol], nuevaBaseDatos);

module.exports = router;
