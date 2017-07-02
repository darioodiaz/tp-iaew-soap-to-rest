const db = require('../mongo-server');

function buildsApis(apiRouter, Soap, Authorization, Utils, DEBUG) {
    apiRouter.get(Utils.buildEndpoint('vendedores'), DEBUG ? Utils.debugMiddleware : Authorization.validateRequest(Utils.SERVICES.CONSULTAR_VENDEDORES), (req, res, next) => {
        db.getModel('vendedores').then((model) => {
        model.find({}, (error, vendedores) => {
            if (error) {
                console.log('Error getting vendedores', error);
                res.send(500, { error });
            } else {
                res.send(200, vendedores);
            }
        });
    });
    });
}

module.exports = buildsApis;