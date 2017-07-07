import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConsultaReservaService } from './consulta-reserva.service';


@Component({
  selector: 'app-consulta-reserva',
  templateUrl: './consulta-reserva.component.html'
})
export class ConsultaReservaComponent implements OnInit {

  private token: string;
  public resultados: any[] = [];
  private incluirBajas: boolean;


  constructor(private _activatedRoute: ActivatedRoute, private servicio: ConsultaReservaService) {

  }

  cancelarReserva(codigo) {
    console.log('Cancelar', codigo);
    this.servicio
      .cancelar(codigo).subscribe( () => this.consultar() );
  }

  consultar() {
    this.servicio
      .consultar(this.incluirBajas)
      .subscribe(resp => this.resultados = resp);
  }

  ngOnInit() {

  }


}
