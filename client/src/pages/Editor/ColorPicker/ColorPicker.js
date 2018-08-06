import React from 'react';
import * as S from './ColorPicker.style.js';

export default class ColorPicker extends React.Component {

  render() {
    const set = (prop) => (event) =>
      this.props.onChange({ [prop]: event.target.value })
    ;

    return (
      <S.Container>
        <input
          type="color"
          value={this.props.fill}
          onChange={set('fill')}
          title="Select fill"
        />
        <input
          type="color"
          value={this.props.stroke}
          onChange={set('stroke')}
          title="Select stroke"
        />
        <input
          type="number"
          min="0"
          value={this.props.strokeWidth}
          onChange={set('strokeWidth')}
          title="Select stroke width"
          style={{maxWidth: '80%'}}
        />
      </S.Container>
    );
  }
}
