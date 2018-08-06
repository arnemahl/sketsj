import React from 'react';

export default class Ellipse extends React.PureComponent {

  render() {
    const { startPoint, endPoint, fill, stroke } = this.props.shape;

    const rx = Math.abs(startPoint.x - endPoint.x);
    const ry = Math.abs(startPoint.y - endPoint.y);

    return (
      <ellipse
        fill={fill}
        stroke={stroke}
        cx={startPoint.x}
        cy={startPoint.y}
        rx={rx}
        ry={ry}
      />
    );
  }
}
