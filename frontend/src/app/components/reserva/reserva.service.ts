import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ReservaService {

  paises:any[] = [];
  ciudades:any [] = [];
  url:string = "http://muralestalleres.com.ar:3000";

  constructor(private http:Http) { }

  consultarVehiculos(filtros:any) {
    let api = "/api/vehiculos";

    return this.http
      .get(`${this.url}${api}?idCiudad=${filtros.ciudadId}&fechaRetiro=${this.obtenerFecha(filtros.fecha_retiro)}&fechaDevolucion=${this.obtenerFecha(filtros.fecha_devolucion)}`)
      .map( resp => {
        console.log(resp.json());
        return resp.json();
      });

  }

  obtenerFecha(fecha){
    return `${fecha.year}-${fecha.month}-${fecha.day}`;
  }

  obtenerPaises(){
    let api = "/api/paises";

    return this.http
      .get(this.url + api)
      .map( resp => {
        console.log(resp.json());
        return resp.json();
      });
  }

  obtenerCiudades(id:number) {
    let api = "/api/ciudades";

    return this.http
      .get(this.url + api+"/"+id)
      .map( resp => {
        return resp.json();
      })
  }


}
