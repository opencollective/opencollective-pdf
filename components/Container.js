import styled from 'styled-components';
import { background, border, color, flexbox, layout, position, shadow, space, typography } from 'styled-system';

import { clear, cursor, float, overflow, pointerEvents, whiteSpace } from '../lib/styled-system-custom-properties';

const Container = styled.div`
  box-sizing: border-box;

  ${flexbox}
  ${background}
  ${border}
  ${shadow}
  ${clear}
  ${color}
  ${cursor}
  ${float}
  ${overflow}
  ${pointerEvents}
  ${position}
  ${layout}
  ${space}
  ${typography}
  ${whiteSpace}
  ${(props) =>
    props.clearfix &&
    `
      ::after {
        content: "";
        display: table;
        clear: both;
      }
    `}
`;

export default Container;
