import { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, MapPin } from 'lucide-react';
import Header from './components/Header';
import PriceCard from './components/PriceCard';
import PriceChart from './components/PriceChart';
import MarketAnalytics from './components/MarketAnalytics';
import { MarketData, PriceData } from './types/market';
import { generateMarketData, generateHistoricalData } from './data/marketData';

/**
 * Main App Component
 * 
 * This is the root component that orchestrates the entire market prices dashboard.
 * It manages the state for current market data and historical price trends,
 * implementing real-time updates to simulate live market conditions.
 * 
 * Key Features:
 * - Real-time price updates every 30 seconds
 * - Historical data visualization
 * - Market analytics and insights
 * - Responsive layout for all device sizes
 */
function App() {
  // State management for current market prices and historical data
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [historicalData, setHistoricalData] = useState<PriceData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  /**
   * Initialize market data on component mount
   * Generates initial market prices and historical trends
   */
  useEffect(() => {
    const initializeData = () => {
      const currentData = generateMarketData();
      const historical = generateHistoricalData();
      
      setMarketData(currentData);
      setHistoricalData(historical);
      setLastUpdated(new Date());
    };

    initializeData();
  }, []);

  /**
   * Set up real-time price updates
   * Updates market prices every 30 seconds to simulate live market conditions
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedData = generateMarketData();
      setMarketData(updatedData);
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  /**
   * Calculate market statistics for analytics
   * Provides insights into price trends and market volatility
   */
  const calculateMarketStats = () => {
    if (marketData.length === 0) return null;

    // Calculate average prices across all markets
    const avgMaizePrice = marketData.reduce((sum, item) => sum + item.maizePrice, 0) / marketData.length;
    const avgBeansPrice = marketData.reduce((sum, item) => sum + item.beansPrice, 0) / marketData.length;

    // Find highest and lowest prices
    const maxMaizePrice = Math.max(...marketData.map(item => item.maizePrice));
    const minMaizePrice = Math.min(...marketData.map(item => item.maizePrice));
    const maxBeansPrice = Math.max(...marketData.map(item => item.beansPrice));
    const minBeansPrice = Math.min(...marketData.map(item => item.beansPrice));

    return {
      avgMaizePrice,
      avgBeansPrice,
      maxMaizePrice,
      minMaizePrice,
      maxBeansPrice,
      minBeansPrice,
      priceSpreadMaize: maxMaizePrice - minMaizePrice,
      priceSpreadBeans: maxBeansPrice - minBeansPrice
    };
  };

  const marketStats = calculateMarketStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Component */}
      <Header lastUpdated={lastUpdated} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Market Overview Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-800">Market Overview</h2>
          </div>
          
          {/* Current Prices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {marketData.map((data) => (
              <div key={`${data.city}-${data.commodity}`} className="space-y-4">
                <PriceCard
                  city={data.city}
                  commodity="Maize"
                  price={data.maizePrice}
                  change={data.maizeChange}
                  unit="KES/90kg bag"
                />
                <PriceCard
                  city={data.city}
                  commodity="Beans"
                  price={data.beansPrice}
                  change={data.beansChange}
                  unit="KES/90kg bag"
                />
              </div>
            ))}
          </div>

          {/* Market Statistics Cards */}
          {marketStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Maize Price</p>
                    <p className="text-2xl font-bold text-gray-900">
                      KES {marketStats.avgMaizePrice.toFixed(0)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Beans Price</p>
                    <p className="text-2xl font-bold text-gray-900">
                      KES {marketStats.avgBeansPrice.toFixed(0)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Maize Price Spread</p>
                    <p className="text-2xl font-bold text-gray-900">
                      KES {marketStats.priceSpreadMaize.toFixed(0)}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-orange-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Beans Price Spread</p>
                    <p className="text-2xl font-bold text-gray-900">
                      KES {marketStats.priceSpreadBeans.toFixed(0)}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Price Trends Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-800">Price Trends</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Maize Price Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Maize Prices - 30 Day Trend
              </h3>
              <PriceChart 
                data={historicalData} 
                commodity="maize"
                color="#22C55E"
              />
            </div>
            
            {/* Beans Price Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Beans Prices - 30 Day Trend
              </h3>
              <PriceChart 
                data={historicalData} 
                commodity="beans"
                color="#3B82F6"
              />
            </div>
          </div>
        </section>

        {/* Market Analytics Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-8 h-8 text-orange-600" />
            <h2 className="text-3xl font-bold text-gray-800">Market Analytics</h2>
          </div>
          
          <MarketAnalytics 
            marketData={marketData}
            historicalData={historicalData}
          />
        </section>

        {/* Market Information Footer */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Market Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-3">Data Sources</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Kenya Agricultural Commodity Exchange (KACE)</li>
                <li>• Regional Market Information Systems</li>
                <li>• Local Market Surveys</li>
                <li>• Agricultural Ministry Reports</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-3">Market Notes</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Prices are for 90kg bags (standard market unit)</li>
                <li>• Data updated every 30 seconds during market hours</li>
                <li>• Price variations reflect supply-demand dynamics</li>
                <li>• Transportation costs affect regional price differences</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


export default App;
