const db = require('../mongo-server');
const moment = require('moment');
const bluebird = require('bluebird');

function buildsApis(apiRouter, Soap, Authorization, Utils, DEBUG) {
    apiRouter.get(Utils.buildEndpoint('reservas'), DEBUG ? Utils.debugMiddleware : Authorization.validateRequest(Utils.SOAP_SERVICES.CONSULTAR_RESERVAS), (req, res, next) => {
        let incluirBajas = !!req.query.incluirBajas;

        let requestParams = { ConsultarReservasRequest: {} };
        requestParams.ConsultarReservasRequest.IncluirCanceladas = incluirBajas;

        Soap(Utils.SOAP_SERVICES.CONSULTAR_RESERVAS.soapService, onGetReservasSuccess.bind(res), Utils.parseError.bind(res), requestParams);
    });

    apiRouter.post(Utils.buildEndpoint('reservas'), DEBUG ? Utils.debugMiddleware : Authorization.validateRequest(Utils.SOAP_SERVICES.RESERVAR_VEHICULO), (req, res, next) => {
        let requestParams = { ReservarVehiculoRequest: {} };

        if (!req.body) {
            res.send(400, { error: 'Debes proporcionar los siguientes valores para realizar una reserva: apelllido y nombre del cliente, el vehiculo a reservar, fecha de retiro y devolucion del mismo, documento del cliente y vendedor' });
            return;
        } else if (!req.body.apellidoNombreCliente) {
            res.send(400, { error: 'Debes proporcionar nombre y apellido del cliente' });
            return;
        } else if (!req.body.idVehiculo) {
            res.send(400, { error: 'Debes proporcionar un vehiculo' });
            return;
        } else if (!req.body.lugarDevolucion) {
            res.send(400, { error: 'Debes proporcionar un lugar de devolucion' });
            return;
        } else if (!req.body.lugarRetiro) {
            res.send(400, { error: 'Debes proporcionar lugar de retiro' });
            return;
        } else if (!req.body.documentoCliente) {
            res.send(400, { error: 'Debes proporcionar documento del cliente' });
            return;
        } else if (!req.body.idCliente) {
            res.send(400, { error: 'Debes proporcionar un cliente' });
            return;
        } else if (!req.body.idVendedor) {
            res.send(400, { error: 'Debes proporcionar un vendedor' });
            return;
        } else if (!req.body.fechaRetiro) {
            res.send(400, { error: 'Debes proporcionar una fecha de retiro' });
            return;
        } else if (!req.body.fechaDevolucion) {
            res.send(400, { error: 'Debes proporcionar una fecha de devolucion' });
            return;
        } else if (moment(req.body.fechaRetiro).format('YYYY-MM-DD') == 'Invalid date') {
            res.send(400, { error: 'Formato de fecha retiro incorrecto' });
            return;
        } else if (moment(req.body.fechaDevolucion).format('YYYY-MM-DD') == 'Invalid date') {
            res.send(400, { error: 'Formato de fecha devolucion incorrecto' });
            return;
        } else if (moment(req.body.fechaDevolucion).isBefore(req.body.fechaRetiro, 'day')) {
            res.send(400, { error: 'La fecha de devolucion debe ser posterior a la fecha de retiro' });
            return;
        }

        requestParams.ReservarVehiculoRequest.ApellidoNombreCliente = req.body.apellidoNombreCliente;
        requestParams.ReservarVehiculoRequest.FechaHoraDevolucion = moment(req.body.fechaDevolucion).format('YYYY-MM-DD');
        requestParams.ReservarVehiculoRequest.FechaHoraRetiro = moment(req.body.fechaRetiro).format('YYYY-MM-DD');
        requestParams.ReservarVehiculoRequest.IdVehiculoCiudad = req.body.idVehiculo;
        requestParams.ReservarVehiculoRequest.LugarDevolucion = req.body.lugarDevolucion;
        requestParams.ReservarVehiculoRequest.LugarRetiro = req.body.lugarRetiro;
        requestParams.ReservarVehiculoRequest.NroDocumentoCliente = req.body.documentoCliente;

        Soap(Utils.SOAP_SERVICES.RESERVAR_VEHICULO.soapService, (data) => onReservarVehiculoSuccess(req, res, data), Utils.parseError.bind(res), requestParams);
    });

    apiRouter.del(Utils.buildEndpoint('reservas/:codigoReserva'), DEBUG ? Utils.debugMiddleware : Authorization.validateRequest(Utils.SOAP_SERVICES.CONSULTAR_CIUDADES), (req, res, next) => {
        if (!req.params.codigoReserva) {
            res.send(400, { error: 'Debes proporcionar el codigo de reserva para poder cancelar' });
            return;
        }
        let requestParams = { CancelarReservaRequest: {} };
        requestParams.CancelarReservaRequest.CodigoReserva = req.params.codigoReserva;

        Soap(Utils.SOAP_SERVICES.CANCELAR_RESERVA.soapService, (data) => onCancelarReservaSucess(req, res, data), Utils.parseError.bind(res), requestParams);
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
                } else if (localReserva) {
                    reserva.IdCliente = localReserva.IdCliente;
                    reserva.IdVendedor = localReserva.IdVendedor;
                    reserva.PrecioVenta = localReserva.PrecioVenta;
                }
                resolve();
            });
        });
    });
}

function onReservarVehiculoSuccess(req, res, data) {
    let response = data.ReservarVehiculoResult.Reserva;
    let reserva = {
        CodigoReserva: response.CodigoReserva,
        FechaReserva: response.FechaReserva,
        Estado: response.Estado,
        Costo: response.VehiculoPorCiudadEntity.VehiculoEntity.PrecioPorDia,
        PrecioVenta: req.body.PrecioVentaPublico,
        IdVendedor: req.body.idVendedor,
        IdCliente: req.body.idCliente
    };
    db.getModel('reservas', reserva).then((model) => {
        model.save((error) => {
            if (error) {
                console.log('Error saving reserva', reserva.codigoReserva, error);
                res.send(500, { error });
            } else {
                console.log('Reserva added!');
                res.send(201, response);
            }
        });
    });
}

function onCancelarReservaSucess(req, res, data) {
    db.getModel('reservas').then((reservas) => {
        reservas.findOneAndUpdate(
            { CodigoReserva: req.params.codigoReserva }, //condition
            { Estado: data.CancelarReservaResult.Reserva.Estado, FechaCancelacion: data.CancelarReservaResult.Reserva.FechaCancelacion } //update
        ).exec((error, localReserva) => {
            if (errir) {
                console.log('DB: Updating reserva fails', error);
                res.send(500, { error });
            } else {
                res.send(200, data.CancelarReservaResult.Reserva);
            }
        });
    });
}

module.exports = buildsApis;