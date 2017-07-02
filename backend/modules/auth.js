const OAuth2 = require('simple-oauth2');
const axios = require('axios');
const bluebird = require('bluebird');

const credentials = {
  client: {
    id: 'TPI_GrupoNro2',
    secret: 'pass12345'
  },
  auth: {
    tokenHost: 'http://104.197.29.243:8080/openam/oauth2/',
    tokenPath: 'http://104.197.29.243:8080/openam/oauth2/access_token',
    authorizePath: 'http://104.197.29.243:8080/openam/oauth2/authorize',
    authorizeHost: 'http://104.197.29.243:8080'
  },
  options: {
    useBasicAuthorizationHeader: false
  }
};
const redirect_uri = 'http://localhost:3000/callback';

const oauthServer = OAuth2.create(credentials);

function getAuthorizationUri(scope = 'write') {
  const authorizationUri = oauthServer.authorizationCode.authorizeURL({ redirect_uri, scope });
  return authorizationUri;
}

function getAccessToken(code, res) {
  const tokenConfig = { code, redirect_uri };
  return oauthServer.authorizationCode.getToken(tokenConfig)
    .then((result) => {
      const serverToken = oauthServer.accessToken.create(result);
      console.log('Server token', serverToken.token);
      return serverToken.token;
    })
    .catch((error) => {
      console.log('Access Token Error', error);
      throw new Error(error);
    });
}

function validateToken(token) {
  const config = { headers: { 'Authorization': token } };
  return new bluebird((resolve, reject) => {
    axios.get('http://104.197.29.243:8080/openam/oauth2/tokeninfo', config).then((tokenInfo) => {
      let serverToken = oauthServer.accessToken.create(tokenInfo);
      if (serverToken.expired()) {
        reject('Token expirado');
      } else {
        resolve(serverToken.token.data);
      }
    }, (reason) => {
      console.log('Get token info rejection', reason.response.data);
      reject(reason.response.error_description);
    });
  });
}

function validateRequest(resource) {
  return function (req, res, next) {
    let token = req.headers.authorization;
    if (!token) {
      res.send(401, { error: "No autenticado" });
      return;
    }
    console.log('Token de usuario:', token);
    validateToken(token).then((tokenInfo) => {
      console.log('Token valido');
      let accessGranted = false;
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
    }, () => {
      console.log('Token invalido o expirado');
      res.redirect(401, '/login', next);
    }).catch((error) => {
      console.log('Error al validar el token', error);
      res.send(500, error);
    });
  }
}

//TODO: eliminar, creo que no se usa
function validateAppAccess(req, res, next) {
  let token = req.headers.authorization;
  if (!token) {
    res.redirect(401, '/login', next);
    return;
  }
  console.log('Token de usuario:', token);
  validateToken(token).then(() => {
    console.log('Token valido');
    next();
  }, () => {
    console.log('Token invalido o expirado');
    res.redirect(401, '/login', next);
  }).catch((error) => {
    console.log('Error al validar el token', error);
    res.send(500, error);
  });
}

module.exports = {
  getAuthorizationUri,
  getAccessToken,
  validateRequest,
  validateAppAccess
};