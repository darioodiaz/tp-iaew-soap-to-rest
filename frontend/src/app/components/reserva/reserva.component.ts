import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReservaService } from './reserva.service';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html'
})
export class ReservaComponent implements OnInit {

  private token: string;
  public resultados: any[] = [];
  paises: any = [];
  ciudades: any = [];
  public consulta: any = {};

  constructor(private _activatedRoute: ActivatedRoute, private servicio: ReservaService) {

  }

  ngOnInit() {
    this.obtenerPaises();
  }

  public obtenerPaises() {
    this.servicio
      .obtenerPaises()
      .subscribe(resp => {
        this.paises = resp;
      });
  }

  public obtenerCiudades(id: number) {
    this.servicio
      .obtenerCiudades(id)
      .subscribe(resp => {
        this.ciudades = resp;
      })
  }

  public consultar() {
    if (!this.consulta.length) {
      this.servicio.consultarVehiculos(this.consulta).subscribe(resp => {
        this.resultados = resp;
      })
    }


  }

  public reservarAuto() {
    console.log("reservar automovil");
  }



}
