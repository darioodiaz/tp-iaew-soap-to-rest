const OAuth2 = require('simple-oauth2');
const axios = require('axios');
const bluebird = require('bluebird');

const credentials = {
  client: {
    id: 'TPI_GrupoNro2',
    secret: 'pass12345'
  },
  auth: {
    tokenHost: `${process.env.OAUTH || 'http://130.211.183.120:8080'}/openam/oauth2/`,
    tokenPath: `${process.env.OAUTH || 'http://130.211.183.120:8080'}/openam/oauth2/access_token`,
    authorizePath: `${process.env.OAUTH || 'http://130.211.183.120:8080'}/openam/oauth2/authorize`,
    authorizeHost: `${process.env.OAUTH || 'http://130.211.183.120:8080'}`
  },
  options: {
    useBasicAuthorizationHeader: false
  }
};
const redirect_uri = `${process.env.REDIRECT_URI || 'http://localhost'}:3000/callback`;

const oauthServer = OAuth2.create(credentials);

function getAuthorizationUri(scope = 'read write') {
  const authorizationUri = oauthServer.authorizationCode.authorizeURL({ redirect_uri, scope });
  return authorizationUri;
}

function getAccessToken(code) {
  if (!code) {
    throw new Error('No se consiguio code para el token');
  }
  const tokenConfig = { code, redirect_uri };
  return oauthServer.authorizationCode.getToken(tokenConfig)
    .then((result) => {
      const serverToken = oauthServer.accessToken.create(result);
      console.log('Server token', serverToken.token);
      return serverToken.token;
    })
    .catch((error) => {
      console.log('Access Token Error', error);
      res.send(500, error);
    });
}

function validateToken(token) {
  const config = { headers: { 'Authorization': token } };
  return new bluebird((resolve, reject) => {
    console.log('Validando token con el servidor de OAuth');
    axios.get(`${process.env.OAUTH || 'http://130.211.183.120:8080'}/openam/oauth2/tokeninfo`, config).then((tokenInfo) => {
      let serverToken = oauthServer.accessToken.create(tokenInfo);
      if (serverToken.expired()) {
        reject('Token expirado');
      } else {
        resolve(serverToken.token.data);
      }
    }, (reason) => {
      console.log('Get token info rejection', reason.response.data);
      reject(reason.response.data.error_description);
    }).catch( (error) =>{
      console.log('Get token info error', error);
      reject(error);
    });
  });
}

function validateRequest(resource) {
  return function (req, res, next) {
    let token = req.headers.authorization && req.headers.authorization.trim().toLowerCase() != 'bearer';
    if (!token) {
      res.send(401, { error: "No autenticado" });
      return;
    }
    console.log('Token de usuario:', req.headers.authorization);
    validateToken(req.headers.authorization).then((tokenInfo) => {
      console.log('Token valido');
      let accessGranted = false;
      console.log('Permisos token', tokenInfo.scope);
      console.log('Permisos recurso', resource.permissions);
      resource.permissions.forEach((rp) => {
        tokenInfo.scope.forEach((ts) => {
          if (accessGranted) {
            return;
          } else {
            accessGranted = ts == rp;
          }
        });
      });
      if (accessGranted) {
        next();
      } else {
        res.send(403, { error: 'No tiene los permisos necesarios para realizar esta peticion' });
      }
    }, (reason) => {
      console.log('Token invalido o expirado');
      res.redirect(401, '/login', next);
    }).catch((error) => {
      console.log('Error al validar el token', error);
      res.send(500, error);
    });
  }
}

module.exports = {
  getAuthorizationUri,
  getAccessToken,
  validateRequest
};