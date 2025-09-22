import { TrendingUp, TrendingDown, DollarSign, Shield, AlertTriangle } from 'lucide-react';

interface MetricsDashboardProps {
  metrics: {
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
    solvencyRatio: number;
    runwayMonths: number;
    assetDiversification: {
      stablecoins: number;
      crypto: number;
      nfts: number;
      lpTokens: number;
      other: number;
    };
    riskMetrics: {
      concentrationRisk: 'low' | 'medium' | 'high';
      volatilityRisk: 'low' | 'medium' | 'high';
      liquidityRisk: 'low' | 'medium' | 'high';
      counterpartyRisk: 'low' | 'medium' | 'high';
    };
  };
}

export function MetricsDashboard({ metrics }: MetricsDashboardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
    }
  };

  const getRiskIcon = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return <Shield className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalAssets)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Liabilities</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalLiabilities)}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Worth</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.netWorth)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Runway</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.runwayMonths} months</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Asset Diversification */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Diversification</h3>
        <div className="space-y-3">
          {Object.entries(metrics.assetDiversification).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {value.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(metrics.riskMetrics).map(([key, risk]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                {getRiskIcon(risk)}
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(risk)}`}>
                {risk}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Solvency Ratio */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Solvency Ratio</h3>
            <p className="text-sm text-gray-600 mt-1">
              Assets to Liabilities ratio - higher is better
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              {metrics.solvencyRatio.toFixed(1)}:1
            </div>
            <div className={`text-sm font-medium ${
              metrics.solvencyRatio >= 2 ? 'text-green-600' : 
              metrics.solvencyRatio >= 1.5 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {metrics.solvencyRatio >= 2 ? 'Excellent' : 
               metrics.solvencyRatio >= 1.5 ? 'Good' : 'Needs Attention'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
