const PREFIX = '/api';

const SOAP_SERVICES = {
    'PAISES': 'ConsultarPaises',
    'CIUDADES': 'ConsultarCiudades'
};

const Utils = {
    PREFIX,
    SOAP_SERVICES,
    buildEndpoint,
    debugMiddleware
};

function debugMiddleware(req, res, next) {
    console.log('WARNING: Debug Mode for api requests!');
    next();
}

function buildEndpoint(route) {
    return `${PREFIX}/${route}`;
}

module.exports = Utils;