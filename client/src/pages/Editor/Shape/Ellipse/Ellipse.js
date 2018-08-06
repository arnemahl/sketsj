import React from 'react';

export default class Ellipse extends React.PureComponent {

  render() {
    const { startPoint, endPoint, ...otherProps } = this.props.shape;

    const rx = Math.abs(startPoint.x - endPoint.x);
    const ry = Math.abs(startPoint.y - endPoint.y);

    return (
      <ellipse
        {...otherProps}
        cx={startPoint.x}
        cy={startPoint.y}
        rx={rx}
        ry={ry}
      />
    );
  }
}
