import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReservaService } from './reserva.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html'
})
export class ReservaComponent implements OnInit {

  private token: string;
  public resultados: any[] = [];
  paises: any = [];
  ciudades: any = [];
  clientes: any = [];
  vendedores: any = [];
  lugares: any = [];
  public consulta: any = {};

  auto: any = {};
  reserva: any = {};

  closeResult: any;


  constructor(private _activatedRoute: ActivatedRoute, private servicio: ReservaService, private modalService: NgbModal) {

  }

  ngOnInit() {
    this.obtenerPaises();
  }

  open(content, id) {
    this.auto = this.resultados[id];
    this.obtenerClientes();
    this.obtenerVendedores();
    this.obtenerLugares();
    this.modalService.open(content);
  }

  private obtenerClientes() {
    this.servicio
      .obtenerClientes()
      .subscribe(resp => this.clientes = resp);
  }

  private obtenerVendedores() {
    this.servicio
      .obtenerVendedores()
      .subscribe(resp => this.vendedores = resp);
  }

  private obtenerLugares() {
    this.servicio
      .obtenerLugares()
      .subscribe(resp => this.lugares = resp);
  }


  public reservar() {
    let cliente = this.clientes[this.reserva.clienteSeleccionado];
    let vendedor = this.clientes[this.reserva.vendedorSeleccionado];
    let lugarRetiro = this.lugares[this.reserva.lugarRetiroSeleccionado];
    let lugarDevolucion = this.lugares[this.reserva.lugarDevolucionSeleccionado];

    let reserva = {
      "idVehiculo": this.auto.VehiculoCiudadId,
      "apellidoNombreCliente": this.clientes[this.reserva.clienteSeleccionado].Apellido + ', ' + this.clientes[this.reserva.clienteSeleccionado].Nombre,
      "documentoCliente": cliente.Documento,
      "precioVenta": this.auto.PrecioVentaPublico,
      "fechaDevolucion": this.servicio.obtenerFecha(this.consulta.fecha_devolucion),
      "fechaRetiro": this.servicio.obtenerFecha(this.consulta.fecha_retiro),
      "lugarDevolucion": lugarDevolucion.Nombre,
      "lugarRetiro": lugarRetiro.Nombre,
      "idCliente": cliente.Id,
      "idVendedor": vendedor.Id
    };

    this.servicio.post(reserva).subscribe(result => {
      console.log(result);
      this.consultar();
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
