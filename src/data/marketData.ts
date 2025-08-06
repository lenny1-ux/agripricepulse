/**
 * Market Data Generation and Management
 * 
 * This module handles the generation of realistic market data for the dashboard.
 * It implements economic principles to simulate real market conditions including:
 * - Price volatility based on supply-demand dynamics
 * - Regional price differences due to transportation costs
 * - Seasonal variations and market trends
 * - Random market fluctuations within realistic bounds
 */

import { MarketData, PriceData, City, Commodity } from '../types/market';

/**
 * Base prices for commodities (KES per 90kg bag)
 * These represent typical market prices in Kenya
 */
const BASE_PRICES = {
  maize: {
    nairobi: 4500,  // Nairobi typically has higher prices due to demand
    mombasa: 4200   // Mombasa has lower prices due to port proximity
  },
  beans: {
    nairobi: 8500,  // Beans are generally more expensive than maize
    mombasa: 8200   // Slight regional difference
  }
};

/**
 * Market volatility factors
 * These control how much prices can fluctuate
 */
const VOLATILITY = {
  maize: 0.15,    // 15% volatility for maize
  beans: 0.20     // 20% volatility for beans (more volatile)
};

/**
 * Transportation cost factor
 * Represents the cost difference between cities due to logistics
 */
//const TRANSPORT_FACTOR = 1.05; // 5% difference between cities

/**
 * Generate random price fluctuation
 * Uses normal distribution to simulate realistic market movements
 * 
 * @param basePrice - The base price to fluctuate around
 * @param volatility - The volatility factor (0-1)
 * @returns Fluctuated price
 */
function generatePriceFluctuation(basePrice: number, volatility: number): number {
  // Generate random number with normal distribution
  const random1 = Math.random();
  const random2 = Math.random();
  
  // Box-Muller transformation for normal distribution
  const normalRandom = Math.sqrt(-2 * Math.log(random1)) * Math.cos(2 * Math.PI * random2);
  
  // Apply volatility and return fluctuated price
  const fluctuation = normalRandom * volatility * basePrice;
  return Math.max(basePrice + fluctuation, basePrice * 0.5); // Ensure price doesn't go below 50% of base
}

/**
 * Calculate price change from previous value
 * Simulates realistic market movements
 * 
 * @param currentPrice - Current market price
 * @param basePrice - Base reference price
 * @returns Price change amount
 */
function calculatePriceChange(currentPrice: number, basePrice: number): number {
  const changePercent = ((currentPrice - basePrice) / basePrice) * 100;
  return Math.round(changePercent * 10) / 10; // Round to 1 decimal place
}

/**
 * Generate current market data for all cities and commodities
 * Creates realistic price data with proper economic relationships
 * 
 * @returns Array of MarketData objects
 */
export function generateMarketData(): MarketData[] {
  const currentTime = new Date();
  
  // Generate prices with realistic fluctuations
  const nairobiMaizePrice = Math.round(generatePriceFluctuation(BASE_PRICES.maize.nairobi, VOLATILITY.maize));
  const mombasaMaizePrice = Math.round(generatePriceFluctuation(BASE_PRICES.maize.mombasa, VOLATILITY.maize));
  const nairobiBeansPrice = Math.round(generatePriceFluctuation(BASE_PRICES.beans.nairobi, VOLATILITY.beans));
  const mombasaBeansPrice = Math.round(generatePriceFluctuation(BASE_PRICES.beans.mombasa, VOLATILITY.beans));
  
  // Calculate price changes
  const nairobiMaizeChange = calculatePriceChange(nairobiMaizePrice, BASE_PRICES.maize.nairobi);
  const mombasaMaizeChange = calculatePriceChange(mombasaMaizePrice, BASE_PRICES.maize.mombasa);
  const nairobiBeansChange = calculatePriceChange(nairobiBeansPrice, BASE_PRICES.beans.nairobi);
  const mombasaBeansChange = calculatePriceChange(mombasaBeansPrice, BASE_PRICES.beans.mombasa);
  
  return [
    {
      city: City.NAIROBI,
      commodity: Commodity.MAIZE,
      maizePrice: nairobiMaizePrice,
      maizeChange: nairobiMaizeChange,
      beansPrice: nairobiBeansPrice,
      beansChange: nairobiBeansChange,
      lastUpdated: currentTime
    },
    {
      city: City.MOMBASA,
      commodity: Commodity.BEANS,
      maizePrice: mombasaMaizePrice,
      maizeChange: mombasaMaizeChange,
      beansPrice: mombasaBeansPrice,
      beansChange: mombasaBeansChange,
      lastUpdated: currentTime
    }
  ];
}

