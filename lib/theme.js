import { generateTheme } from '@bit/opencollective.design-system.theme';

// Generate and export main theme
const theme = generateTheme({
  fontSizes: {
    H1: 18,
    H2: 16,
    H3: 14,
    H4: 12,
    H5: 10,
    H6: 8,
    LeadParagraph: 13,
    Paragraph: 12,
    Caption: 11,
    Tiny: 10,
  },
  lineHeights: {
    H1: '20px',
    H2: '18px',
    H3: '16px',
    H4: '14px',
    H5: '12px',
    H6: '10px',
    LeadParagraph: '18px',
    Paragraph: '16px',
    Caption: '14px',
    Tiny: '12px',
  },
});

export default theme;
