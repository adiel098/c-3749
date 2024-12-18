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
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        if (typeof window.TradingView !== 'undefined') {
          new window.TradingView.widget({
            "width": "100%",
            "height": "500",
            "symbol": `BINANCE:${symbol}USDT`,
            "interval": "1",
            "timezone": "Asia/Jerusalem",
            "theme": "dark",
            "style": "1",
            "locale": "he_IL",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "container_id": "tradingview_chart",
            "hide_side_toolbar": false,
            "studies": [],
            "save_image": false,
            "autosize": true,
            "withdateranges": true,
            "hide_volume": false,
            "calendar": false,
            "support_host": "https://www.tradingview.com",
            "overrides": {
              "mainSeriesProperties.showPriceLine": true
            },
            "custom_css_url": "",
            "loading_screen": { "backgroundColor": "transparent" },
            "debug": true,
            "auto_save_delay": 5
          });

          // Add event listener for price updates
          window.addEventListener('message', (event) => {
            try {
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
                    console.log('Price update received:', price);
                    onPriceUpdate(price);
                  }
                }
              }
            } catch (error) {
              console.error('Error processing price update:', error);
            }
          });
        }
      };

      scriptRef.current = script;
      container.current.appendChild(script);
    }

    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
      }
      window.removeEventListener('message', () => {});
    };
  }, [symbol, onPriceUpdate]);

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border">
      <div id="tradingview_chart" ref={container} className="w-full h-full" />
    </div>
  );
};

export default CryptoChart;