/**
 * Price Chart Component
 * 
 * Renders interactive line charts for historical price data using Recharts.
 * Implements responsive design and clear data visualization principles.
 */

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { PriceData } from '../types/market';

interface PriceChartProps {
  /** Historical price data for chart rendering */
  data: PriceData[];
  
  /** Commodity type to display (maize or beans) */
  commodity: 'maize' | 'beans';
  
  /** Primary color for the chart lines */
  color: string;
}

/**
 * Price Chart component for visualizing historical price trends
 * 
 * Features:
 * - Interactive tooltips with detailed price information
 * - Responsive design that adapts to container size
 * - Dual-line display for both Nairobi and Mombasa prices
 * - Smooth animations and hover effects
 * - Professional styling with grid lines and legends
 * 
 * @param props - PriceChartProps containing data and styling options
 * @returns JSX element containing the price chart
 */
const PriceChart: React.FC<PriceChartProps> = ({ data, commodity, color }) => {
  /**
   * Custom tooltip component for displaying detailed price information
   */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-800 mb-2">{date}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm text-gray-600">{entry.name}:</span>
              <span className="text-sm font-semibold text-gray-800">
                KES {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  /**
   * Format date for X-axis display
   */
  const formatXAxisDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  /**
   * Format Y-axis values with K suffix for thousands
   */
  const formatYAxisValue = (value: number) => {
    return `${(value / 1000).toFixed(0)}K`;
  };

  /**
   * Get data keys based on commodity type
   */
  const getDataKeys = () => {
    if (commodity === 'maize') {
      return {
        nairobi: 'nairobiMaize',
        mombasa: 'mombasaMaize',
        nairobiLabel: 'Nairobi Maize',
        mombasaLabel: 'Mombasa Maize'
      };
    } else {
      return {
        nairobi: 'nairobiBeans',
        mombasa: 'mombasaBeans',
        nairobiLabel: 'Nairobi Beans',
        mombasaLabel: 'Mombasa Beans'
      };
    }
  };

  const dataKeys = getDataKeys();

  /**
   * Calculate secondary color (lighter version of primary)
   */
  const getSecondaryColor = (primaryColor: string) => {
    // Convert hex to RGB and make it lighter
    const hex = primaryColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Make it 30% lighter
    const lighten = (color: number) => Math.min(255, Math.floor(color + (255 - color) * 0.3));
    
    return `rgb(${lighten(r)}, ${lighten(g)}, ${lighten(b)})`;
  };

  const secondaryColor = getSecondaryColor(color);

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          {/* Grid and Axes */}
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#f0f0f0"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxisDate}
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={formatYAxisValue}
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={50}
          />
          
          {/* Tooltip and Legend */}
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ 
              paddingTop: '20px',
              fontSize: '14px'
            }}
          />
          
          {/* Price Lines */}
          <Line
            type="monotone"
            dataKey={dataKeys.nairobi}
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            name={dataKeys.nairobiLabel}
          />
          <Line
            type="monotone"
            dataKey={dataKeys.mombasa}
            stroke={secondaryColor}
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ fill: secondaryColor, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: secondaryColor, strokeWidth: 2 }}
            name={dataKeys.mombasaLabel}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;