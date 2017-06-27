const soap = require('soap');
const SOAP_URL = 'http://romeroruben-001-site1.itempurl.com/WCFReservaVehiculos.svc?singlewsdl';

let soapClient;

soap.createClient(SOAP_URL, (err, client) => { soapClient = client; });

function callResource(resource, scb, ecb, params = {}) {
    if (!soapClient) {
        throw Error('Aun no se inicio el cliente SOAP');
    }
    soapClient[resource](params, (err, result) => {
        if (err) {
            ecb(err);
        } else {
            scb(result);
        }
    });
}

module.exports = callResource;