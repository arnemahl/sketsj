import React from 'react';
import Rect from './Rect/Rect';
import Circle from './Circle/Circle';
import Ellipse from './Ellipse/Ellipse';

export default class Shape extends React.PureComponent {

  render() {
    const { shape } = this.props;

    const { fill, stroke, strokeWidth } = this.props;
    const stdProps = { fill, stroke, strokeWidth };

    // eslint-disable-next-line default-case
    switch (shape.type) {
      case 'rect':
        return <Rect shape={shape} {...stdProps} />;
      case 'circle':
        return <Circle shape={shape} {...stdProps} />;
      case 'ellipse':
        return <Ellipse shape={shape} {...stdProps} />;
    }
  }
}
