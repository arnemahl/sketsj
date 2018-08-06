import React from 'react';

export default class Rect extends React.PureComponent {

  render() {
    const { startPoint, endPoint } = this.props.rect;

    const x = Math.min(startPoint.x, endPoint.x);
    const y = Math.min(startPoint.y, endPoint.y);
    const width = Math.max(startPoint.x, endPoint.x) - x;
    const height = Math.max(startPoint.y, endPoint.y) - y;

    return (
      <rect
        fill="peachpuff"
        stroke="coral"
        x={x}
        y={y}
        width={width}
        height={height}
      />
    );
  }
}