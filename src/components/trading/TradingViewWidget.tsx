import { useEffect, useRef, memo } from "react";

interface TradingViewWidgetProps {
  symbol: string;
}

export const TradingViewWidget = memo(({ symbol }: TradingViewWidgetProps) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (container.current && typeof TradingView !== 'undefined') {
        const isMobile = window.innerWidth < 768;
        
        // Desktop configuration
        const desktopConfig = {
          width: "100%",
          height: "100%",
          symbol: `BINANCE:${symbol}USDT`,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#1B1B1D",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: container.current.id,
          studies: ["RSI@tv-basicstudies"],
          show_popup_button: true,
        };

        // Mobile configuration
        const mobileConfig = {
          width: "100%",
          height: "100%",
          symbol: `BINANCE:${symbol}USDT`,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#1B1B1D",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: container.current.id,
          hide_side_toolbar: true,
          hide_top_toolbar: true,
          studies: [],
          show_popup_button: false,
        };

        const widget = new TradingView.widget(isMobile ? mobileConfig : desktopConfig);

        return () => {
          if (widget && typeof widget.remove === 'function') {
            try {
              widget.remove();
            } catch (e) {
              console.warn('Error cleaning up widget:', e);
            }
          }
        };
      }
    };

    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [symbol]);

  return (
    <div 
      ref={container}
      id={`tradingview_${Math.random().toString(36).substring(7)}`}
      className="w-full h-full bg-card/30"
    />
  );
});

TradingViewWidget.displayName = "TradingViewWidget";