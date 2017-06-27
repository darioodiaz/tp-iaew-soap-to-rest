const restify = require('restify');
const Authorization = require('./modules/auth');
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
  const authorizationUri = Authorization.getAuthorizationUri();
  res.redirect(authorizationUri, next);
});

server.get('/callback', (req, res, next) => {
  Authorization.getAccessToken(req.params.code).then((token) => {
    res.send(200, token);
  }).catch((error) => {
    console.log('Error al obtener access token', error);
    res.send(500, error);
  });
});

/* Vehiculos */
server.get(buildEndpoint('vehiculos'), Authorization.validateRequest, (req, res, next) => {
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
  return `${PREFIX}/${route}`;
}