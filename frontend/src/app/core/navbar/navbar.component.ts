import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  constructor() { }

  login(scope) {
    window.location.replace('/login?scope=' + scope);
  }

  logout() {
    Cookie.delete('app-token');
    window.location.replace('/login?scope=read');
  }

  ngOnInit() {
  }

}
