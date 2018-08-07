import styled from 'styled-components';

export const Editor = styled.div`
  display: flex;

  > svg {
    width: 90vw;
    height: 100vh;
    box-sizing: border-box;
  }

  &.selector-tool {
    cursor: pointer;
  }
  &.zoom-tool {
    cursor: zoom-in;
    .alt-key& {
      cursor: zoom-out;
    }
  }
`;

export const Toolbar = styled.div`
  background-color: #ddd;
`;
