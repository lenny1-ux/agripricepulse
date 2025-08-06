/**
 * Market Analytics Component
 * 
 * Provides comprehensive market analysis including volatility calculations,
 * price correlations, and market efficiency metrics. Implements data science
 * principles for meaningful market insights.
 */

import React from 'react';
import { BarChart3, TrendingUp, Activity, Target } from 'lucide-react';
import { MarketData, PriceData } from '../types/market';
import { 
  calculateMovingAverage, 
  calculateVolatility, 
  calculateMarketEfficiency 
} from '../data/marketData';

interface MarketAnalyticsProps {
  /** Current market data for all cities and commodities */
  marketData: MarketData[];
  
  /** Historical price data for trend analysis */
  historicalData: PriceData[];
}

/**
 * Market Analytics component providing comprehensive market insights
 * 
 * Features:
 * - Volatility analysis for both commodities
 * - Moving averages (7-day and 30-day)
 * - Market efficiency calculations
 * - Price correlation analysis
 * - Visual indicators for market health
 * 
 * @param props - MarketAnalyticsProps containing market and historical data
 * @returns JSX element containing market analytics dashboard
 */
const MarketAnalytics: React.FC<MarketAnalyticsProps> = ({ 
  marketData, 
  historicalData 
}) => {
  /**
   * Calculate comprehensive market statistics
   * Processes historical data to generate meaningful insights
   */
  const calculateMarketStats = () => {
    if (historicalData.length === 0) {
      return {
        maizeStats: { volatility: 0, ma7: 0, ma30: 0, efficiency: 0 },
        beansStats: { volatility: 0, ma7: 0, ma30: 0, efficiency: 0 }
      };
    }

    // Extract price arrays for calculations
    const nairobiMaizePrices = historicalData.map(d => d.nairobiMaize);
    const mombasaMaizePrices = historicalData.map(d => d.mombasaMaize);
    const nairobiBeansPrices = historicalData.map(d => d.nairobiBeans);
    const mombasaBeansPrices = historicalData.map(d => d.mombasaBeans);

    // Calculate average prices for moving averages
    const avgMaizePrices = historicalData.map(d => (d.nairobiMaize + d.mombasaMaize) / 2);
    const avgBeansPrices = historicalData.map(d => (d.nairobiBeans + d.mombasaBeans) / 2);

    return {
      maizeStats: {
        volatility: calculateVolatility(avgMaizePrices),
        ma7: calculateMovingAverage(avgMaizePrices, 7),
        ma30: calculateMovingAverage(avgMaizePrices, 30),
        efficiency: calculateMarketEfficiency(nairobiMaizePrices, mombasaMaizePrices)
      },
      beansStats: {
        volatility: calculateVolatility(avgBeansPrices),
        ma7: calculateMovingAverage(avgBeansPrices, 7),
        ma30: calculateMovingAverage(avgBeansPrices, 30),
        efficiency: calculateMarketEfficiency(nairobiBeansPrices, mombasaBeansPrices)
      }
    };
  };

  const stats = calculateMarketStats();

  /**
   * Get volatility level description and color coding
   */
  const getVolatilityInfo = (volatility: number) => {
    if (volatility < 200) {
      return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    } else if (volatility < 400) {
      return { level: 'Moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
    } else {
      return { level: 'High', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
    }
  };

  /**
   * Get market efficiency description and color coding
   */
  const getEfficiencyInfo = (efficiency: number) => {
    if (efficiency > 0.8) {
      return { level: 'High', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    } else if (efficiency > 0.6) {
      return { level: 'Moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
    } else {
      return { level: 'Low', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
    }
  };

  /**
   * Calculate current price spreads between cities
   */
  const calculatePriceSpreads = () => {
    if (marketData.length < 2) return { maizeSpread: 0, beansSpread: 0 };

    const nairobiData = marketData.find(d => d.city === 'Nairobi');
    const mombasaData = marketData.find(d => d.city === 'Mombasa');

    if (!nairobiData || !mombasaData) return { maizeSpread: 0, beansSpread: 0 };

    return {
      maizeSpread: Math.abs(nairobiData.maizePrice - mombasaData.maizePrice),
      beansSpread: Math.abs(nairobiData.beansPrice - mombasaData.beansPrice)
    };
  };

  const priceSpreads = calculatePriceSpreads();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Maize Analytics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Maize Market Analytics</h3>
        </div>

        <div className="space-y-4">
          {/* Volatility Analysis */}
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Price Volatility</span>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-semibold ${getVolatilityInfo(stats.maizeStats.volatility).color} ${getVolatilityInfo(stats.maizeStats.volatility).bgColor}`}>
                {getVolatilityInfo(stats.maizeStats.volatility).level}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ±{stats.maizeStats.volatility.toFixed(0)} KES
            </p>
            <p className="text-xs text-gray-500 mt-1">Standard deviation of prices</p>
          </div>

          {/* Moving Averages */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">7-Day MA</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {stats.maizeStats.ma7.toFixed(0)} KES
              </p>
            </div>
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">30-Day MA</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {stats.maizeStats.ma30.toFixed(0)} KES
              </p>
            </div>
          </div>

          {/* Market Efficiency */}
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Market Efficiency</span>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-semibold ${getEfficiencyInfo(stats.maizeStats.efficiency).color} ${getEfficiencyInfo(stats.maizeStats.efficiency).bgColor}`}>
                {getEfficiencyInfo(stats.maizeStats.efficiency).level}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {(stats.maizeStats.efficiency * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Price correlation between markets</p>
          </div>

          {/* Price Spread */}
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Price Spread</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {priceSpreads.maizeSpread.toFixed(0)} KES
            </p>
            <p className="text-xs text-gray-500 mt-1">Difference between Nairobi & Mombasa</p>
          </div>
        </div>
      </div>

      {/* Beans Analytics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Beans Market Analytics</h3>
        </div>

        <div className="space-y-4">
          {/* Volatility Analysis */}
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Price Volatility</span>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-semibold ${getVolatilityInfo(stats.beansStats.volatility).color} ${getVolatilityInfo(stats.beansStats.volatility).bgColor}`}>
                {getVolatilityInfo(stats.beansStats.volatility).level}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ±{stats.beansStats.volatility.toFixed(0)} KES
            </p>
            <p className="text-xs text-gray-500 mt-1">Standard deviation of prices</p>
          </div>

          {/* Moving Averages */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">7-Day MA</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {stats.beansStats.ma7.toFixed(0)} KES
              </p>
            </div>
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">30-Day MA</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {stats.beansStats.ma30.toFixed(0)} KES
              </p>
            </div>
          </div>

          {/* Market Efficiency */}
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Market Efficiency</span>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-semibold ${getEfficiencyInfo(stats.beansStats.efficiency).color} ${getEfficiencyInfo(stats.beansStats.efficiency).bgColor}`}>
                {getEfficiencyInfo(stats.beansStats.efficiency).level}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {(stats.beansStats.efficiency * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Price correlation between markets</p>
          </div>

          {/* Price Spread */}
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Price Spread</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {priceSpreads.beansSpread.toFixed(0)} KES
            </p>
            <p className="text-xs text-gray-500 mt-1">Difference between Nairobi & Mombasa</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalytics;