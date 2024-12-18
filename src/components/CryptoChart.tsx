import { useEffect, useRef } from 'react';

interface CryptoChartProps {
  symbol?: string;
}

const CryptoChart = ({ symbol = 'BTC' }: CryptoChartProps) => {
  const container = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (container.current) {
      // Remove existing widget if any
      if (scriptRef.current) {
        scriptRef.current.remove();
      }

      // Create new script element
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        if (typeof window.TradingView !== 'undefined') {
          new window.TradingView.widget({
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
    };
  }, [symbol]);

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border">
      <div id="tradingview_chart" ref={container} className="w-full h-full" />
    </div>
  );
};

export default CryptoChart;