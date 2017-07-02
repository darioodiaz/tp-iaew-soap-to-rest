const db = require('../mongo-server');

function buildsApis(apiRouter, Soap, Authorization, Utils, DEBUG) {
    apiRouter.get(Utils.buildEndpoint('lugares'), DEBUG ? Utils.debugMiddleware : Authorization.validateRequest(Utils.SERVICES.CONSULTAR_lugares), (req, res, next) => {
        db.getModel('lugares').then((model) => {
        model.find({}, (error, lugares) => {
            if (error) {
                console.log('Error getting lugares', error);
                res.send(500, { error });
            } else {
                res.send(200, lugares);
            }
        });
    });
    });
}

module.exports = buildsApis;