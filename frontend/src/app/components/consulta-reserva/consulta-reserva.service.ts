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
export class ConsultaReservaService {
  headersConf = {};
  url: string = "http://localhost:3000";
  error: any;

  constructor(private http: Http, private modalService: NgbModal) {
    this.autenticar();
  }

  autenticar() {
    let headers = new Headers();
    let token = Cookie.get('app-token') || '';
    headers.append('Authorization', `Bearer ${token}`);
    this.headersConf = { headers };
  }

  public consultar(incluirBajas: boolean = false) {
    this.autenticar();
    let api = "/api/reservas"
    return this.http.get(`${this.url + api}?incluirBajas=${incluirBajas}`, this.headersConf)
      .map(resp => {
        return resp.json();
      })
      .catch(this.mostrarError);
  }

  public cancelar(codigo) {
    this.autenticar();
    let api = "/api/reservas"
    return this.http.delete(`${this.url + api}/${codigo}`, this.headersConf)
      .map(resp => {
        this.mostrarExito('Reserva cancelada con exito');
        return resp.json();
      })
      .catch(this.mostrarError);
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


}
