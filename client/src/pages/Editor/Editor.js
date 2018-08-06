import ReactDOM from 'react-dom';
import React from 'react';
import * as S from './Editor.style.js';

import Rect from './Rect/Rect';

function getPoint(event) {
  return {
    x: event.pageX,
    y: event.pageY,
  };
}

export default class Editor extends React.Component {

  state = {
    shapes: [],
    tool: 'rect',
    newShape: void 0,
  }

  onMouseDown = (event) => {
    this.setState({
      newShape: {
        startPoint: getPoint(event),
        endPoint: getPoint(event),
      },
    });

    this.node.addEventListener('mousemove', this.onMouseMove);
    this.node.addEventListener('mouseup', this.onMouseUp);
  }
  onMouseMove = (event) => {
    this.setState(state => console.log('onMouseMove', state) || ({
      newShape: {
        ...state.newShape,
        endPoint: getPoint(event),
      },
    }));
  }
  onMouseUp = (event) => {
    this.node.removeEventListener('mousemove', this.onMouseMove);
    this.node.removeEventListener('mouseup', this.onMouseUp);

    // TODO: Add the shape we just drew
  }

  render() {
    return (
      <S.Editor>
        <S.Svg
          ref={node => this.node = ReactDOM.findDOMNode(node)}
          onMouseDown={this.onMouseDown}
        >
          {this.state.newShape &&
            <Rect
              rect={this.state.newShape}
            />
          }
        </S.Svg>
      </S.Editor>
    );
  }
}
