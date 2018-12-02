export function getShape(type, startPoint, endPoint) {
  switch (type) {
    case 'rect': {
      const x = Math.min(startPoint.x, endPoint.x);
      const y = Math.min(startPoint.y, endPoint.y);
      const width = Math.max(startPoint.x, endPoint.x) - x;
      const height = Math.max(startPoint.y, endPoint.y) - y;
      return { type, x, y, width, height };
    }
    case 'circle': {
      const rx = Math.abs(startPoint.x - endPoint.x);
      const ry = Math.abs(startPoint.y - endPoint.y);
      return {
        type,
        cx: startPoint.x,
        cy: startPoint.y,
        r: Math.max(rx, ry),
      };
    }
    case 'ellipse': {
      const rx = Math.abs(startPoint.x - endPoint.x);
      const ry = Math.abs(startPoint.y - endPoint.y);
      return {
        type,
        cx: startPoint.x,
        cy: startPoint.y,
        rx: rx,
        ry: ry,
      };
    }
    default:
      console.error(`getShape: No support for shapes of type "${type}"`);
      return false;
  }
}

export function doesShapeContainPoint(shape, point) {
  switch (shape.type) {
    case 'rect':
      return shape.x <= point.x && point.x <= (shape.x + shape.width)
          && shape.y <= point.y && point.y <= (shape.y + shape.height);
    case 'circle':
      return Math.sqrt(Math.pow(shape.cx - point.x, 2) + Math.pow(shape.cy - point.y, 2)) < shape.r;
    case 'ellipse':
      return (
        Math.pow(shape.cx - point.x, 2) / Math.pow(shape.rx, 2) +
        Math.pow(shape.cy - point.y, 2) / Math.pow(shape.ry, 2)
      ) <= 1;
    default:
      console.error(`doesShapeContainPoint: No support for shapes of type "${shape.type}"`);
      return false;
  }
}
