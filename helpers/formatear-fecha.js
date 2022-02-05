//Funciones
/*Si es un array lo convierte a string*/
const stringFormat = (comprobante) => {
	//Se verifica el tipo de comprobante, si es un string, retorna el comprobante sin editar, si es distinto a string asume que es un array y retorna el primer elemento
	if (typeof comprobante !== "string") {
		try {
			return comprobante[0];
		} catch {
			return comprobante;
		}
	} else {
		return comprobante;
	}
};
/* Si un numero contiene puntos se extrae esos puntos, tambien si un monto esta en blanco se devuelve 0*/
const numberFormat = (monto) => {
	if (monto == "") {
		return 0;
	}
	if (monto.includes(".")) {
		let nuevoMonto = "";
		let inicio;
		let fin;
		while (monto.includes(".")) {
			inicio = 0;
			fin = monto.indexOf(".");
			if (nuevoMonto == "") {
				nuevoMonto = monto.substr(inicio, fin);
			} else {
				nuevoMonto = nuevoMonto + monto.substr(inicio, fin);
			}
			inicio = fin + 1;
			if (inicio > monto.length) {
				break;
			}
			monto = monto.substr(inicio);
		}
		nuevoMonto = nuevoMonto + monto;
		return parseInt(nuevoMonto);
	} else {
		return parseInt(monto);
	}
};
const fechaFormatISODate = (fechaString) => {
	
	/**
	 * Para poder resolver que la fecha generada en el servidor era T0 y la del local T3
	 * construi la fecha ISO con un T03 que es como esta guardado las fechas en la BD
	 * **/
	let arrelgoFecha = fechaString.split("-");
	let dd;
	if (arrelgoFecha[2].includes("T")) {
		let ddHora;
		ddHora = arrelgoFecha[2].split("T");
		dd = ddHora[0];
	} else {
		dd = arrelgoFecha[2];
	}

	let mm = arrelgoFecha[1];
	let yyyy = arrelgoFecha[0];
  
	if (dd < 10 && dd.length == 1) {
		dd = "0" + dd;
	}
	if (mm < 10 && mm.length == 1) {
		mm = "0" + mm;
	}
	let fecha = `${yyyy}-${mm}-${dd}T03:00:00.000Z`;
	return fecha;
};

const convertirT04 = (fechaString) => {
	/**
	 * Para poder resolver que la fecha generada en el servidor era T0 y la del local T3
	 * construi la fecha ISO con un T03 que es como esta guardado las fechas en la BD
	 * **/
	let arrelgoFecha = fechaString.split("-");
	let dd;
	if (arrelgoFecha[2].includes("T")) {
		let ddHora;
		ddHora = arrelgoFecha[2].split("T");
		dd = ddHora[0];
	} else {
		dd = arrelgoFecha[2];
	}

	let mm = arrelgoFecha[1];
	let yyyy = arrelgoFecha[0];

	if (dd < 10 && dd.length == 1) {
		dd = "0" + dd;
	}
	if (mm < 10 && mm.length == 1) {
		mm = "0" + mm;
	}
	let fecha = `${yyyy}-${mm}-${dd}T04:00:00.000Z`;
	return fecha;
};

const fechaQuery = (fecha) => {
	//agregamos zona horaria de paraguay
	let fechaString = fecha.toLocaleString("es-PY", {
		timeZone: "America/Asuncion",
	});
	//La fecha se convierte a un string que vamos transformando
	let fechaArray = fechaString.split("/");
	let yearHour = fechaArray[2].split(" ");
	let year = yearHour[0];
	let month = fechaArray[1];
	let day = fechaArray[0];
	if (month < 10) {
		month = "0" + month.toString();
	}
	if (day < 10) {
		day = "0" + day.toString();
	}
	return year.toString() + month + day;
};

module.exports = {
	stringFormat,
	numberFormat,
	fechaFormatISODate,
	fechaQuery,
	convertirT04,
};
