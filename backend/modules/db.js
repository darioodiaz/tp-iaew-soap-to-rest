'use strict';

const db = require('./mongo-server');

module.exports = function(cb) {
	db.connect().then(() => {
		db.createModel('reservas', {
			CodigoReserva: String,
			FecahReserva: Date,
			Costo: Number,
			Estado: String,
			FechaCancelacion: Date,
			PrecioVenta: Number,
			IdVendedor: Number,
			IdCliente: Number
		});
		db.createModel('vendedores', {
			Id: Number,
			Apellido: String,
			Nombre: String,
			Documento: Number
		});
		db.createModel('clientes', {
			Id: Number,
			Apellido: String,
			Nombre: String
		});
		db.createModel('lugares', {
			Id: Number,
			Nombre: String
		});
		cb();
	}).catch( (err) => {
		console.log('Sin BD, se procede pero con advertencia');
		cb();
	});
};