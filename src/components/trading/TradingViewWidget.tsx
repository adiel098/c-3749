import { useEffect, useRef, useState } from "react";

interface TradingViewWidgetProps {
  symbol: string;
}

export const TradingViewWidget = ({ symbol }: TradingViewWidgetProps) => {
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

    return () => {
      isMounted = false;
      
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
  }, [symbol]);

  return (
    <div 
      ref={containerRef} 
      id={`tradingview_${Math.random().toString(36).substring(7)}`}
      className="w-full h-[400px]" 
    />
  );
};