/**
 * Generate historical price data for trend analysis
 * Creates 30 days of historical data with realistic trends
 * 
 * @returns Array of PriceData objects for the last 30 days
 */
export function generateHistoricalData(): PriceData[] {
  const historicalData: PriceData[] = [];
  const today = new Date();
  
  // Generate data for the last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Add some trend and seasonality to the data
    const trendFactor = 1 + (i * 0.001); // Slight upward trend over time
    const seasonalFactor = 1 + Math.sin((i / 30) * Math.PI * 2) * 0.05; // Seasonal variation
    
    // Generate prices with trend and seasonal factors
    const nairobiMaize = Math.round(
      generatePriceFluctuation(BASE_PRICES.maize.nairobi * trendFactor * seasonalFactor, VOLATILITY.maize * 0.5)
    );
    const nairobiBeans = Math.round(
      generatePriceFluctuation(BASE_PRICES.beans.nairobi * trendFactor * seasonalFactor, VOLATILITY.beans * 0.5)
    );
    const mombasaMaize = Math.round(
      generatePriceFluctuation(BASE_PRICES.maize.mombasa * trendFactor * seasonalFactor, VOLATILITY.maize * 0.5)
    );
    const mombasaBeans = Math.round(
      generatePriceFluctuation(BASE_PRICES.beans.mombasa * trendFactor * seasonalFactor, VOLATILITY.beans * 0.5)
    );
    
    historicalData.push({
      date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      nairobiMaize,
      nairobiBeans,
      mombasaMaize,
      mombasaBeans
    });
  }
  
  return historicalData;
}

/**
 * Calculate moving average for a given dataset
 * Used for trend analysis and smoothing price data
 * 
 * @param data - Array of price values
 * @param period - Number of periods for moving average
 * @returns Moving average value
 */
export function calculateMovingAverage(data: number[], period: number): number {
  if (data.length < period) return data.reduce((sum, val) => sum + val, 0) / data.length;
  
  const recentData = data.slice(-period);
  return recentData.reduce((sum, val) => sum + val, 0) / period;
}

/**
 * Calculate price volatility (standard deviation)
 * Measures how much prices fluctuate around the average
 * 
 * @param prices - Array of price values
 * @returns Volatility as standard deviation
 */
export function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0;
  
  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const squaredDifferences = prices.map(price => Math.pow(price - mean, 2));
  const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / prices.length;
  
  return Math.sqrt(variance);
}

/**
 * Calculate market efficiency indicator
 * Measures how efficiently prices are transmitted between markets
 * Higher values indicate more efficient price discovery
 * 
 * @param prices1 - Prices from first market
 * @param prices2 - Prices from second market
 * @returns Efficiency score (0-1)
 */
export function calculateMarketEfficiency(prices1: number[], prices2: number[]): number {
  if (prices1.length !== prices2.length || prices1.length < 2) return 0;
  
  // Calculate correlation between the two price series
  const n = prices1.length;
  const mean1 = prices1.reduce((sum, val) => sum + val, 0) / n;
  const mean2 = prices2.reduce((sum, val) => sum + val, 0) / n;
  
  let numerator = 0;
  let denominator1 = 0;
  let denominator2 = 0;
  
  for (let i = 0; i < n; i++) {
    const diff1 = prices1[i] - mean1;
    const diff2 = prices2[i] - mean2;
    
    numerator += diff1 * diff2;
    denominator1 += diff1 * diff1;
    denominator2 += diff2 * diff2;
  }
  
  const correlation = numerator / Math.sqrt(denominator1 * denominator2);
  
  // Convert correlation to efficiency score (0-1)
  return Math.abs(correlation);

}
