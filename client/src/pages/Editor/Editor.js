import ReactDOM from 'react-dom';
import React from 'react';
import * as S from './Editor.style.js';

import Shape from './Shape/Shape';
import ToolSelector from './ToolSelector/ToolSelector';
import ColorPicker from './ColorPicker/ColorPicker';

import generateId from 'util/generateId';

function getPoint(event) {
  return {
    x: event.pageX,
    y: event.pageY,
  };
}

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

const halfOpaque = '80';

export default class Editor extends React.Component {

  state = {
    shapes: [],
    removedShapes: [],
    tool: 'ellipse',
    fill: '#ffdab9',
    stroke: '#ff7f50',
    strokeWidth: 1,
    newShape: void 0,
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }
  onKeyDown = (event) => {
    window.event = event;

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

  onMouseDown = (event) => {
    this.setState({
      newShape: {
        id: generateId(),
        fill: this.state.fill + halfOpaque,
        stroke: this.state.stroke,
        strokeWidth: this.state.strokeWidth,
        ...getShape(this.state.tool, getPoint(event), getPoint(event)),
        startPoint: getPoint(event), // <- Only used in onMouseMouve
      },
    });

    this.node.addEventListener('mousemove', this.onMouseMove);
    this.node.addEventListener('mouseup', this.onMouseUp);
  }
  onMouseMove = (event) => {
    this.setState(state => ({
      newShape: {
        ...state.newShape,
        ...getShape(state.newShape.type, state.newShape.startPoint, getPoint(event)),
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

  render() {
    const { tool, fill, stroke, strokeWidth } = this.state;

    return (
      <S.Editor>
        <svg
          ref={node => this.node = ReactDOM.findDOMNode(node)}
          onMouseDown={this.onMouseDown}
        >
          {this.state.shapes.map(shape =>
            <Shape key={shape.id} shape={shape} />
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
