import { useEffect, useRef, useState } from "react";
import { CryptoSearch } from "./crypto/CryptoSearch";
import { debounce } from "lodash";

interface CryptoChartProps {
  symbol: string;
  onPriceUpdate?: (price: number) => void;
  onSearchOpen?: () => void;
}

const CryptoChart = ({ symbol, onPriceUpdate, onSearchOpen }: CryptoChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [widgetInstance, setWidgetInstance] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (!isMounted || !containerRef.current) return;

      if (typeof TradingView !== "undefined") {
        try {
          // Safely cleanup previous widget if it exists
          if (widgetInstance) {
            try {
              widgetInstance.remove();
            } catch (e) {
              console.warn("Error cleaning up previous widget:", e);
            }
          }

          const widget = new TradingView.widget({
            autosize: true,
            symbol: `BINANCE:${symbol}USDT`,
            interval: "D",
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            toolbar_bg: "#f1f3f6",
            enable_publishing: false,
            hide_side_toolbar: false,
            allow_symbol_change: true,
            container_id: containerRef.current.id,
            hide_top_toolbar: false,
            save_image: false,
            studies: [],
            show_popup_button: false,
            popup_width: "1000",
            popup_height: "650",
          });

          setWidgetInstance(widget);
        } catch (error) {
          console.error("Error creating TradingView widget:", error);
        }
      }
    };

    // Only append script if it doesn't exist
    if (!document.querySelector('script[src="https://s3.tradingview.com/tv.js"]')) {
      document.head.appendChild(script);
    }

    // WebSocket for price updates only
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@trade`);
    
    // Debounce the price update to prevent too frequent updates
    const debouncedPriceUpdate = debounce((price: number) => {
      if (onPriceUpdate && isMounted) {
        onPriceUpdate(price);
      }
    }, 1000); // Update price maximum once per second

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.p);
      debouncedPriceUpdate(price);
    };

    return () => {
      isMounted = false;
      ws.close();
      debouncedPriceUpdate.cancel();
      
      // Safely cleanup TradingView widget
      if (widgetInstance) {
        try {
          widgetInstance.remove();
        } catch (e) {
          console.warn("Error cleaning up widget:", e);
        }
      }
      
      // Clear container contents
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, onPriceUpdate]);

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{symbol}/USDT</h2>
        </div>
        <CryptoSearch onSelect={(newSymbol) => console.log("Selected:", newSymbol)} />
      </div>
      <div 
        ref={containerRef} 
        id={`tradingview_${Math.random().toString(36).substring(7)}`}
        className="w-full h-[400px]" 
      />
    </div>
  );
};

export default CryptoChart;