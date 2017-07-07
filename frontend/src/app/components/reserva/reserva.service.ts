import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Cookie } from 'ng2-cookies';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ReservaService {
  headersConf = {};
  url: string = "http://localhost:3000";
  error: any;
  modalErrorContent = `
    <ng-template #content let-c="close" let-d="dismiss">
        <div class="modal-header" style="text-align: center">
            <h3 class="modal-title">Error</h3>
        </div>
        <div class="modal-body">
            <p></p>
        </div>
        <div class="modal-footer">
            <p>Footer</p>
        </div>
    </ng-template> `;

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
    return this.http.post(this.url + api, data, this.headersConf);
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

  mostrarError(error: Response) {
    console.log(error.json().error);
    error = error.json().error;
    this.modalService.open(this.modalErrorContent);
    return Observable.throw(error.json().error || 'Server error');
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
