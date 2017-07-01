let requestParams = { ConsultarCiudadesRequest: {} };

function buildsApis(apiRouter, Soap, Authorization, Utils, DEBUG) {
    apiRouter.get(Utils.buildEndpoint('ciudades/:id'), DEBUG ? Utils.debugMiddleware : Authorization.validateRequest(Utils.SOAP_SERVICES.CONSULTAR_CIUDADES), (req, res, next) => {
        if (!req.params.id) {
            res.send(400, { error: 'Debes proporcionar un pais para consultar'});
            return;
        }
        
        requestParams.ConsultarCiudadesRequest.IdPais = req.params.id;
        Soap(Utils.SOAP_SERVICES.CONSULTAR_CIUDADES.soapService, onSuccess.bind(res), onError.bind(res), requestParams);
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