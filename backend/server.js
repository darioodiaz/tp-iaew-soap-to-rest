const restify = require('restify');
const fs = require('fs');

const Authorization = require('./modules/auth');
const apiRouter = require('./modules/apis');
const db = require('./modules/db.js');

const server = restify.createServer({
  name: 'tpi-iaew-api-rest',
  version: '1.0.0'
});

const DEBUG = process.env.DEBUG === 'true';

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
    console.log('Access token', token);
    res.redirect(301, '/app', next);
  }).catch((error) => {
    console.log('Error al obtener access token', error);
    res.send(500, error);
  });
});

server.get(/(.js|.map|.css)$/, restify.serveStatic({
  directory: './frontend',
  default: 'index.html'
}));
server.get('/app', DEBUG ? (req, res, next) => { next() } : Authorization.validateAppAccess, (req, res) => {
  fs.readFile('./frontend/index.html', (err, data) => {
    if (err) {
      res.send(500, err);
    } else {
      res.writeHead(200, {
        'Content-Length': Buffer.byteLength(data),
        'Content-Type': 'text/html'
      });
      res.write(data);
      res.end();
    }
  });
});

db(() => {
  server.listen(3000, () => {
    console.log('%s listening at %s', server.name, server.url);
  });
});