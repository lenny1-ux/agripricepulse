/**
 * Market Data Types
 * 
 * This file defines the TypeScript interfaces and types used throughout
 * the market prices application. These types ensure type safety and
 * provide clear contracts for data structures.
 */

/**
 * Represents current market data for a specific city
 * Contains real-time prices and price changes for both commodities
 */
export interface MarketData {
  /** City name (Nairobi or Mombasa) */
  city: string;
  
  /** Current commodity being tracked */
  commodity: string;
  
  /** Current price of maize per 90kg bag in KES */
  maizePrice: number;
  
  /** Price change for maize (positive = increase, negative = decrease) */
  maizeChange: number;
  
  /** Current price of beans per 90kg bag in KES */
  beansPrice: number;
  
  /** Price change for beans (positive = increase, negative = decrease) */
  beansChange: number;
  
  /** Timestamp of last price update */
  lastUpdated: Date;
}

/**
 * Represents historical price data for trend analysis
 * Used for generating charts and calculating moving averages
 */
export interface PriceData {
  /** Date of the price record */
  date: string;
  
  /** Maize price in Nairobi on this date */
  nairobiMaize: number;
  
  /** Beans price in Nairobi on this date */
  nairobiBeans: number;
  
  /** Maize price in Mombasa on this date */
  mombasaMaize: number;
  
  /** Beans price in Mombasa on this date */
  mombasaBeans: number;
}

/**
 * Market analytics data structure
 * Contains calculated metrics for market analysis
 */
export interface MarketAnalytics {
  /** Average price across all markets */
  averagePrice: number;
  
  /** Price volatility (standard deviation) */
  volatility: number;
  
  /** 7-day moving average */
  movingAverage7d: number;
  
  /** 30-day moving average */
  movingAverage30d: number;
  
  /** Price spread between highest and lowest markets */
  priceSpread: number;
  
  /** Market efficiency indicator (0-1, higher = more efficient) */
  marketEfficiency: number;
}

/**
 * City enumeration for type safety
 */
export enum City {
  NAIROBI = 'Nairobi',
  MOMBASA = 'Mombasa'
}

/**
 * Commodity enumeration for type safety
 */
export enum Commodity {
  MAIZE = 'Maize',
  BEANS = 'Beans'
}