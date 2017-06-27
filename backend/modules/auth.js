const OAuth2 = require('simple-oauth2');
const axios = require('axios');

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

function getAuthorizationUri(scope = 'read') {
  const authorizationUri = oauthServer.authorizationCode.authorizeURL({ redirect_uri, scope });
  return authorizationUri;
}
function getAccessToken(code, res) {
  const tokenConfig = { code, redirect_uri };
  return oauthServer.authorizationCode.getToken(tokenConfig)
    .then((result) => {
      const token = oauthServer.accessToken.create(result);
      console.log(token);
      return token;
    })
    .catch((error) => {
      console.log('Access Token Error', error);
      throw new Error(error);
    });
}

function validateToken(token) {
  const config = { headers: { 'Authorization': token } };
  return axios.get('http://104.197.29.243:8080/openam/oauth2/tokeninfo', config).then((tokenInfo) => {
    let token = oauth2.accessToken.create(tokenInfo);
    if (token.expired()) {
      token.refresh()
        .then((result) => {
          token = result;
        });
    }
  });
}

function validateRequest(req, res, next) {
  let token = req.headers.authorization;
  if (!token) {
    res.send(401);
    return;
  }
  console.log('Token de usuario:', token);
  validateToken(token).then(() => {
    console.log('Token valido');
    next();
  }, () => {
    console.log('Token invalido o expirado');
    res.redirect('/login');
  }).catch((error) => {
    console.log('Error al validar el token', error);
    res.send(500, error);
  });
}

module.exports = {
  getAuthorizationUri,
  getAccessToken,
  validateRequest
};