import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  private tieneToken:any;

  constructor() {
    this.tieneToken = Cookie.get('app-token') || false;
  }

  login(scope) {
    window.location.replace('/login?scope=' + scope);
  }

  logout() {
    Cookie.delete('app-token');
    window.location.replace('/app');
  }

  ngOnInit() {
  }

}
