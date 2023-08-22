import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.page.html',
  styleUrls: ['./navbar.page.scss'],
})
export class NavbarPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  openSettings() {
    // Código para abrir a página de configurações ou executar outras ações
    console.log('Configurações clicadas.');
  }

}
