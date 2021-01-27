const express = require("express");

const app = express();

// Rutas de nuestra API
app.use(require("./usuario"));
app.use(require("./mxvxparaguay"));
app.use(require("./mercaderias"));
app.use(require("./ventas"));
app.use(require("./login"));
app.use(require("./arqueo"));
app.use(require("./sucursal"));

module.exports = app;
