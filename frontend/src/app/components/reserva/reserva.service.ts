import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ReservaService {

  paises: any[] = [];
  ciudades: any[] = [];
  url: string = "http://muralestalleres.com.ar:3000";

  constructor(private http: Http) { }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa('username:password'));
  }
  get(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }
  public post(data) {
    let api = "/api/reservas"
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(this.url + api, data, {
      headers: headers
    });
  }


  consultarVehiculos(filtros: any) {
    let api = "/api/vehiculos";

    return this.http
      .get(`${this.url}${api}?idCiudad=${filtros.ciudadId}&fechaRetiro=${this.obtenerFecha(filtros.fecha_retiro)}&fechaDevolucion=${this.obtenerFecha(filtros.fecha_devolucion)}`)
      .map(resp => {
        console.log(resp.json());
        return resp.json();
      });

  }

  obtenerFecha(fecha) {
    return `${fecha.year}-${fecha.month}-${fecha.day}`;
  }

  obtenerPaises() {
    let api = "/api/paises";

    return this.http
      .get(this.url + api)
      .map(resp => {
        console.log(resp.json());
        return resp.json();
      });
  }

  obtenerCiudades(id: number) {
    let api = "/api/ciudades";

    return this.http
      .get(this.url + api + "/" + id)
      .map(resp => {
        return resp.json();
      })
  }


}
