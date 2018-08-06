import React from 'react';
import * as S from './ToolSelector.style.js';

const Svg = ({ children, onClick }) => (
  <S.SvgIcon
    width="30"
    height="30"
    viewBox="-1 -1 14 14"
    fill="peachpuff"
    stroke="coral"
    onClick={onClick}
  >
    {children}
  </S.SvgIcon>
);

export default class ToolSelector extends React.Component {

  render() {
    const set = tool => () => this.props.onChange(tool);

    return (
      <S.Container>
        <Svg onClick={set('rect')}>
          <rect x={0} y={0} width={12} height={12} />
        </Svg>
        <Svg onClick={set('circle')}>
          <circle cx={6} cy={6} r={6} />
        </Svg>
        <Svg onClick={set('ellipse')}>
          <ellipse cx={6} cy={6} rx={6} ry={4} />
        </Svg>
      </S.Container>
    );
  }
}
