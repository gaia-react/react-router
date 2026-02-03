import type {ComponentProps, FC} from 'react';
import zodLogo from './zod-logo.webp';

type ZodLogoProps = ComponentProps<'img'> &
  ({height?: never; width?: number} | {height?: number; width?: never});

const ZodLogo: FC<ZodLogoProps> = ({height, width, ...props}) => {
  const adjustedWidth = height ? height * (640 / 545) : (width ?? 640);
  const adjustedHeight = width ? width * (545 / 640) : (height ?? 545);

  return (
    <img
      alt="Zod"
      height={adjustedHeight}
      src={zodLogo}
      width={adjustedWidth}
      {...props}
    />
  );
};

export default ZodLogo;
