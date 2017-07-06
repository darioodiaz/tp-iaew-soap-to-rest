function buildsApis(apiRouter, Soap, Authorization, Utils, DEBUG) {
    apiRouter.get(Utils.buildEndpoint('paises'), DEBUG ? Utils.debugMiddleware : Authorization.validateRequest(Utils.SOAP_SERVICES.CONSULTAR_PAISES), (req, res, next) => {
        Soap(Utils.SOAP_SERVICES.CONSULTAR_PAISES.soapService, onSuccess.bind(res), Utils.parseError(error).bind(res) );
    });
}

function onSuccess(data) {
    this.send(200, data.ConsultarPaisesResult.Paises.PaisEntity);
}

module.exports = buildsApis;