const soap = require('soap');
const SOAP_URL = 'http://romeroruben-001-site1.itempurl.com/WCFReservaVehiculos.svc?singlewsdl';

let soapClient;

soap.createClient(SOAP_URL, (err, client) => { soapClient = client; });

function callResource(resource, params = {}, scb, ecb) {
    soapClient[resource](params, (err, result) => {
        console.log(result);
        if (err) {
            ecb(err);
        } else {
            scb(result);
        }
    });
}

module.exports = {
    callResource
};