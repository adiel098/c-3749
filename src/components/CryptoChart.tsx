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
    const loadTradingViewScript = () => {
      if (container.current) {
        if (scriptRef.current) {
          scriptRef.current.remove();
        }

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          if (typeof window.TradingView !== 'undefined') {
            const widget = new window.TradingView.widget({
              width: "100%",
              height: "500",
              symbol: `BINANCE:${symbol}USDT`,
              interval: "1",
              timezone: "Asia/Jerusalem",
              theme: "dark",
              style: "1",
              locale: "he_IL",
              toolbar_bg: "#f1f3f6",
              enable_publishing: false,
              allow_symbol_change: true,
              container_id: "tradingview_chart",
              hide_side_toolbar: false,
              studies: [],
              save_image: false,
              autosize: true,
              withdateranges: true,
              hide_volume: false,
              calendar: false,
              support_host: "https://www.tradingview.com",
              overrides: {
                "mainSeriesProperties.showPriceLine": true
              },
              loading_screen: { backgroundColor: "transparent" },
              debug: true,
              auto_save_delay: 5,
              library_path: "https://s3.tradingview.com/tv.js",
              disabled_features: ["use_localstorage_for_settings"],
              enabled_features: ["study_templates"],
              charts_storage_url: "https://saveload.tradingview.com",
              charts_storage_api_version: "1.1",
              client_id: "tradingview.com",
              user_id: "public_user",
              fullscreen: false,
              studies_overrides: {},
              time_frames: [
                { text: "1D", resolution: "1" },
                { text: "5D", resolution: "5" },
                { text: "1M", resolution: "30" },
                { text: "3M", resolution: "60" },
                { text: "6M", resolution: "120" },
                { text: "1Y", resolution: "D" },
              ],
              onReady: () => {
                widget.onChartReady(() => {
                  console.log('Chart is ready');
                  // Subscribe to real-time updates
                  widget.chart().onSymbolChange().subscribe(null, () => {
                    const symbolInfo = widget.chart().symbol();
                    console.log('Symbol changed to:', symbolInfo);
                  });
                });
              }
            });

            // Set up a custom event handler for price updates
            const handlePriceUpdate = (event: MessageEvent) => {
              try {
                if (
                  event.data && 
                  typeof event.data === 'object' && 
                  'name' in event.data &&
                  event.data.name === 'tradingview:onchange'
                ) {
                  const price = widget.chart().symbol().price;
                  if (price && !isNaN(price) && onPriceUpdate) {
                    console.log('Price update received:', price);
                    onPriceUpdate(price);
                  }
                }
              } catch (error) {
                console.error('Error processing price update:', error);
              }
            };

            window.addEventListener('message', handlePriceUpdate);
            return () => window.removeEventListener('message', handlePriceUpdate);
          }
        };

        scriptRef.current = script;
        container.current.appendChild(script);
      }
    };

    loadTradingViewScript();

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