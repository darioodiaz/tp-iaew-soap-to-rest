'use strict';
const bluebird = require('bluebird');
const mongoose = require('mongoose');

const server = {
	connect,
	createModel,
	getModel,
	getSyncModel
};
let models = {};

function connect() {
	let promise = new bluebird((resolve, reject) => {
		mongoose.connect('mongodb://tpiaew-db/tpiaew', checkConnectionStatus);

		function checkConnectionStatus(error) {
			if (error) {
				console.log('DB:', `No se pudo conectar a la BD ${error}`);
			} else {
				console.log('DB', 'MongoDB connection successfully');
				resolve(true);
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