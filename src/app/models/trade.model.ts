export interface Trade {
  id: number;
  amount: number;
  status: 'win' | 'loss' | 'pending';
  priceHedge?: 'none' | 'both' | 'one'; // O campo é opcional
}
