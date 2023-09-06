import { Component, OnInit } from '@angular/core';
import { FinanceService } from '../../services/finance.service';
import { ChartOptions, ChartDataset } from 'chart.js';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  public stocks: any[] = [];
  public newsFeed: any[] = [];
  public figures: any[] = [];
  public chartType: ChartType = 'line';
  public chartData: ChartDataset[] = [{ data: [], label: 'Stocks' }];
  public chartLabels: string[] = [];  
  public chartOptions: ChartOptions = {
    responsive: true,
  };
  

  constructor(private financeService: FinanceService) {}

  ngOnInit(): void {
    const stockSymbol = 'AAPL';
    const timeInterval = '5min';
    const seriesType = 'close';

    this.financeService.getStockData(stockSymbol, timeInterval).subscribe((data: any) => {
      if (data && data['Time Series (5min)']) {
        this.stocks = Object.values(data['Time Series (5min)']);
        this.chartData[0].data = this.stocks.map(stock => parseFloat(stock[seriesType]));
        this.chartLabels = Object.keys(data['Time Series (5min)']);
      }
    });
  }
}
