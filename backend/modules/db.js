'use strict';

const db = require('./mongo_server');

module.exports = function(cb) {
	db.connect().then(() => {
		db.createModel('reserva', {
			CodigoReserva: String,
			FecahReserva: Date,
			Costo: Number,
			PrecioVenta: Number,
			IdVendedor: Number,
			IdCliente: Number
		});
		cb();
	}).catch( (err) => process.exit(101));
};