const xml2js = require('xml2js').parseString;

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
    'CANCELAR_RESERVA': {
        soapService: 'CancelarReserva',
        permissions: ['read', 'read_write']
    }
};

function parseError(soapError, res) {
    xml2js(soapError.body, (err, result) => {
        //console.log('Soap Error', result['s:Envelope']['s:Body'][0]['s:Fault']);
        onError(result['s:Envelope']['s:Body'][0]['s:Fault'], res);
    });
}

function onError(soapErrors, res) {
    let errors = soapErrors.map( (error) => {
        return {
            code: error.detail[0].StatusResponse[0].ErrorCode[0],
            error: error.detail[0].StatusResponse[0].ErrorDescription[0]
        };
    });
    let errorAsString = errors.map( (error) => error.error ).join('\n');
    console.log('Error:', errores);
    res.send(500, { error: errorAsString, errors  });
}

function debugMiddleware(req, res, next) {
    console.log('WARNING: Debug Mode for api requests!');
    next();
}

function buildEndpoint(route) {
    return `${PREFIX}/${route}`;
}

const Utils = {
    PREFIX,
    SOAP_SERVICES,
    buildEndpoint,
    debugMiddleware,
    parseError
};

module.exports = Utils;