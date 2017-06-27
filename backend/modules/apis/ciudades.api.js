function buildsApis(apiRouter, Soap, Authorization, Utils, DEBUG) {
    apiRouter.get(Utils.buildEndpoint('ciudades/:id'), DEBUG ? Utils.debugMiddleware : Authorization.validateRequest, (req, res, next) => {
        Soap(Utils.SOAP_SERVICES.CIUDADES, onSuccess.bind(res), onError.bind(res), { IdPais: 1 });
    });
}

function onSuccess(data) {
    console.log('Data fetched', data.ConsultarPaisesResult.Paises.PaisEntity);
    this.send(200, data.ConsultarPaisesResult.Paises.PaisEntity);
}
function onError(error) {
    console.log('Error:');
    console.log(error.response.req._header);
    console.log(error.response);
    this.send(500, error);
}

module.exports = buildsApis;