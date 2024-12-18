import { useEffect, useRef } from 'react';
import { CryptoSearch } from './crypto/CryptoSearch';
import { PriceHeader } from './crypto/PriceHeader';
import { useWebSocketPrice } from '@/hooks/useWebSocketPrice';
import { useCryptoPrice } from '@/hooks/useCryptoPrice';

interface CryptoChartProps {
  symbol: string;
  onPriceUpdate?: (price: number) => void;
  onSearchOpen?: () => void;
}

const CryptoChart = ({ symbol, onPriceUpdate, onSearchOpen }: CryptoChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentPrice = useWebSocketPrice(symbol, onPriceUpdate);
  const { data: priceData } = useCryptoPrice(symbol);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof TradingView !== 'undefined' && containerRef.current) {
        new TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${symbol}USDT`,
          interval: '1',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: 'tradingview_chart',
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      const existingWidget = document.getElementById('tradingview_chart');
      if (existingWidget) {
        existingWidget.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <PriceHeader 
          symbol={symbol} 
          price={currentPrice} 
          priceChange={priceData?.price_change_24h} 
        />
        <CryptoSearch 
          searchOpen={!!onSearchOpen} 
          setSearchOpen={(open) => onSearchOpen && onSearchOpen()} 
          onSelect={() => {}} 
        />
      </div>
      <div ref={containerRef} id="tradingview_chart" className="h-[600px]" />
    </div>
  );
};

export default CryptoChart;