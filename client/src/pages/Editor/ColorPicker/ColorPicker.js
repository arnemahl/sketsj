import React from 'react';
import * as S from './ColorPicker.style.js';

import { toolStore } from '../toolStore'

export default class ColorPicker extends React.Component {

  componentDidMount() {
    toolStore.addListener(this.onChange)
  }
  componentWillUnmount() {
    toolStore.removeListener(this.onChange)
  }
  onChange = () => {
    this.forceUpdate()
  }

  render() {
    const set = key => event => toolStore.set({ [key]: event.target.value })

    return (
      <S.Container>
        <input
          type="color"
          value={toolStore.fill}
          onChange={set('fill')}
          title="Select fill"
        />
        <input
          type="color"
          value={toolStore.stroke}
          onChange={set('stroke')}
          title="Select stroke"
        />
        <input
          type="number"
          min="0"
          value={toolStore.strokeWidth}
          onChange={set('strokeWidth')}
          title="Select stroke width"
          style={{maxWidth: '80%'}}
        />
      </S.Container>
    );
  }
}
