let requestParams = { ConsultarVehiculosRequest: {} };

function buildsApis(apiRouter, Soap, Authorization, Utils, DEBUG) {
    apiRouter.get(Utils.buildEndpoint('vehiculos'), DEBUG ? Utils.debugMiddleware : Authorization.validateRequest, (req, res, next) => {
        if (!req.query) {
            res.send(400, { error: 'Debes proporcionar los siguientes valores para consultar: ciudad, fecha de retiro y devolucion'});
            return;
        } else if (!req.query.idCiudad) {
            res.send(400, { error: 'Debes proporcionar una ciudad para consultar'});
            return;
        } else if (!req.query.fechaRetiro) {
            res.send(400, { error: 'Debes proporcionar una fecha de retiro para consultar'});
            return;
        } else if (!req.query.fechaDevolucion) {
            res.send(400, { error: 'Debes proporcionar una fecha de devolucion para consultar'});
            return;
        }
        
        requestParams.ConsultarVehiculosRequest.IdCiudad = req.query.idCiudad;
        requestParams.ConsultarVehiculosRequest.FechaHoraRetiro = req.query.fechaRetiro;
        requestParams.ConsultarVehiculosRequest.FechaHoraDevolucion = req.query.fechaDevolucion;

        Soap(Utils.SOAP_SERVICES.VEHICULOS_DISPONIBLES, onSuccess.bind(res), onError.bind(res), requestParams);
    });
}

function onSuccess(data) {
    this.send(200, data.ConsultarVehiculosDisponiblesResult.VehiculosEncontrados.VehiculoModel);
}
function onError(error) {
    console.log('Error:');
    console.log(error.response.req._header);
    this.send(500, error);
}

module.exports = buildsApis;