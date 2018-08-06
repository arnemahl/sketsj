import React from 'react';

export default class Circle extends React.PureComponent {

  render() {
    const { startPoint, endPoint, ...otherProps } = this.props.shape;

    const rx = Math.abs(startPoint.x - endPoint.x);
    const ry = Math.abs(startPoint.y - endPoint.y);

    return (
      <circle
        {...otherProps}
        cx={startPoint.x}
        cy={startPoint.y}
        r={Math.max(rx, ry)}
      />
    );
  }
}
