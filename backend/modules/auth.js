const OAuth2 = require('simple-oauth2');

const credentials = {
  client: {
    id: 'TPI_GrupoNro2',
    secret: 'pass12345'
  },
  auth: {
    tokenHost: 'http://104.198.185.19:8080/openam/oauth2/authorize'
  }
};
const redirect_uri = 'http://localhost:3000/access_token';

const oauthServer = OAuth2.create(credentials);

function getAuthorizationUri(scope = 'access_api') {
  const authorizationUri = oauthServer.authorizationCode.authorizeURL({ redirect_uri, scope });
  return authorizationUri;
}
function getAccessToken(code, res) {
  const tokenConfig = { code, redirect_uri: 'http://localhost:3000/authSuccess' };
  oauthServer.authorizationCode.getToken(tokenConfig)
    .then((result) => {
      const token = oauth2.accessToken.create(result);
    })
    .catch((error) => {
      console.log('Access Token Error', error.message);
      res.send(500, { error: error.message });
    });
}

function validateRequest(req, res, next) {

}

module.exports = {
  getAuthorizationUri,
  getAccessToken,
  validateRequest
};