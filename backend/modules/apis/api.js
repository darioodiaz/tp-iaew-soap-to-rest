const PREFIX = '/api';

const Authorization = require('./modules/auth');
const Soap = require('./modules/soap');
const Router = require('restify-router').Router;
let apiRouter = new Router();

function buildEndpoint(route) {
    return `${PREFIX}/${route}`;
}

/* Vehiculos */
apiRouter.get(buildEndpoint('vehiculos'), Authorization.validateRequest, (req, res, next) => {
    res.send(req.params);
    return next();
});

/* Listar reservas */
apiRouter.get(buildEndpoint('reservas'), (req, res, next) => {
    res.send(req.params);
    return next();
});

/* Ver una reserva */
apiRouter.get(buildEndpoint('reservas/:id'), (req, res, next) => {
    res.send(req.params);
    return next();
});

/* Cancelar una reserva */
apiRouter.del(buildEndpoint('reservas/:id'), (req, res, next) => {
    res.send(req.params);
    return next();
});

module.exports = apiRouter;