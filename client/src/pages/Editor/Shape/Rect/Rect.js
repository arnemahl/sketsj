import React from 'react';

export default class Rect extends React.PureComponent {

  render() {
    const { shape, ...otherProps } = this.props;

    return (
      <rect
        {...otherProps}
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
      />
    );
  }
}
