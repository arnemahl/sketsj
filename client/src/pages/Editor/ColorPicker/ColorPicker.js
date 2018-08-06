import React from 'react';
import * as S from './ColorPicker.style.js';

export default class ColorPicker extends React.Component {

  render() {
    const set = (prop) => (event) =>
      this.props.onChange({ [prop]: event.target.value })
    ;

    console.log(`this.props`, this.props); // DEBUG

    return (
      <S.Container>
        <input
          type="color"
          id="fill"
          name="color"
          value={this.props.fill}
          onChange={set('fill')}
          title="Select fill"
        />
        <input
          type="color"
          id="fill"
          name="color"
          value={this.props.stroke}
          onChange={set('stroke')}
          title="Select stroke"
        />
      </S.Container>
    );
  }
}
