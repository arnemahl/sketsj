import React from 'react';
import Rect from './Rect/Rect';
import Circle from './Circle/Circle';
import Ellipse from './Ellipse/Ellipse';

export default class Shape extends React.PureComponent {

  render() {
    const { shape } = this.props;

    // eslint-disable-next-line default-case
    switch (shape.type) {
      case 'rect':
        return <Rect shape={shape} />;
      case 'circle':
        return <Circle shape={shape} />;
      case 'ellipse':
        return <Ellipse shape={shape} />;
    }
  }
}