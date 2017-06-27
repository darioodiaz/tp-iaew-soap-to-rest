const Authorization = require('../auth.js');
const Soap = require('../soap');
const Router = require('restify-router').Router;
const Utils = require('../utils');
const fs = require('fs');

let DEBUG;

let apiRouter = new Router();

function setDebug(debug) {
    DEBUG = debug;
}
function createApis() {
    let apis = fs.readdirSync('./modules/apis').filter((file) => file.match(/\.api\.js$/i) !== null);

    console.log('Apis', apis);

    apis.forEach((apiFile) => {
        require(`./${apiFile}`)(apiRouter, Soap, Authorization, Utils, DEBUG);
    });
}
function applyRoutes(server) {
    apiRouter.applyRoutes(server);
}

module.exports = {
    setDebug,
    createApis,
    applyRoutes
};