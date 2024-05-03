import React, { CSSProperties, FC } from 'react';

export interface IAlabamaFlagProps {
  style?: CSSProperties;
  className?: string;
}

export const AlabamaFlag: FC<IAlabamaFlagProps> = ({
  className = 'w-6 h-5 mr-1',
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 600 400"
    width="600"
    height="400"
    style={style}
    className={className}
  >
    <rect width="600" height="400" fill="#fff" />
    <path d="M0,0 600,400M0,400 600,0" stroke="#b10021" strokeWidth="68" />
  </svg>
);

export default AlabamaFlag;
