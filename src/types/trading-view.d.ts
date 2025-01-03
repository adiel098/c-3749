interface TradingView {
  widget: new (config: {
    autosize?: boolean;
    width?: string | number;
    height?: string | number;
    symbol: string;
    interval: string;
    timezone: string;
    theme: string;
    style: string;
    locale: string;
    toolbar_bg: string;
    enable_publishing: boolean;
    hide_side_toolbar: boolean;
    allow_symbol_change: boolean;
    container_id: string;
    hide_top_toolbar?: boolean;
    save_image?: boolean;
    studies?: string[];
    show_popup_button?: boolean;
    popup_width?: string;
    popup_height?: string;
    backgroundColor?: string;
    gridColor?: string;
    hide_volume?: boolean;
    disabled_features?: string[];
    enabled_features?: string[];
  }) => {
    remove: () => void;
  };
}

declare global {
  interface Window {
    TradingView: TradingView;
  }
  const TradingView: TradingView;
}

export {};