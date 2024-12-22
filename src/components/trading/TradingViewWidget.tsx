import { useEffect, useRef, memo } from "react";

interface ChartConfig {
  height?: string;
  interval?: string;
  theme?: string;
  style?: string;
  toolbar_bg?: string;
  hide_side_toolbar?: boolean;
  hide_volume?: boolean;
  hide_top_toolbar?: boolean;
  studies?: string[];
  show_popup_button?: boolean;
  autosize?: boolean;
}

interface TradingViewWidgetProps {
  symbol: string;
  isMobile?: boolean;
  chartConfig?: ChartConfig;
}

export const TradingViewWidget = memo(({ 
  symbol, 
  isMobile = false,
  chartConfig
}: TradingViewWidgetProps) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!symbol || !container.current) return;

    const containerId = `tradingview_${Math.random().toString(36).substring(7)}`;
    container.current.id = containerId;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (typeof TradingView !== 'undefined' && container.current) {
        new TradingView.widget({
          width: "100%",
          height: chartConfig?.height || "100%",
          symbol: `BINANCE:${symbol}USDT`,
          interval: chartConfig?.interval || "D",
          timezone: "Etc/UTC",
          theme: chartConfig?.theme || "dark",
          style: chartConfig?.style || "1",
          locale: "en",
          toolbar_bg: chartConfig?.toolbar_bg || "#1B1B1D",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerId,
          show_popup_button: chartConfig?.show_popup_button ?? !isMobile,
          hide_side_toolbar: chartConfig?.hide_side_toolbar ?? isMobile,
          hide_top_toolbar: false, // Changed to false to show the timeframe selector
          studies: chartConfig?.studies || (isMobile ? [] : undefined),
          autosize: chartConfig?.autosize ?? true,
          save_image: false,
          backgroundColor: "rgba(19, 23, 34, 1)",
          gridColor: "rgba(67, 70, 81, 0.3)",
          hide_volume: chartConfig?.hide_volume ?? isMobile,
          disabled_features: [
            "use_localstorage_for_settings",
            "header_widget",
            "header_symbol_search",
            "header_settings",
            "header_indicators",
            "header_compare",
            "header_undo_redo",
            "header_screenshot",
            "header_chart_type",
            "timeframes_toolbar", // Remove this line to show the timeframe selector
          ],
          enabled_features: ["study_templates"],
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
      const existingScript = document.querySelector(`script[src="${script.src}"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [symbol]);

  return (
    <div 
      ref={container}
      className="w-full h-full bg-card/30 rounded-lg overflow-hidden"
      style={{ minHeight: isMobile ? "350px" : "600px" }}
    />
  );
});

TradingViewWidget.displayName = "TradingViewWidget";