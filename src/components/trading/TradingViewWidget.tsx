import { useEffect, useRef, memo } from "react";

interface TradingViewWidgetProps {
  symbol: string;
  isMobile?: boolean;
}

export const TradingViewWidget = memo(({ symbol, isMobile = false }: TradingViewWidgetProps) => {
  const container = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!symbol || !container.current) return;

    const containerId = `tradingview_${Math.random().toString(36).substring(7)}`;
    container.current.id = containerId;

    const loadTradingView = () => {
      if (typeof TradingView !== 'undefined' && container.current) {
        console.log("Creating TradingView widget for symbol:", symbol);
        new TradingView.widget({
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
          container_id: containerId,
          show_popup_button: !isMobile,
          hide_side_toolbar: isMobile,
          hide_top_toolbar: false,
          studies: isMobile ? [] : undefined,
          autosize: true,
          save_image: false,
          backgroundColor: "rgba(19, 23, 34, 1)",
          gridColor: "rgba(67, 70, 81, 0.3)",
          hide_volume: isMobile,
          disabled_features: ["use_localstorage_for_settings"],
          enabled_features: ["study_templates"],
        });
      }
    };

    // Create and load TradingView script
    if (!scriptRef.current) {
      scriptRef.current = document.createElement("script");
      scriptRef.current.type = "text/javascript";
      scriptRef.current.src = "https://s3.tradingview.com/tv.js";
      scriptRef.current.async = true;
      scriptRef.current.onload = loadTradingView;
      document.head.appendChild(scriptRef.current);
    } else {
      loadTradingView();
    }

    return () => {
      // Cleanup
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol, isMobile]);

  return (
    <div 
      ref={container}
      className="w-full h-full bg-card/30 rounded-lg overflow-hidden"
      style={{ minHeight: isMobile ? "300px" : "600px" }}
    />
  );
});

TradingViewWidget.displayName = "TradingViewWidget";