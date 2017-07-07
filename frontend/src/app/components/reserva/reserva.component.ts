import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReservaService } from './reserva.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';



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

  auto: any = {};

  closeResult: any;


  constructor(private _activatedRoute: ActivatedRoute, private servicio: ReservaService, private modalService: NgbModal) {

  }

  ngOnInit() {
    this.obtenerPaises();
  }

  open(content, id) {
    this.auto = this.resultados[id];
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = "";
    });
  }


  public reservar(idAuto: number) {
    let reserva = {
      "idVehiculo": idAuto,
      "apellidoNombreCliente": "Diaz, Dario",
      "documentoCliente": 35577465,
      "fechaDevolucion": "2017-06-04",
      "fechaRetiro": "2017-06-20",
      "lugarDevolucion": "Aeropuerto",
      "lugarRetiro": "Hotel",
      "idCliente": 1,
      "idVendedor": 1
    };

    this.servicio.post(reserva).subscribe(result => {
      console.log(result);
    });

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
