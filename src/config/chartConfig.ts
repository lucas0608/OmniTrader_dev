export const chartConfig = {
  layout: {
    background: { type: 'solid', color: '#1a1a1a' },
    textColor: '#d1d4dc',
  },
  grid: {
    vertLines: { color: '#2B2B43' },
    horzLines: { color: '#2B2B43' },
  },
  crosshair: {
    mode: 1,
    vertLine: {
      width: 1,
      color: '#758696',
      style: 3,
    },
    horzLine: {
      width: 1,
      color: '#758696',
      style: 3,
    },
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
    borderColor: '#2B2B43',
    textColor: '#d1d4dc',
  },
  rightPriceScale: {
    borderColor: '#2B2B43',
    textColor: '#d1d4dc',
  },
  handleScroll: {
    mouseWheel: true,
    pressedMouseMove: true,
    horzTouchDrag: true,
    vertTouchDrag: true,
  },
  handleScale: {
    axisPressedMouseMove: true,
    mouseWheel: true,
    pinch: true,
  },
};