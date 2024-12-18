import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface CryptoChartProps {
  symbol?: string;
  onPriceUpdate?: (price: number) => void;
}

const CryptoChart = ({ symbol = 'BTC', onPriceUpdate }: CryptoChartProps) => {
  const container = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (container.current) {
      if (scriptRef.current) {
        scriptRef.current.remove();
      }

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.async = true;
      script.type = 'text/javascript';
      script.innerHTML = JSON.stringify({
        "autosize": true,
        "symbol": `BINANCE:${symbol}USDT`,
        "interval": "1",
        "timezone": "Asia/Jerusalem",
        "theme": "dark",
        "style": "1",
        "locale": "he_IL",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com",
        "container_id": "tradingview_chart",
        "height": "500",
        "save_image": false,
        "hide_side_toolbar": false,
        "withdateranges": true,
        "hide_volume": false,
        "studies": []
      });

      // Add event listener for price updates
      window.addEventListener('message', (event) => {
        if (
          event.data && 
          typeof event.data === 'object' && 
          'name' in event.data &&
          event.data.name === 'tradingview:onchange' &&
          'data' in event.data
        ) {
          const data = event.data.data;
          if (data && typeof data === 'object' && 'last_price' in data) {
            const price = parseFloat(data.last_price);
            if (!isNaN(price) && onPriceUpdate) {
              onPriceUpdate(price);
            }
          }
        }
      });

      scriptRef.current = script;
      container.current.appendChild(script);
    }

    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
      }
    };
  }, [symbol, onPriceUpdate]);

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border">
      <div id="tradingview_chart" ref={container} className="w-full h-full" />
    </div>
  );
};

export default CryptoChart;