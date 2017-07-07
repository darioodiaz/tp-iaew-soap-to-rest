import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConsultaReservaService } from './consulta-reserva.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-consulta-reserva',
  templateUrl: './consulta-reserva.component.html'
})
export class ConsultaReservaComponent implements OnInit {

  private token: string;
  public resultados: any[] = [];


  constructor(private _activatedRoute: ActivatedRoute, private servicio: ConsultaReservaService, private modalService: NgbModal) {

  }

  ngOnInit() {

  }


}
