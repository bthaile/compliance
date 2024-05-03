import React, { CSSProperties, FC } from 'react';

export interface ITennesseeFlagProps {
  style?: CSSProperties;
  className?: string;
}

export const TennesseeFlag: FC<ITennesseeFlagProps> = ({
  className = 'w-6 h-5 mr-1',
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    viewBox="0 0 825.54 496.01"
    style={style}
    className={className}
  >
    <g transform="translate(109.08 -146.84) scale(.91854)">
      <g fillRule="evenodd" strokeWidth="1pt">
        <path fill="#e72121" d="M-118.75 159.86H780V699.86H-118.75z"></path>
        <path fill="#003c7c" d="M717.5 159.86H780V699.86H717.5z"></path>
        <path
          fill="#fff"
          d="M709.83 159.86H722.4870000000001V699.86H709.83z"
        ></path>
      </g>
      <g>
        <g fillRule="evenodd">
          <path
            fill="#fff"
            d="M315.01 382.97c0 58.08-47.083 105.16-105.16 105.16-58.08 0-105.16-47.083-105.16-105.16 0-58.08 47.083-105.16 105.16-105.16 58.08 0 105.16 47.083 105.16 105.16z"
            transform="translate(8.341 -94.586) scale(1.3699)"
          ></path>
          <path
            fill="#003c7c"
            d="M315.01 382.97c0 58.08-47.083 105.16-105.16 105.16-58.08 0-105.16-47.083-105.16-105.16 0-58.08 47.083-105.16 105.16-105.16 58.08 0 105.16 47.083 105.16 105.16z"
            transform="translate(27.505 -59.612) scale(1.2785)"
          ></path>
          <g fill="#fff" strokeWidth="1pt" transform="translate(1.514 1.892)">
            <path
              d="M238.66 515.5L213.94 478.95 171.08 489.43 198.2 454.62 174.99 417.1 216.47 432.14 244.99 398.47 243.5 442.57 284.34 459.29 241.94 471.5z"
              transform="scale(.99999) rotate(-25.367 55.988 356.64)"
            ></path>
            <path
              d="M238.66 515.5L213.94 478.95 171.08 489.43 198.2 454.62 174.99 417.1 216.47 432.14 244.99 398.47 243.5 442.57 284.34 459.29 241.94 471.5z"
              transform="rotate(22.869 394.587 779.026)"
            ></path>
            <path
              d="M238.66 515.5L213.94 478.95 171.08 489.43 198.2 454.62 174.99 417.1 216.47 432.14 244.99 398.47 243.5 442.57 284.34 459.29 241.94 471.5z"
              transform="rotate(-1.413 1753.771 -1490.97)"
            ></path>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export default TennesseeFlag;
