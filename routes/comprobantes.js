const { Router } = require("express");

const { check } = require("express-validator");

const {
	validarIdMongoose,
	validarChecks,
	validarIMG,
} = require("../middlewares/validar-campos");

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
	cambiarBancoNroCuenta,
	actualizarImagen,
} = require("../controllers/comprobantes");

const router = Router();

router.get(
	"/cambiar-bancos",
	[verificarToken, verificarAdminRol],
	cambiarBancoNroCuenta
);

router.get("/", [verificarToken], getComprobantes);

router.get("/:id", [verificarToken], getComprobante);

router.post("/", [verificarToken, validarIMG], crearComprobante);

router.put(
	"/actualizar-img/:id",
	[verificarToken, validarIdMongoose, validarIMG],
	actualizarImagen
);

router.delete("/:id", [verificarToken, validarIdMongoose], eliminarComprobante);

module.exports = router;
