const PREFIX = '/api';

const SOAP_SERVICES = {
    'CONSULTAR_PAISES': 'ConsultarPaises',
    'CONSULTAR_CIUDADES': 'ConsultarCiudades',
    'VEHICULOS_DISPONIBLES': 'ConsultarVehiculosDisponibles',
    'RESERVAR_VEHICULOS': 'ReservarVehiculo'
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