import { Listenable } from 'pockito'

export const svgWidth = () => 0.9 * window.innerWidth;
export const svgHeight = () => window.innerHeight;

// Store
const store = new Listenable({
  initialState: {
    viewBox: {
      x: 0,
      y: 0,
      width: svgWidth(),
      height: svgHeight(),
    },
  }
})

export { store as viewBoxStore }

// Selectors
function getArea(screenArea) {
  const { viewBox } = store;

  return {
    x: viewBox.x + screenArea.x * viewBox.width / svgWidth(),
    y: viewBox.y + screenArea.y * viewBox.height / svgHeight(),
    width: screenArea.width * viewBox.width / svgWidth(),
    height: screenArea.height * viewBox.height / svgHeight(),
  };
}

function getPoint(point) {
  const { x, y } = getArea(point);
  return { x, y };
}

export function getEventPoint(event) {
  return getPoint({
    x: event.pageX,
    y: event.pageY,
  });
}

// Actions
export function zoom(event) {
  const { x, y, width, height } = store.viewBox;

  const dZ = {
    x: svgWidth() * (event.altKey ? -0.2 : 0.2),
    y: svgHeight() * (event.altKey ? -0.2 : 0.2),
  };

  const isWithinAllowedZoom = (
    100 < Math.min(width - dZ.x, height - dZ.y)
    && Math.max(width - dZ.x, height - dZ.y) <= 10000
  );
  if (!isWithinAllowedZoom) {
    return;
  }

  store.set({
    viewBox: {
      x: x + dZ.x * event.pageX / svgWidth(),
      y: y + dZ.y * event.pageY / svgHeight(),
      width: width - dZ.x,
      height: height - dZ.y,
    }
  });
}
