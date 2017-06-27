function buildsApis(apiRouter, Soap, Authorization, Utils) {
    /* Vehiculos */
    apiRouter.get(Utils.buildEndpoint('ciudades'), Authorization.validateRequest, (req, res, next) => {
        res.send(req.params);
        return next();
    });
}

module.exports = buildsApis;