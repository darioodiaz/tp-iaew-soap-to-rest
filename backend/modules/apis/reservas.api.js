const db = require('../mongo-server');
const bluebird = require('bluebird');

function buildsApis(apiRouter, Soap, Authorization, Utils, DEBUG) {
    apiRouter.get(Utils.buildEndpoint('reservas'), DEBUG ? Utils.debugMiddleware : Authorization.validateRequest(Utils.SOAP_SERVICES.CONSULTAR_RESERVAS), (req, res, next) => {
        let incluirBajas = !!req.query.incluirBajas;

        let requestParams = { ConsultarReservasRequest: {} };
        requestParams.ConsultarReservasRequest.IncluirCanceladas = incluirBajas;

        Soap(Utils.SOAP_SERVICES.CONSULTAR_RESERVAS.soapService, onGetReservasSuccess.bind(res), onError.bind(res), requestParams);
    });

    apiRouter.post(Utils.buildEndpoint('reservas'), DEBUG ? Utils.debugMiddleware : Authorization.validateRequest(Utils.SOAP_SERVICES.RESERVAR_VEHICULO), (req, res, next) => {
        let requestParams = { ReservarVehiculoRequest: {} };

        requestParams.ReservarVehiculoRequest.ApellidoNombreCliente = req.body.apellidoNombreCliente;
        requestParams.ReservarVehiculoRequest.FechaHoraDevolucion = req.body.fechaDevolucion;
        requestParams.ReservarVehiculoRequest.FechaHoraRetiro = req.body.fechaRetiro;
        requestParams.ReservarVehiculoRequest.IdVehiculoCiudad = req.body.idVehiculo;
        requestParams.ReservarVehiculoRequest.LugarDevolucion = req.body.lugarDevolucion;
        requestParams.ReservarVehiculoRequest.LugarRetiro = req.body.lugarRetiro;
        requestParams.ReservarVehiculoRequest.NroDocumentoCliente = req.body.documentoCliente;

        Soap(Utils.SOAP_SERVICES.RESERVAR_VEHICULO.soapService, (data) => onReservarVehiculoSuccess(req, res, data), onError.bind(res), requestParams);
    });

    apiRouter.del(Utils.buildEndpoint('reservas/:codigoReserva'), DEBUG ? Utils.debugMiddleware : Authorization.validateRequest(Utils.SOAP_SERVICES.CONSULTAR_CIUDADES), (req, res, next) => {
        if (!req.params.codigoReserva) {
            res.send(400, { error: 'Debes proporcionar el codigo de reserva para poder cancelar' });
            return;
        }
        let requestParams = { ConsultarReservasRequest: {} };
        requestParams.ConsultarReservasRequest.IncluirCanceladas = incluirBajas;

        Soap(Utils.SOAP_SERVICES.CONSULTAR_CIUDADES.soapService, onCancelarReservaSucess.bind(res), onError.bind(res), requestParams);
    });
}

function onGetReservasSuccess(data) {
    let promises = [];
    data.ConsultarReservasResult.Reservas.ReservaEntity.forEach((item) => {
        promises.push(addLocalDbInfo(item));
    });
    bluebird.all(promises).then(() => this.send(200, data.ConsultarReservasResult.Reservas.ReservaEntity));
}

function addLocalDbInfo(reserva) {
    return new bluebird((resolve, reject) => {
        db.getModel('reservas').then((reservas) => {
            reservas.findOne({ CodigoReserva: reserva.CodigoReserva }).exec((err, localReserva) => {
                if (err) {
                    console.log('DB: Getting reserva fails', err);
                    resolve();
                } else if (localReserva) {
                    reserva.IdCliente = localReserva.IdCliente;
                    reserva.IdVendedor = localReserva.IdVendedor;
                    reserva.PrecioVenta = localReserva.PrecioVenta;
                    resolve();
                } else {
                    resolve();
                }
            });
        });
    });
}

function onReservarVehiculoSuccess(req, res, data) {
    let response = data.ReservarVehiculoResult.Reserva;
    let reserva = {
        CodigoReserva: response.CodigoReserva,
        FechaReserva: response.FechaReserva,
        Costo: response.VehiculoPorCiudadEntity.VehiculoEntity.PrecioPorDia,
        PrecioVenta: req.body.PrecioVentaPublico,
        IdVendedor: req.body.idVendedor,
        IdCliente: req.body.idCliente
    };
    db.getModel('reservas', reserva).then((model) => {
        model.save((err) => {
            if (err) {
                console.log('Error saving reserva', reserva.codigoReserva, err);
                res.send(500, err);
            } else {
                console.log('Reserva added!');
                res.send(201, response);
            }
        });
    });
}
function onCancelarReservaSucess() {

}
function onError(error) {
    console.log('Error:');
    console.log(error.response.req._header);
    this.send(500, error);
}

module.exports = buildsApis;

/* 
Lugares de devolucion

TerminalBuses
Hotel
Aeropuerto
*/