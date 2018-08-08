import ReactDOM from 'react-dom';
import React from 'react';
import * as S from './Editor.style.js';

import Shape from './Shape/Shape';
import ToolSelector from './ToolSelector/ToolSelector';
import ColorPicker from './ColorPicker/ColorPicker';

import generateId from 'util/generateId';

function getShape(type, startPoint, endPoint) {
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

function doesShapeContainPoint(shape, point) {
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

function viewBoxString({ x, y, width, height }) {
  return `${x} ${y} ${width} ${height}`;
}

const halfOpaque = '80';

export default class Editor extends React.Component {

  canvasWidth = () => 0.9 * window.innerWidth;
  canvasHeight = () => window.innerHeight;

  state = {
    shapes: [],
    removedShapes: [],
    selectedShape: void 0,
    tool: 'ellipse',
    fill: '#ffdab9',
    stroke: '#ff7f50',
    strokeWidth: 1,
    newShape: void 0,
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    viewBox: {
      x: 0,
      y: 0,
      width: this.canvasWidth(),
      height: this.canvasHeight(),
    },
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }
  onKeyDown = (event) => {
    // eslint-disable-next-line default-case
    switch (event.key) {
      case 'Alt':
        this.setState({
          altKey: true
        });
        break;
      case 'Control':
        this.setState({
          ctrlKey: true
        });
        break;
      case 'Shift':
        this.setState({
          shiftKey: true
        });
        break;
    }

    if (event.ctrlKey) {
      // eslint-disable-next-line default-case
      switch (event.key) {
        case 'z':
        case 'Z':
          this.setState(state => ({
            shapes: state.shapes.slice(0, -1),
            removedShapes: state.removedShapes.concat(state.shapes.slice(-1)),
          }));
          break;
        case 'y':
        case 'Y':
          this.setState(state => ({
            removedShapes: state.removedShapes.slice(0, -1),
            shapes: state.shapes.concat(state.removedShapes.slice(-1)),
          }));
          break;
      }
    }
  }
  onKeyUp = (event) => {
    // eslint-disable-next-line default-case
    switch (event.key) {
      case 'Alt':
        this.setState({
          altKey: false
        });
        break;
      case 'Control':
        this.setState({
          ctrlKey: false
        });
        break;
      case 'Shift':
        this.setState({
          shiftKey: false
        });
        break;
    }
  }

  onMouseDown = (event) => {
    if (this.state.tool === 'selector') {
      const point = this.getPoint(event);

      this.setState({
        selectedShape: this.state.shapes.slice().reverse().find(shape => doesShapeContainPoint(shape, point))
      });
      return;
    }
    if (this.state.tool === 'zoom') {
      const { x, y, width, height } = this.state.viewBox;

      const dZ = {
        x: this.canvasWidth() * (event.altKey ? -0.2 : 0.2),
        y: this.canvasHeight() * (event.altKey ? -0.2 : 0.2),
      };

      const isWithinAllowedZoom = (
        100 < Math.min(width - dZ.x, height - dZ.y)
        && Math.max(width - dZ.x, height - dZ.y) <= 10000
      );
      if (!isWithinAllowedZoom) {
        return;
      }

      this.setState({
        viewBox: {
          x: x + dZ.x * event.pageX / this.canvasWidth(),
          y: y + dZ.y * event.pageY / this.canvasHeight(),
          width: width - dZ.x,
          height: height - dZ.y,
        }
      });
      return;
    }
    this.setState({
      newShape: {
        id: generateId(),
        fill: this.state.fill + halfOpaque,
        stroke: this.state.stroke,
        strokeWidth: this.state.strokeWidth,
        ...getShape(this.state.tool, this.getPoint(event), this.getPoint(event)),
        startPoint: this.getPoint(event), // <- Only used in onMouseMouve
      },
    });

    this.node.addEventListener('mousemove', this.onMouseMove);
    this.node.addEventListener('mouseup', this.onMouseUp);
  }
  onMouseMove = (event) => {
    this.setState(state => ({
      newShape: {
        ...state.newShape,
        ...getShape(state.newShape.type, state.newShape.startPoint, this.getPoint(event)),
      },
    }));
  }
  onMouseUp = (event) => {
    this.node.removeEventListener('mousemove', this.onMouseMove);
    this.node.removeEventListener('mouseup', this.onMouseUp);

    this.setState(state => ({
      shapes: state.shapes.concat([state.newShape]),
      removedShapes: [],
      newShape: void 0,
    }));
  }

  getBlobUrl = (event) => {
    if (!this.node) {
      return void 0;
    }

    const { x, y, width, height } = this.node.getBoundingClientRect();

    const svgText = this.node.outerHTML.replace(
      '<svg',
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width-x}" height="${height-y}"`
    );
    const blob = new Blob([svgText], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);

    return url;
  }

  getMapArea(screenArea) {
    const { viewBox } = this.state;

    return {
      x: viewBox.x + screenArea.x * viewBox.width / this.canvasWidth(),
      y: viewBox.y + screenArea.y * viewBox.height / this.canvasHeight(),
      width: screenArea.width * viewBox.width / this.canvasWidth(),
      height: screenArea.height * viewBox.height / this.canvasHeight(),
    };
  }
  getMapPoint(point) {
    const { x, y } = this.getMapArea(point);
    console.log(`point`, point, {x,y}); // DEBUG
    return { x, y };
  }
  getPoint(event) {
    return this.getMapPoint({
      x: event.pageX,
      y: event.pageY,
    });
  }

  render() {
    const { tool, fill, stroke, strokeWidth, altKey, ctrlKey, shiftKey, viewBox } = this.state;

    return (
      <S.Editor className={`${tool}-tool ${altKey ? 'alt-key' : ''} ${ctrlKey ? 'ctrl-key' : ''} ${shiftKey ? 'shift-key' : ''}`}>
        <svg
          viewBox={viewBoxString(viewBox)}
          ref={node => this.node = ReactDOM.findDOMNode(node)}
          onMouseDown={this.onMouseDown}
        >
          {this.state.shapes.map(shape =>
            <Shape key={shape.id} shape={shape} isSelected={this.state.selectedShape === shape} />
          )}
          {this.state.newShape &&
            <Shape shape={this.state.newShape} />
          }
        </svg>
        <S.Toolbar>
          <ToolSelector tool={tool} onChange={tool => this.setState({ tool })} fill={fill} stroke={stroke} />
          <ColorPicker fill={fill} stroke={stroke} strokeWidth={strokeWidth} onChange={this.setState.bind(this)} />
          <a href={this.getBlobUrl()} download="test.svg">
            Download SVG
          </a>
        </S.Toolbar>
      </S.Editor>
    );
  }
}
