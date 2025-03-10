import type {FC, SVGProps} from 'react';
import {useId} from 'react';

type GaiaLogoProps = Omit<SVGProps<SVGSVGElement>, 'height' | 'width'> &
  ({height?: never; width?: number} | {height?: number; width?: never});

const GaiaLogo: FC<GaiaLogoProps> = ({
  fill = 'gradient',
  height,
  stroke = '#A5A5A5',
  strokeLinecap = 'round',
  strokeWidth = 36,
  width,
  ...props
}) => {
  const id = useId();
  const adjustedWidth = height ? height * (1048 / 386) : (width ?? 1048);
  const adjustedHeight = width ? width * (386 / 1048) : (height ?? 386);
  const isGradient = fill === 'gradient';

  return (
    <svg
      height={adjustedHeight}
      preserveAspectRatio="xMidYMid meet"
      version="1.0"
      viewBox="0 0 1048 386"
      width={adjustedWidth}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {isGradient && (
        <defs>
          <linearGradient
            id={id}
            spreadMethod="pad"
            x1="0%"
            x2="0%"
            y1="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#4C4C4C" stopOpacity="1" />
            <stop offset="100%" stopColor="#797979" stopOpacity="1" />
          </linearGradient>
        </defs>
      )}
      <g
        fill={isGradient ? `url(#${id})` : fill}
        stroke={stroke}
        strokeLinecap={strokeLinecap}
        strokeWidth={strokeWidth}
        transform="translate(0,386) scale(0.1,-0.1)"
      >
        <path
          d="M4646 3488 c-8 -18 -32 -73 -54 -123 -34 -78 -566 -1293 -672 -1535
-450 -1029 -633 -1447 -637 -1457 -4 -10 69 -13 343 -13 l349 0 85 213 85 212
524 0 523 0 89 -210 88 -210 360 -3 360 -2 -33 72 c-19 40 -102 226 -186 413
-84 187 -203 453 -265 590 -62 138 -181 403 -265 590 -578 1287 -672 1495
-676 1495 -2 0 -10 -15 -18 -32z m167 -1788 l155 -375 -306 -3 c-168 -1 -307
0 -309 2 -2 2 64 173 148 380 83 207 153 375 155 373 2 -2 73 -172 157 -377z"
        />
        <path
          d="M8688 3463 c-14 -32 -175 -400 -358 -818 -183 -418 -349 -798 -370
-845 -20 -47 -155 -355 -300 -685 -144 -330 -277 -635 -296 -678 l-33 -77 350
2 350 3 83 210 84 210 524 3 524 2 89 -215 89 -215 357 0 358 0 -33 78 c-18
42 -94 212 -169 377 -115 255 -368 819 -427 950 -25 56 -264 589 -440 980 -82
182 -192 427 -245 545 -53 118 -100 218 -104 223 -4 4 -19 -18 -33 -50z m160
-1718 c72 -176 140 -342 151 -368 12 -27 21 -51 21 -53 0 -2 -140 -4 -311 -4
-171 0 -309 4 -307 8 220 547 304 749 310 744 3 -4 65 -151 136 -327z"
        />
        <path
          d="M1690 3445 c-452 -57 -856 -307 -1112 -689 -358 -535 -352 -1238 14
-1779 87 -129 285 -325 413 -410 413 -273 913 -339 1381 -183 448 151 755 491
852 946 39 180 53 443 35 633 l-6 67 -312 0 c-171 0 -549 -3 -839 -7 l-526 -6
2 -296 3 -295 430 4 c646 7 581 8 577 -15 -6 -39 -63 -150 -104 -203 -88 -113
-261 -220 -428 -264 -116 -30 -309 -30 -425 1 -172 45 -336 150 -451 289 -67
80 -146 237 -175 347 -27 102 -37 351 -19 463 52 326 244 597 513 723 189 88
442 94 669 15 146 -51 317 -175 378 -275 14 -22 29 -39 33 -38 5 1 113 94 242
207 l233 205 -31 39 c-58 74 -179 186 -264 247 -217 154 -438 239 -713 274
-135 18 -227 18 -370 0z"
        />
        <path
          d="M6369 3366 c-2 -3 1 -107 8 -233 22 -395 3 -2581 -23 -2735 l-7 -38
362 0 c198 0 361 2 361 4 0 2 -8 72 -17 157 -15 134 -17 253 -15 924 3 808 15
1458 33 1735 6 91 11 170 12 175 2 10 -704 21 -714 11z"
        />
      </g>
    </svg>
  );
};

export default GaiaLogo;
