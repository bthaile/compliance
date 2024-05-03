import React, { CSSProperties, FC } from 'react';

export interface ITexasFlagProps {
  style?: CSSProperties;
  className?: string;
}

export const TexasFlag: FC<ITexasFlagProps> = ({
  className = 'w-6 h-5 mr-1',
  style,
}) => (
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 1080 720"
    width="1080"
    height="720"
    style={style}
    className={className}
  >
    <rect width="1080" height="720" fill="#fff" />
    <rect y="360" width="1080" height="360" fill="#bf0a30" />
    <rect width="360" height="720" fill="#002868" />
    <g transform="translate(180,360)" fill="#fff">
      <g id="c">
        <path id="t" d="M 0,-135 v 135 h 67.5" transform="rotate(18 0,-135)" />
        <use xlinkHref="#t" transform="scale(-1,1)" />
      </g>
      <use xlinkHref="#c" transform="rotate(72)" />
      <use xlinkHref="#c" transform="rotate(144)" />
      <use xlinkHref="#c" transform="rotate(216)" />
      <use xlinkHref="#c" transform="rotate(288)" />
    </g>
  </svg>
);

export default TexasFlag;
