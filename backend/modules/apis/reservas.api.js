let requestParams = { ConsultarReservasRequest: {} };

function buildsApis(apiRouter, Soap, Authorization, Utils, DEBUG) {
    apiRouter.get(Utils.buildEndpoint('reservas'), DEBUG ? Utils.debugMiddleware : Authorization.validateRequest, (req, res, next) => {
        let incluirBajas = !!req.query.incluirBajas;
        
        requestParams.ConsultarReservasRequest.IncluirCanceladas = incluirBajas;
        Soap(Utils.SOAP_SERVICES.CONSULTAR_CIUDADES, onSuccess.bind(res), onError.bind(res), requestParams);
    });

    apiRouter.post(Utils.buildEndpoint('reservas'), DEBUG ? Utils.debugMiddleware : Authorization.validateRequest, (req, res, next) => {    
        /*requestParams.ConsultarReservasRequest.IncluirCanceladas = incluirBajas;
        Soap(Utils.SOAP_SERVICES.CONSULTAR_CIUDADES, onSuccess.bind(res), onError.bind(res), requestParams);*/
    });

    apiRouter.put(Utils.buildEndpoint('reservas'), DEBUG ? Utils.debugMiddleware : Authorization.validateRequest, (req, res, next) => {        
        /*requestParams.ConsultarReservasRequest.IncluirCanceladas = incluirBajas;
        Soap(Utils.SOAP_SERVICES.CONSULTAR_CIUDADES, onSuccess.bind(res), onError.bind(res), requestParams);*/
    });
}

function onSuccess(data) {
    this.send(200, data.ConsultarCiudadesResult.Ciudades.CiudadEntity);
}
function onError(error) {
    console.log('Error:');
    console.log(error.response.req._header);
    this.send(500, error);
}

module.exports = buildsApis;

/* 
Lugares de devolucion

TerminalBuses
Hotel
Aeropuerto
*/