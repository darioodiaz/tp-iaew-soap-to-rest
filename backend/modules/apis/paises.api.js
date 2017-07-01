function buildsApis(apiRouter, Soap, Authorization, Utils, DEBUG) {
    apiRouter.get(Utils.buildEndpoint('paises'), DEBUG ? Utils.debugMiddleware : Authorization.validateRequest(Utils.SOAP_SERVICES.CONSULTAR_PAISES), (req, res, next) => {
        Soap(Utils.SOAP_SERVICES.CONSULTAR_PAISES.soapService, onSuccess.bind(res), onError.bind(res));
    });
}

function onSuccess(data) {
    this.send(200, data.ConsultarPaisesResult.Paises.PaisEntity);
}
function onError(error) {
    console.log('Error', error);
    this.send(500, error);
}

module.exports = buildsApis;