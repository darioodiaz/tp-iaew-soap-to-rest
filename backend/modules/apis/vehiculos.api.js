function buildsApis(apiRouter, Soap, Authorization, Utils) {
    /* Vehiculos */
    apiRouter.get(Utils.buildEndpoint('vehiculos'), Authorization.validateRequest, (req, res, next) => {
        res.send(req.params);
        return next();
    });
}

module.exports = buildsApis;