import { Listenable } from 'pockito';
import { toolStore } from './toolStore';
import { getShape, doesShapeContainPoint } from './shapeUtil';
import generateId from 'util/generateId';

export const svgWidth = () => 0.9 * window.innerWidth;
export const svgHeight = () => window.innerHeight;

// Store
const store = new Listenable({
  initialState: {
    shapes: [],
    removedShapes: [],
    newShape: void 0,
    selectedShape: void 0,
  }
})

export { store as shapeStore }

// Actions: Remove shape and undo
export function removeLastShape() {
  store.set({
    shapes: store.shapes.slice(0, -1),
    removedShapes: store.removedShapes.concat(store.shapes.slice(-1)),
  });
}

export function undoRemoveShape() {
  store.set({
    removedShapes: store.removedShapes.slice(0, -1),
    shapes: store.shapes.concat(store.removedShapes.slice(-1)),
  })
}

// Select shape
export function selectShapeAtPoint(point) {
  const shape = store.shapes.slice().reverse().find(shape => doesShapeContainPoint(shape, point));

  store.set({
    selectedShape: store.selectedShape === shape ? void 0 : shape,
  })
}

// Actions: Create new shape
export function startNewShape(point) {
  store.set({
    newShape: {
      id: generateId(),
      fill: toolStore.fill,
      fillOpacity: 0.5,
      stroke: toolStore.stroke,
      strokeOpacity: 0.3,
      strokeWidth: toolStore.strokeWidth,
      startPoint: point,
      ...getShape(toolStore.tool, point, point),
    },
  });
}

export function setEndPoint(endPoint) {
  const { newShape } = store;

  store.set({
    newShape: {
      ...newShape,
      ...getShape(newShape.type, newShape.startPoint, endPoint),
    },
  });
}

export function finishShape() {
  store.set({
    shapes: store.shapes.concat([store.newShape]),
    removedShapes: [],
    newShape: void 0,
  });
}
