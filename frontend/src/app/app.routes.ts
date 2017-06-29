import { RouterModule, Routes } from '@angular/router';
import { ReservaComponent } from './components/reserva/reserva.component';

const APP_ROUTES: Routes = [
  { path: 'reserva', component: ReservaComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'reserva' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true });
