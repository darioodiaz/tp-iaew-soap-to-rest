const db = require('../mongo-server');

function buildsApis(apiRouter, Soap, Authorization, Utils, DEBUG) {
    apiRouter.get(Utils.buildEndpoint('clientes'), DEBUG ? Utils.debugMiddleware : Authorization.validateRequest(Utils.SERVICES.CONSULTAR_CLIENTES), (req, res, next) => {
        db.getModel('clientes').then((model) => {
        model.find({}, (error, clientes) => {
            if (error) {
                console.log('Error getting clientes', error);
                res.send(500, { error });
            } else {
                res.send(200, clientes);
            }
        });
    });
    });
}

module.exports = buildsApis;