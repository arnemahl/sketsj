import React from 'react';

export default class Rect extends React.PureComponent {

  render() {
    const { startPoint, endPoint, ...otherProps } = this.props.shape;

    const x = Math.min(startPoint.x, endPoint.x);
    const y = Math.min(startPoint.y, endPoint.y);
    const width = Math.max(startPoint.x, endPoint.x) - x;
    const height = Math.max(startPoint.y, endPoint.y) - y;

    return (
      <rect
        {...otherProps}
        x={x}
        y={y}
        width={width}
        height={height}
      />
    );
  }
}
