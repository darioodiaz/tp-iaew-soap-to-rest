const db = require('../mongo-server');

function buildsApis(apiRouter, Soap, Authorization, Utils, DEBUG) {
    apiRouter.get(Utils.buildEndpoint('reservas'), DEBUG ? Utils.debugMiddleware : Authorization.validateRequest, (req, res, next) => {
        let incluirBajas = !!req.query.incluirBajas;

        let requestParams = { ConsultarReservasRequest: {} };
        requestParams.ConsultarReservasRequest.IncluirCanceladas = incluirBajas;

        Soap(Utils.SOAP_SERVICES.CONSULTAR_CIUDADES, onGetReservasSuccess.bind(res), onError.bind(res), requestParams);
    });

    apiRouter.post(Utils.buildEndpoint('reservas'), DEBUG ? Utils.debugMiddleware : Authorization.validateRequest, (req, res, next) => {
        let requestParams = { ReservarVehiculoRequest: {} };
        requestParams.ReservarVehiculoRequest.IdVehiculoCiudad = req.body.idVehiculo;

        requestParams.ReservarVehiculoRequest.ApellidoNombreCliente = req.body.apellidoNombreCliente;
        requestParams.ReservarVehiculoRequest.NroDocumentoCliente = req.body.documentoCliente;

        requestParams.ReservarVehiculoRequest.FechaHoraDevolucion = req.body.fechaDevolucion;
        requestParams.ReservarVehiculoRequest.FechaHoraRetiro = req.body.fechaRetiro;

        requestParams.ReservarVehiculoRequest.LugarDevolucion = req.body.lugarDevolucion;
        requestParams.ReservarVehiculoRequest.LugarRetiro = req.body.lugarRetiro;

        Soap(Utils.SOAP_SERVICES.RESERVAR_VEHICULO, (data) => onReservarVehiculoSuccess(req, res, data), onError.bind(res), requestParams);
    });

    apiRouter.delete(Utils.buildEndpoint('reservas/:codigoReserva'), DEBUG ? Utils.debugMiddleware : Authorization.validateRequest, (req, res, next) => {
        if (!req.params.codigoReserva) {
            res.send(400, { error: 'Debes proporcionar el codigo de reserva para poder cancelar' });
            return;
        }
        let requestParams = { ConsultarReservasRequest: {} };
        requestParams.ConsultarReservasRequest.IncluirCanceladas = incluirBajas;

        Soap(Utils.SOAP_SERVICES.CONSULTAR_CIUDADES, onCancelarReservaSucess.bind(res), onError.bind(res), requestParams);
    });
}

function onGetReservasSuccess(data) {
    this.send(200, data.ConsultarCiudadesResult.Ciudades.CiudadEntity);
}

function onReservarVehiculoSuccess(req, res, data) {
    let response = data.ReservarVehiculoResult.Reserva;
    let reserva = {
        CodigoReserva: response.CodigoReserva,
        FechaReserva: response.FechaReserva,
        Costo: response.VehiculoPorCiudadEntity.VehiculoEntity.PrecioPorDia,
        PrecioVenta: req.body.PrecioVentaPublico,
        IdVendedor: req.body.IdVendedor,
        IdCliente: req.body.IdCliente
    };
    db.getModel('reserva', reserva).then((model) => {
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