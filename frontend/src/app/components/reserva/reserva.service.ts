import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Cookie } from 'ng2-cookies';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
declare var $: any;

@Injectable()
export class ReservaService {
  headersConf = {};
  url: string = "http://localhost:3000";

  constructor(private http: Http, private modalService: NgbModal) {
    this.autenticar();
  }

  autenticar() {
    let headers = new Headers();
    let token = Cookie.get('app-token') || '';
    headers.append('Authorization', `Bearer ${token}`);
    this.headersConf = { headers };
  }

  public post(data) {
    this.autenticar();
    let api = "/api/reservas"
    return this.http.post(this.url + api, data, this.headersConf)
      .map(resp => {
        this.mostrarExito('Reserva realizada con exito. Codigo reserva' + resp.json().CodigoReserva);
        console.log(resp.json());
        return resp.json();
      })
  }

  consultarVehiculos(filtros: any) {
    this.autenticar();
    let api = "/api/vehiculos";

    return this.http
      .get(`${this.url}${api}?idCiudad=${filtros.ciudadId}&fechaRetiro=${this.obtenerFecha(filtros.fecha_retiro)}&fechaDevolucion=${this.obtenerFecha(filtros.fecha_devolucion)}`, this.headersConf)
      .map(resp => {
        console.log(resp.json());
        return resp.json();

      })
      .catch(this.mostrarError.bind(this));

  }

  mostrarExito(texto) {
    $('#txt-exito').text(texto);
    $('#modal-exito').modal('show');
  }

  mostrarError(_error: Response) {
    console.log(_error.json().error);
    let error = _error.json().error;
    $('#txt-error').text(error);
    $('#modal-error').modal('show');
    return Observable.throw(error || 'Server error');
  }

  public obtenerFecha(fecha) {
    return `${fecha.year}-${fecha.month}-${fecha.day}`;
  }

  obtenerPaises() {
    this.autenticar();
    let api = "/api/paises";

    return this.http
      .get(this.url + api, this.headersConf)
      .map(resp => {
        console.log(resp.json());
        return resp.json();
      })
      .catch(this.mostrarError);
  }

  obtenerClientes() {
    this.autenticar();
    let api = "/api/clientes";

    return this.http
      .get(this.url + api, this.headersConf)
      .map(resp => {
        console.log(resp.json());
        return resp.json();
      })
      .catch(this.mostrarError);
  }

  obtenerLugares() {
    this.autenticar();
    let api = "/api/lugares";

    return this.http
      .get(this.url + api, this.headersConf)
      .map(resp => {
        console.log(resp.json());
        return resp.json();
      })
      .catch(this.mostrarError);
  }

  obtenerVendedores() {
    this.autenticar();
    let api = "/api/vendedores";

    return this.http
      .get(this.url + api, this.headersConf)
      .map(resp => {
        console.log(resp.json());
        return resp.json();
      })
      .catch(this.mostrarError);
  }

  obtenerCiudades(id: number) {
    this.autenticar();
    let api = "/api/ciudades";

    return this.http
      .get(this.url + api + "/" + id, this.headersConf)
      .map(resp => {
        return resp.json();
      })
      .catch(this.mostrarError);
  }


}
