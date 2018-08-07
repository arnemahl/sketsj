import React from 'react';

export default class Circle extends React.PureComponent {

  render() {
    const { shape, ...otherProps } = this.props;

    return (
      <circle
        {...otherProps}
        cx={shape.cx}
        cy={shape.cy}
        r={shape.r}
      />
    );
  }
}
