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

const halfOpaque = '80';

export default class Editor extends React.Component {

  state = {
    shapes: [],
    tool: 'ellipse',
    fill: '#ffdab9',
    stroke: '#ff7f50',
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
          }));
          break;
      }
    }
  }

  onMouseDown = (event) => {
    this.setState({
      newShape: {
        id: generateId(),
        type: this.state.tool,
        fill: this.state.fill + halfOpaque,
        stroke: this.state.stroke,
        startPoint: getPoint(event),
        endPoint: getPoint(event),
      },
    });

    this.node.addEventListener('mousemove', this.onMouseMove);
    this.node.addEventListener('mouseup', this.onMouseUp);
  }
  onMouseMove = (event) => {
    this.setState(state => ({
      newShape: {
        ...state.newShape,
        endPoint: getPoint(event),
      },
    }));
  }
  onMouseUp = (event) => {
    this.node.removeEventListener('mousemove', this.onMouseMove);
    this.node.removeEventListener('mouseup', this.onMouseUp);

    this.setState(state => ({
      shapes: state.shapes.concat([state.newShape]),
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
    const { tool, fill, stroke } = this.state;

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
          <ColorPicker fill={fill} stroke={stroke} onChange={this.setState.bind(this)} />
          <a href={this.getBlobUrl()} download="test.svg">
            Download SVG
          </a>
        </S.Toolbar>
      </S.Editor>
    );
  }
}
