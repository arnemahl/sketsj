import React from 'react';
import * as S from './ToolSelector.style.js';

import { toolStore } from '../toolStore'

const Svg = ({ children, onClick, selected, fill, stroke }) => (
  <S.SvgIcon
    width="30"
    height="30"
    viewBox="-1 -1 14 14"
    fill={fill}
    stroke={stroke}
    onClick={onClick}
    {...(selected
      ? {fill, stroke}
      : {fill: 'silver', stroke: 'gray'}
    )}
  >
    {children}
  </S.SvgIcon>
);

export default class ToolSelector extends React.Component {

  render() {
    const { fill, stroke, tool } = toolStore
    const set = tool => () => toolStore.set({ tool });

    return (
      <S.Container>
        <div onClick={set('selector')} title="Select selector-tool">
          <Svg selected={tool === 'selector'} fill={fill} stroke={stroke}>
            <path d="M1,1 L1,7 L3,4 L7,9 L9,7 L4,3 L7,1 Z" />
          </Svg>
        </div>
        <div onClick={set('zoom')} title="Select zoom-tool">
          <Svg selected={tool === 'zoom'} fill={fill} stroke={stroke}>
            <polyline points="5,6 11,12 12,11, 6,5" />
            <circle cx="4.5" cy="4.5" r="4.5" />
          </Svg>
        </div>
        <div onClick={set('rect')} title="Select rectangle-tool">
          <Svg selected={tool === 'rect'} fill={fill} stroke={stroke}>
            <rect x={0} y={0} width={12} height={12} />
          </Svg>
        </div>
        <div onClick={set('circle')} title="Select circle-tool">
          <Svg selected={tool === 'circle'} fill={fill} stroke={stroke}>
            <circle cx={6} cy={6} r={6} />
          </Svg>
        </div>
        <div onClick={set('ellipse')}  title="Select ellipse-tool">
          <Svg selected={tool === 'ellipse'} fill={fill} stroke={stroke}>
            <ellipse cx={6} cy={6} rx={6} ry={4} />
          </Svg>
        </div>
      </S.Container>
    );
  }
}
