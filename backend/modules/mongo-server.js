'use strict';
const bluebird = require('bluebird');
const mongoose = require('mongoose');

let connectionAttempt = 0;

const server = {
	connect,
	createModel,
	getModel
};
let models = {};

function connect() {
	let promise = new bluebird((resolve, reject) => {
		mongoose.connect(`mongodb://${process.env.DB}/tpiaew`, checkConnectionStatus);

		function checkConnectionStatus(error) {
			console.log('DB', 'Conectando a la BD');
			if (error) {
				console.log('No se pudo conectar a la BD', error);
				connectionAttempt++;
				if (connectionAttempt > 5) {
					console.log('Se supero el maximo intento permitido');
					throw new Error('Se supero el maximo intento permitido');
				} else {
					console.log(`Intentando de nuevo en 5 segundos | Quedan ${5-connectionAttempt} intentos`);
					setTimeout( () => mongoose.connect(`mongodb://${process.env.DB}/tpiaew`, checkConnectionStatus), 5000);
				}
			} else {
				console.log('Conexion exitosa con la BD');
				resolve();
			}
		}
	});
	return promise;
}

function createModel(name, schema) {
	let _schema = mongoose.Schema(schema);
	models[name] = mongoose.model(name, _schema);
	return models[name];
}

function getModel(name, params) {
	let promise = new bluebird((resolve, reject) => {
		if (name in models) {
			if (params) {
				resolve(models[name](params));
			} else {
				resolve(models[name]);
			}
		} else {
			reject(`The model ${name} isn't defined.`);
		}
	});
	return promise;
}

module.exports = server;