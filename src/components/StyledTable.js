import styled from 'styled-components';
import { space, fontSize, fontWeight, textAlign, background, borderRadius } from 'styled-system';

export const Td = styled.td`
  ${space}
  ${fontSize}
  ${fontWeight}
  ${textAlign}
  ${borderRadius}
`;

Td.defaultProps = {
  fontSize: 'Paragraph',
  px: '16px',
  py: '10px',
};

export const Tr = styled.tr`
  ${background}
  ${borderRadius}
`;
