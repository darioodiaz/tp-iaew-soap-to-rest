const args = require('yargs').argv;
const restify = require('restify');
const Authorization = require('./modules/auth');

const apiRouter = require('./modules/apis');

const server = restify.createServer({
  name: 'tpi-iaew-api-rest',
  version: '1.0.0'
});

const DEBUG = args.debug;

console.log(DEBUG && 'WARNING: Debug mode');

server.use(restify.plugins.CORS());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
apiRouter.setDebug(DEBUG);
apiRouter.createApis();
apiRouter.applyRoutes(server);

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

server.listen(3000, function () {
  console.log('%s listening at %s', server.name, server.url);
});