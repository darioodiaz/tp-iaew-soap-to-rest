const restify = require('restify');
const Autorization = require('./modules/auth');
const Soap = require('./modules/soap');

const server = restify.createServer({
  name: 'tpi-iaew-api-rest',
  version: '1.0.0'
});
const PREFIX = '/api';

server.use(restify.plugins.CORS());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

/* Login */
server.get('/login', (req, res, next) => {
  const authorizationUri = Autorization.getAuthorizationUri();
  res.redirect(authorizationUri, next);
});

server.get('/access_token', (req, res, next) => {
  console.log(req.body,' - P - ', req.params);
  const authorizationUri = Autorization.getAccessToken();
  res.redirect(authorizationUri, next);
});

/* Vehiculos */ 
server.get(buildEndpoint('vehiculos'), Autorization.validateRequest, (req, res, next) => {
  res.send(req.params);
  return next();
});

/* Listar reservas */ 
server.get(buildEndpoint('reservas'), (req, res, next) => {
  res.send(req.params);
  return next();
});

/* Ver una reserva */ 
server.get(buildEndpoint('reservas/:id'), (req, res, next) => {
  res.send(req.params);
  return next();
});

/* Cancelar una reserva */ 
server.del(buildEndpoint('reservas/:id'), (req, res, next) => {
  res.send(req.params);
  return next();
});


server.listen(3000, function () {
  console.log('%s listening at %s', server.name, server.url);
});

function buildEndpoint(route) {
    return `${PREFIX}/route`;
}