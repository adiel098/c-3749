import { TrendingUpIcon } from "lucide-react";

const MarketStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
      <div className="p-6 rounded-lg bg-secondary/10 backdrop-blur-sm border border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Market Cap</h3>
          <TrendingUpIcon className="w-4 h-4 text-success" />
        </div>
      </div>
      
      <div className="p-6 rounded-lg bg-secondary/10 backdrop-blur-sm border border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">24h Volume</h3>
          <TrendingUpIcon className="w-4 h-4 text-success" />
        </div>
      </div>
      
      <div className="p-6 rounded-lg bg-secondary/10 backdrop-blur-sm border border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">BTC Dominance</h3>
          <TrendingUpIcon className="w-4 h-4 text-warning" />
        </div>
      </div>
    </div>
  );
};

export default MarketStats;