/**
 * Price Card Component
 * 
 * Displays individual commodity prices with visual indicators for price changes.
 * Implements responsive design and clear data visualization principles.
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus, MapPin } from 'lucide-react';

interface PriceCardProps {
  /** City name where the commodity is traded */
  city: string;
  
  /** Name of the commodity (Maize or Beans) */
  commodity: string;
  
  /** Current price of the commodity */
  price: number;
  
  /** Price change from previous period (positive/negative) */
  change: number;
  
  /** Unit of measurement for the price */
  unit: string;
}

/**
 * Price Card component for displaying commodity prices
 * 
 * Features:
 * - Color-coded price change indicators
 * - Responsive design with hover effects
 * - Clear typography hierarchy
 * - Visual trend indicators
 * 
 * @param props - PriceCardProps containing price and location data
 * @returns JSX element representing a price card
 */
const PriceCard: React.FC<PriceCardProps> = ({
  city,
  commodity,
  price,
  change,
  unit
}) => {
  /**
   * Determine the trend direction and styling based on price change
   */
  const getTrendInfo = () => {
    if (change > 0) {
      return {
        icon: TrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        sign: '+',
        label: 'Increased'
      };
    } else if (change < 0) {
      return {
        icon: TrendingDown,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        sign: '',
        label: 'Decreased'
      };
    } else {
      return {
        icon: Minus,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        sign: '',
        label: 'No change'
      };
    }
  };

  const trendInfo = getTrendInfo();
  const TrendIcon = trendInfo.icon;

  /**
   * Get commodity-specific styling
   */
  const getCommodityColor = () => {
    return commodity.toLowerCase() === 'maize' 
      ? 'text-green-700 bg-green-100' 
      : 'text-blue-700 bg-blue-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          {/* Location and Commodity */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">{city}</span>
          </div>
          
          {/* Commodity Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCommodityColor()}`}>
            {commodity}
          </span>
        </div>

        {/* Price Display */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 font-medium">KES</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{unit}</p>
        </div>

        {/* Price Change Indicator */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${trendInfo.bgColor} ${trendInfo.borderColor} border`}>
          <TrendIcon className={`w-4 h-4 ${trendInfo.color}`} />
          <span className={`text-sm font-semibold ${trendInfo.color}`}>
            {trendInfo.sign}{Math.abs(change).toFixed(1)}%
          </span>
          <span className="text-xs text-gray-600 ml-auto">
            {trendInfo.label}
          </span>
        </div>
      </div>

      {/* Card Footer with Additional Info */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Market Rate</span>
          <span>Per 90kg Bag</span>
        </div>
      </div>
    </div>
  );
};

export default PriceCard;