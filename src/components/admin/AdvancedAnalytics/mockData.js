// Mock data for Advanced Analytics module

// Top Selling Products Data
export const topSellingProducts = {
  daily: [
    { id: 1, name: 'Wireless Earbuds Pro', quantity: 245, revenue: 36750, contribution: 18.5 },
    { id: 2, name: 'Smart Watch Series 9', quantity: 189, revenue: 56700, contribution: 28.6 },
    { id: 3, name: 'USB-C Fast Charger', quantity: 312, revenue: 15600, contribution: 7.9 },
    { id: 4, name: 'Phone Case Premium', quantity: 278, revenue: 13900, contribution: 7.0 },
    { id: 5, name: 'Bluetooth Speaker', quantity: 156, revenue: 31200, contribution: 15.7 },
    { id: 6, name: 'Screen Protector Pack', quantity: 423, revenue: 12690, contribution: 6.4 },
    { id: 7, name: 'Power Bank 20000mAh', quantity: 134, revenue: 26800, contribution: 13.5 },
    { id: 8, name: 'Laptop Stand', quantity: 98, revenue: 14700, contribution: 7.4 },
  ],
  weekly: [
    { id: 1, name: 'Wireless Earbuds Pro', quantity: 1680, revenue: 252000, contribution: 19.2 },
    { id: 2, name: 'Smart Watch Series 9', quantity: 1245, revenue: 373500, contribution: 28.5 },
    { id: 3, name: 'USB-C Fast Charger', quantity: 2156, revenue: 107800, contribution: 8.2 },
    { id: 4, name: 'Phone Case Premium', quantity: 1923, revenue: 96150, contribution: 7.3 },
    { id: 5, name: 'Bluetooth Speaker', quantity: 1089, revenue: 217800, contribution: 16.6 },
    { id: 6, name: 'Screen Protector Pack', quantity: 2890, revenue: 86700, contribution: 6.6 },
    { id: 7, name: 'Power Bank 20000mAh', quantity: 923, revenue: 184600, contribution: 14.1 },
    { id: 8, name: 'Laptop Stand', quantity: 678, revenue: 101700, contribution: 7.8 },
  ],
  monthly: [
    { id: 1, name: 'Wireless Earbuds Pro', quantity: 6720, revenue: 1008000, contribution: 18.8 },
    { id: 2, name: 'Smart Watch Series 9', quantity: 4980, revenue: 1494000, contribution: 27.9 },
    { id: 3, name: 'USB-C Fast Charger', quantity: 8624, revenue: 431200, contribution: 8.0 },
    { id: 4, name: 'Phone Case Premium', quantity: 7692, revenue: 384600, contribution: 7.2 },
    { id: 5, name: 'Bluetooth Speaker', quantity: 4356, revenue: 871200, contribution: 16.2 },
    { id: 6, name: 'Screen Protector Pack', quantity: 11560, revenue: 346800, contribution: 6.5 },
    { id: 7, name: 'Power Bank 20000mAh', quantity: 3692, revenue: 738400, contribution: 13.8 },
    { id: 8, name: 'Laptop Stand', quantity: 2712, revenue: 406800, contribution: 7.6 },
  ],
}

// Low Performing Products Data
export const lowPerformingProducts = [
  {
    id: 1,
    name: 'Vintage Phone Case',
    quantity: 12,
    revenue: 360,
    previousQuantity: 45,
    growth: -73.3,
    trend: 'declining',
    daysSinceLastSale: 8,
  },
  {
    id: 2,
    name: 'Old Model Headphones',
    quantity: 23,
    revenue: 1150,
    previousQuantity: 67,
    growth: -65.7,
    trend: 'declining',
    daysSinceLastSale: 5,
  },
  {
    id: 3,
    name: 'Basic Cable',
    quantity: 8,
    revenue: 80,
    previousQuantity: 34,
    growth: -76.5,
    trend: 'declining',
    daysSinceLastSale: 12,
  },
  {
    id: 4,
    name: 'Outdated Charger',
    quantity: 15,
    revenue: 300,
    previousQuantity: 52,
    growth: -71.2,
    trend: 'declining',
    daysSinceLastSale: 6,
  },
  {
    id: 5,
    name: 'Legacy Adapter',
    quantity: 6,
    revenue: 90,
    previousQuantity: 28,
    growth: -78.6,
    trend: 'declining',
    daysSinceLastSale: 15,
  },
]

// Customer Behavior Analytics Data
export const customerBehaviorData = {
  repeatBuyers: {
    count: 3420,
    percentage: 68.4,
    previousPeriod: 3120,
    trend: 'up',
    change: 9.6,
  },
  averageOrderValue: {
    value: 156.75,
    previousPeriod: 142.30,
    trend: 'up',
    change: 10.1,
  },
  cartAbandonmentRate: {
    rate: 23.5,
    previousPeriod: 28.2,
    trend: 'down',
    change: -16.7,
  },
  newCustomers: {
    count: 1245,
    percentage: 24.9,
    previousPeriod: 1089,
    trend: 'up',
    change: 14.3,
  },
  customerLifetimeValue: {
    value: 487.50,
    previousPeriod: 452.80,
    trend: 'up',
    change: 7.7,
  },
}

// Sales Forecasting Data
export const salesForecastData = {
  '30days': [
    { date: '2024-01-01', forecast: 125000, lowerBound: 110000, upperBound: 140000 },
    { date: '2024-01-08', forecast: 132000, lowerBound: 117000, upperBound: 147000 },
    { date: '2024-01-15', forecast: 128000, lowerBound: 113000, upperBound: 143000 },
    { date: '2024-01-22', forecast: 135000, lowerBound: 120000, upperBound: 150000 },
    { date: '2024-01-29', forecast: 140000, lowerBound: 125000, upperBound: 155000 },
  ],
  '60days': [
    { date: '2024-01-01', forecast: 125000, lowerBound: 110000, upperBound: 140000 },
    { date: '2024-01-15', forecast: 128000, lowerBound: 113000, upperBound: 143000 },
    { date: '2024-01-29', forecast: 140000, lowerBound: 125000, upperBound: 155000 },
    { date: '2024-02-12', forecast: 145000, lowerBound: 130000, upperBound: 160000 },
    { date: '2024-02-26', forecast: 150000, lowerBound: 135000, upperBound: 165000 },
    { date: '2024-03-01', forecast: 152000, lowerBound: 137000, upperBound: 167000 },
  ],
  '90days': [
    { date: '2024-01-01', forecast: 125000, lowerBound: 110000, upperBound: 140000 },
    { date: '2024-01-29', forecast: 140000, lowerBound: 125000, upperBound: 155000 },
    { date: '2024-02-26', forecast: 150000, lowerBound: 135000, upperBound: 165000 },
    { date: '2024-03-25', forecast: 158000, lowerBound: 143000, upperBound: 173000 },
    { date: '2024-04-22', forecast: 165000, lowerBound: 150000, upperBound: 180000 },
    { date: '2024-04-30', forecast: 168000, lowerBound: 153000, upperBound: 183000 },
  ],
}

// Profit vs Revenue Data
export const profitRevenueData = [
  { month: 'Jan', revenue: 125000, profit: 31250, margin: 25.0 },
  { month: 'Feb', revenue: 138000, profit: 34500, margin: 25.0 },
  { month: 'Mar', revenue: 152000, profit: 38000, margin: 25.0 },
  { month: 'Apr', revenue: 145000, profit: 36250, margin: 25.0 },
  { month: 'May', revenue: 168000, profit: 42000, margin: 25.0 },
  { month: 'Jun', revenue: 175000, profit: 43750, margin: 25.0 },
  { month: 'Jul', revenue: 182000, profit: 45500, margin: 25.0 },
  { month: 'Aug', revenue: 195000, profit: 48750, margin: 25.0 },
  { month: 'Sep', revenue: 188000, profit: 47000, margin: 25.0 },
  { month: 'Oct', revenue: 205000, profit: 51250, margin: 25.0 },
  { month: 'Nov', revenue: 218000, profit: 54500, margin: 25.0 },
  { month: 'Dec', revenue: 235000, profit: 58750, margin: 25.0 },
]

