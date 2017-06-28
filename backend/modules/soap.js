const soap = require('soap');
const SOAP_URL = 'http://romeroruben-001-site1.itempurl.com/WCFReservaVehiculos.svc?singlewsdl';

function callResource(resource, scb, ecb, params = {}) {
    soap.createClient(SOAP_URL, (err, client) => {
        if (err) {
            ecb(err);
            return;
        }
        client[resource](params, (err, result) => {
            if (err) {
                ecb(err);
            } else {
                scb(result);
            }
        });
    });
}

module.exports = callResource;