export interface TimeSeriesEntry {
  '4. close': string;
}

export interface TimeSeries {
  [key: string]: TimeSeriesEntry;
}

export interface APIResponse {
  'Time Series (5min)': TimeSeries;
  'Time Series (15min)': TimeSeries;
  'Time Series (1h)': TimeSeries;
  allPairs?: string[];
}

export interface CurrencyExchangeRate {
  'Realtime Currency Exchange Rate': {
    '1. From_Currency Code': string;
    '2. From_Currency Name': string;
    '3. To_Currency Code': string;
    '4. To_Currency Name': string;
    '5. Exchange Rate': string;
    '6. Last Refreshed': string;
    '7. Time Zone': string;
    '8. Bid Price': string;
    '9. Ask Price': string;
  };
}

export interface FibonacciLevels {
  [key: string]: number;
}