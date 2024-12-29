export interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface ChartConfig {
  layout: {
    background: { type: string; color: string };
    textColor: string;
  };
  grid: {
    vertLines: { color: string };
    horzLines: { color: string };
  };
  crosshair: {
    mode: number;
    vertLine: {
      width: number;
      color: string;
      style: number;
    };
    horzLine: {
      width: number;
      color: string;
      style: number;
    };
  };
  timeScale: {
    timeVisible: boolean;
    secondsVisible: boolean;
    borderColor: string;
    textColor: string;
  };
  rightPriceScale: {
    borderColor: string;
    textColor: string;
  };
  handleScroll: {
    mouseWheel: boolean;
    pressedMouseMove: boolean;
    horzTouchDrag: boolean;
    vertTouchDrag: boolean;
  };
  handleScale: {
    axisPressedMouseMove: boolean;
    mouseWheel: boolean;
    pinch: boolean;
  };
}