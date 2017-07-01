const PREFIX = '/api';

const SOAP_SERVICES = {
    'CONSULTAR_PAISES': {
        soapService: 'ConsultarPaises',
        permissions: ['read', 'read_write']
    },
    'CONSULTAR_CIUDADES': {
        soapService: 'ConsultarCiudades',
        permissions: ['read', 'read_write']
    },
    'CONSULTAR_RESERVAS': {
        soapService: 'ConsultarReservas',
        permissions: ['read', 'read_write']
    },
    'VEHICULOS_DISPONIBLES': {
        soapService: 'ConsultarVehiculosDisponibles',
        permissions: ['read', 'read_write']
    },
    'RESERVAR_VEHICULO': {
        soapService: 'ReservarVehiculo',
        permissions: ['write', 'read_write']
    },
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