import React from 'react';

export default class Ellipse extends React.PureComponent {

  render() {
    const { shape, ...otherProps } = this.props;

    return (
      <ellipse
        {...otherProps}
        cx={shape.cx}
        cy={shape.cy}
        rx={shape.rx}
        ry={shape.ry}
      />
    );
  }
}
