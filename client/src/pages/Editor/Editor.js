import ReactDOM from 'react-dom';
import React from 'react';
import * as S from './Editor.style.js';

import Shape from './Shape/Shape';
import ToolSelector from './ToolSelector/ToolSelector';
import ColorPicker from './ColorPicker/ColorPicker';

import { toolStore } from './toolStore';
import { viewBoxStore, getEventPoint, zoom } from './viewBoxStore'
import { shapeStore, removeLastShape, undoRemoveShape, selectShapeAtPoint, startNewShape, setEndPoint, finishShape } from './shapeStore'

function viewBoxString({ x, y, width, height }) {
  return `${x} ${y} ${width} ${height}`;
}

export default class Editor extends React.Component {

  state = {
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    toolStore.addListener(this.onChange);
    viewBoxStore.addListener(this.onChange);
    shapeStore.addListener(this.onChange);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    toolStore.removeListener(this.onChange);
    viewBoxStore.removeListener(this.onChange);
    shapeStore.removeListener(this.onChange);
  }
  onChange = () => {
    this.forceUpdate();
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
          removeLastShape()
          break;
        case 'y':
        case 'Y':
          undoRemoveShape()
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
    if (toolStore.tool === 'selector') {
      selectShapeAtPoint(getEventPoint(event));
      return;
    }
    if (toolStore.tool === 'zoom') {
      zoom(event);
      return;
    }
    startNewShape(getEventPoint(event));

    this.node.addEventListener('mousemove', this.onMouseMove);
    this.node.addEventListener('mouseup', this.onMouseUp);
  }
  onMouseMove = (event) => {
    setEndPoint(getEventPoint(event));
  }
  onMouseUp = (event) => {
    this.node.removeEventListener('mousemove', this.onMouseMove);
    this.node.removeEventListener('mouseup', this.onMouseUp);

    finishShape();
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
    const { altKey, ctrlKey, shiftKey } = this.state;
    const { tool } = toolStore;
    const { viewBox } = viewBoxStore
    const { shapes, selectedShape, newShape } = shapeStore

    return (
      <S.Editor className={`${tool}-tool ${altKey ? 'alt-key' : ''} ${ctrlKey ? 'ctrl-key' : ''} ${shiftKey ? 'shift-key' : ''}`}>
        <svg
          viewBox={viewBoxString(viewBox)}
          ref={node => this.node = ReactDOM.findDOMNode(node)}
          onMouseDown={this.onMouseDown}
        >
          {shapes.map(shape =>
            <Shape key={shape.id} shape={shape} isSelected={selectedShape === shape} />
          )}
          {newShape &&
            <Shape shape={newShape} />
          }
        </svg>
        <S.Toolbar>
          <ToolSelector />
          <ColorPicker />
          <a href={this.getBlobUrl()} download="test.svg">
            Download SVG
          </a>
        </S.Toolbar>
      </S.Editor>
    );
  }
}
