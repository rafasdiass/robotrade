import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-coins',
  templateUrl: './coins.page.html',
  styleUrls: ['./coins.page.scss'],
})
export class CoinsPage implements OnInit {
  public coins: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getListOfCurrencies().subscribe((data: any) => {
      // Assumindo que a API retorna um objeto onde os detalhes da moeda estão em data['CoinInfo']
      this.coins = data['CoinInfo']; // Substitua 'CoinInfo' pelo campo real
    });
  }
}
