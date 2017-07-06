import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbdDatepickerPopup } from './core/datepicker/datepicker-popup';

import { APP_ROUTING } from './app.routes';

import { ReservaService } from './components/reserva/reserva.service';

import { AppComponent } from './app.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { ReservaComponent } from './components/reserva/reserva.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ReservaComponent,
    NgbdDatepickerPopup
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    FormsModule,
    HttpModule,
    NgbModule,
    APP_ROUTING
  ],
  providers: [ReservaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
