import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface CryptoChartProps {
  symbol?: string;
}

const CryptoChart = ({ symbol = 'BTC' }: CryptoChartProps) => {
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
          const widget = new window.TradingView.widget({
            width: '100%',
            height: 500,
            symbol: `BINANCE:${symbol}USDT`,
            interval: '1',
            timezone: 'Asia/Jerusalem',
            theme: 'dark',
            style: '1',
            locale: 'he_IL',
            toolbar_bg: '#f1f3f6',
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: 'tradingview_chart',
            autosize: true,
            studies: [],
            save_image: false,
            hide_side_toolbar: false,
            withdateranges: true,
            hide_volume: false,
            // Add event handlers through the widget configuration
            onSymbolChange: (symbolData: any) => {
              if (symbolData && symbolData.price) {
                window.postMessage({ name: 'tradingview-price', price: symbolData.price }, '*');
              }
            },
          });

          // Start polling for price updates
          const priceUpdateInterval = setInterval(() => {
            try {
              const chartFrame = document.querySelector('#tradingview_chart iframe');
              if (chartFrame) {
                const priceElement = (chartFrame as any).contentWindow?.document?.querySelector('.price-KxHzP6nH');
                if (priceElement) {
                  const price = parseFloat(priceElement.textContent);
                  if (!isNaN(price)) {
                    window.postMessage({ name: 'tradingview-price', price }, '*');
                  }
                }
              }
            } catch (error) {
              console.error('Error getting price:', error);
            }
          }, 1000);

          // Cleanup interval on component unmount
          return () => clearInterval(priceUpdateInterval);
        }
      };

      scriptRef.current = script;
      container.current.appendChild(script);
    }

    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
      }
    };
  }, [symbol]);

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border">
      <div id="tradingview_chart" ref={container} className="w-full h-full" />
    </div>
  );
};

export default CryptoChart;