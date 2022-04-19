import styled from 'styled-components';
import { space, fontSize, fontWeight, textAlign, background, borderRadius, layout } from 'styled-system';

export const Td = styled.td`
  ${space}
  ${fontSize}
  ${fontWeight}
  ${textAlign}
  ${borderRadius}
  ${layout}
`;

Td.defaultProps = {
  fontSize: '12px',
  px: '16px',
  py: '10px',
};

export const Tr = styled.tr`
  ${background}
  ${borderRadius}
`;
