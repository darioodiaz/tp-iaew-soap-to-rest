import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html'
})
export class ReservaComponent implements OnInit {

  private token: string;
  public resultados: any[] = [];

  constructor() { }

  ngOnInit() {
  }

  public obtenerToken() {

  }

  public consultar() {
    console.log("buscar reservas por pais");
    let automovil = {
      id: 1,
      pais: 'Argentina',
      estado: 'Libre',
      precio: 500
    }

    this.resultados.push(automovil);

  }



}
