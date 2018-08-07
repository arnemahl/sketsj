import React from 'react';
import Rect from './Rect/Rect';
import Circle from './Circle/Circle';
import Ellipse from './Ellipse/Ellipse';

export default class Shape extends React.PureComponent {

  getStdProps() {
    const { fill, stroke, strokeWidth } = this.props.shape;

    if (this.props.isSelected) {
      return { fill: '#00a9ff33', stroke: '#00a9ff', strokeWidth  };
    } else {
      return { fill, stroke, strokeWidth };
    }
  }

  render() {
    const { shape } = this.props;

    // eslint-disable-next-line default-case
    switch (shape.type) {
      case 'rect':
        return <Rect shape={shape} {...this.getStdProps()} />;
      case 'circle':
        return <Circle shape={shape} {...this.getStdProps()} />;
      case 'ellipse':
        return <Ellipse shape={shape} {...this.getStdProps()} />;
      default:
        console.error(`Shape: Cannot render shapes of type "${shape.type}"`);
        return false;
    }
  }
}
