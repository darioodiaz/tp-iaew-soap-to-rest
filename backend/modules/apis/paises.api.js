function buildsApis(apiRouter, Soap, Authorization, Utils, DEBUG) {
    apiRouter.get(Utils.buildEndpoint('paises'), DEBUG ? Utils.debugMiddleware : Authorization.validateRequest, (req, res, next) => {
        Soap(Utils.SOAP_SERVICES.PAISES, onSuccess.bind(res), onError.bind(res));
    });
}

function onSuccess(data) {
    console.log('Data fetched', data.ConsultarPaisesResult.Paises.PaisEntity);
    this.send(200, data.ConsultarPaisesResult.Paises.PaisEntity);
}
function onError(error) {
    console.log('Error', error);
    this.send(500, error);
}

module.exports = buildsApis;