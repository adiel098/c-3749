import { useEffect, useRef, memo } from "react";

interface TradingViewWidgetProps {
  symbol: string;
  isMobile?: boolean;
}

export const TradingViewWidget = memo(({ symbol, isMobile = false }: TradingViewWidgetProps) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!symbol) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (container.current && typeof TradingView !== 'undefined') {
        console.log("Initializing TradingView with symbol:", symbol);
        const widget = new TradingView.widget({
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
          show_popup_button: !isMobile,
          hide_side_toolbar: isMobile,
          hide_top_toolbar: false,
          studies: isMobile ? [] : undefined,
          autosize: true,
          save_image: false
        });

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
  }, [symbol, isMobile]);

  return (
    <div 
      ref={container}
      id={`tradingview_${Math.random().toString(36).substring(7)}`}
      className="w-full h-full bg-card/30"
    />
  );
});

TradingViewWidget.displayName = "TradingViewWidget";