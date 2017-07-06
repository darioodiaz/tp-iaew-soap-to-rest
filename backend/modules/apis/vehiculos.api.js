const moment = require('moment');

let requestParams = { ConsultarVehiculosRequest: {} };

function buildsApis(apiRouter, Soap, Authorization, Utils, DEBUG) {
    apiRouter.get(Utils.buildEndpoint('vehiculos'), DEBUG ? Utils.debugMiddleware : Authorization.validateRequest(Utils.SOAP_SERVICES.VEHICULOS_DISPONIBLES), (req, res, next) => {
        if (!req.query) {
            res.send(400, { error: 'Debes proporcionar los siguientes valores para consultar: ciudad, fecha de retiro y devolucion' });
            return;
        } else if (!req.query.idCiudad) {
            res.send(400, { error: 'Debes proporcionar una ciudad para consultar' });
            return;
        } else if (!req.query.fechaRetiro) {
            res.send(400, { error: 'Debes proporcionar una fecha de retiro para consultar' });
            return;
        } else if (!req.query.fechaDevolucion) {
            res.send(400, { error: 'Debes proporcionar una fecha de devolucion para consultar' });
            return;
        } else if (moment(req.query.fechaRetiro).format('YYYY-MM-DD') == 'Invalid date') {
            res.send(400, { error: 'Formato de fecha retiro incorrecto' });
            return;
        } else if (moment(req.query.fechaDevolucion).format('YYYY-MM-DD') == 'Invalid date') {
            res.send(400, { error: 'Formato de fecha devolucion incorrecto' });
            return;
        } else if (moment(req.query.fechaDevolucion).isBefore(req.query.fechaRetiro, 'day')) {
            res.send(400, { error: 'La fecha de devolucion debe ser posterior a la fecha de retiro' });
            return;
        }

        requestParams.ConsultarVehiculosRequest.IdCiudad = req.query.idCiudad;
        requestParams.ConsultarVehiculosRequest.FechaHoraRetiro = moment(req.query.fechaRetiro).format('YYYY-MM-DD');
        requestParams.ConsultarVehiculosRequest.FechaHoraDevolucion = moment(req.query.fechaDevolucion).format('YYYY-MM-DD');

        Soap(Utils.SOAP_SERVICES.VEHICULOS_DISPONIBLES.soapService, onSuccess.bind(res), Utils.parseError(error).bind(res), requestParams);
    });
}

function onSuccess(data) {
    data.ConsultarVehiculosDisponiblesResult.VehiculosEncontrados.VehiculoModel.forEach( (item) => {
        item.PrecioVentaPublico = Number(item.PrecioPorDia) + Number(item.PrecioPorDia) * 0.2;
    });
    this.send(200, data.ConsultarVehiculosDisponiblesResult.VehiculosEncontrados.VehiculoModel);
}

module.exports = buildsApis;