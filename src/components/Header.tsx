/**
 * Header Component
 * 
 * Displays the main navigation and title for the market prices dashboard.
 * Includes real-time update information and responsive design elements.
 */

import React from 'react';
import { BarChart3, Clock, Wifi } from 'lucide-react';

interface HeaderProps {
  /** Timestamp of the last data update */
  lastUpdated: Date;
}

/**
 * Header component with branding and update status
 * 
 * @param lastUpdated - The timestamp when data was last refreshed
 * @returns JSX element containing the header
 */
const Header: React.FC<HeaderProps> = ({ lastUpdated }) => {
  /**
   * Format the last updated time for display
   * Shows time in user-friendly format
   */
  const formatUpdateTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <header className="bg-white shadow-lg border-b-4 border-green-500">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Logo and Title Section */}
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Kenya Market Prices
              </h1>
              <p className="text-gray-600 text-sm">
                Real-time commodity prices for Nairobi & Mombasa
              </p>
            </div>
          </div>

          {/* Status and Update Information */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Live Status Indicator */}
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
              <Wifi className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Live Data
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            {/* Last Updated Information */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <Clock className="w-4 h-4 text-gray-600" />
              <div className="text-sm">
                <span className="text-gray-500">Last updated:</span>
                <span className="ml-1 font-medium text-gray-700">
                  {formatUpdateTime(lastUpdated)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Market Information Banner */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-sm text-blue-800">
              <strong>Market Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM EAT
            </p>
            <p className="text-sm text-blue-600">
              Prices in Kenyan Shillings (KES) per 90kg bag
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;