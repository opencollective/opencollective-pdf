import React from 'react';
import { Svg, Path } from '@react-pdf/renderer';

// Adapted from https://raw.githubusercontent.com/lucide-icons/lucide/refs/heads/main/icons/external-link.svg
export const LinkIcon = ({ size = 24, color = 'black', ...props }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1" {...props}>
      <Path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeWidth={2} stroke={color}></Path>
      <Path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeWidth={2} stroke={color}></Path>
    </Svg>
  );
};
