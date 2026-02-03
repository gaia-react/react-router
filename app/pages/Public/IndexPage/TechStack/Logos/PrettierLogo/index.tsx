import type {FC, SVGProps} from 'react';

type PrettierLogoProps = Omit<SVGProps<SVGSVGElement>, 'height' | 'width'> &
  ({height?: never; width?: number} | {height?: number; width?: never});

const PrettierLogo: FC<PrettierLogoProps> = ({height, width, ...props}) => {
  const adjustedWidth = height ?? width ?? 210;
  const adjustedHeight = width ?? height ?? 210;

  return (
    <svg
      height={adjustedHeight}
      viewBox="0 0 210 210"
      width={adjustedWidth}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        <g>
          <g>
            <g>
              <path
                className="fill-[#56b3b4]"
                d="M155 40h10c2.8 0 5 2.2 5 5s-2.2 5-5 5h-10c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#ea5e5e]"
                d="M5 200h50c2.8 0 5 2.2 5 5s-2.2 5-5 5H5c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#bf85bf]"
                d="M125 120h30c2.8 0 5 2.2 5 5s-2.2 5-5 5h-30c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#ea5e5e]"
                d="M65 120h40c2.8 0 5 2.2 5 5s-2.2 5-5 5H65c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#56b3b4]"
                d="M5 120h40c2.8 0 5 2.2 5 5s-2.2 5-5 5H5c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#bf85bf]"
                d="M5 160h50c2.8 0 5 2.2 5 5s-2.2 5-5 5H5c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#bf85bf]"
                d="M5 80h50c2.8 0 5 2.2 5 5s-2.2 5-5 5H5c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#f7ba3e]"
                d="M55 20h100c2.8 0 5 2.2 5 5s-2.2 5-5 5H55c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#ea5e5e]"
                d="M5 20h30c2.8 0 5 2.2 5 5s-2.2 5-5 5H5c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#f7ba3e]"
                d="M45 180h10c2.8 0 5 2.2 5 5s-2.2 5-5 5H45c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#56b3b4]"
                d="M45 60h10c2.8 0 5 2.2 5 5s-2.2 5-5 5H45c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#56b3b4]"
                d="M5 180h20c2.8 0 5 2.2 5 5s-2.2 5-5 5H5c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#f7ba3e]"
                d="M5 60h20c2.8 0 5 2.2 5 5s-2.2 5-5 5H5c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#4d616e] opacity-50"
                d="M135 180h10c2.8 0 5 2.2 5 5s-2.2 5-5 5h-10c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
                enableBackground="new"
              />
              <path
                className="fill-[#4d616e] opacity-50"
                d="M75 180h40c2.8 0 5 2.2 5 5s-2.2 5-5 5H75c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
                enableBackground="new"
              />
              <path
                className="fill-[#4d616e] opacity-50"
                d="M165 180h40c2.8 0 5 2.2 5 5s-2.2 5-5 5h-40c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
                enableBackground="new"
              />
              <path
                className="fill-[#56b3b4]"
                d="M85 100h80c2.8 0 5 2.2 5 5s-2.2 5-5 5H85c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#f7ba3e]"
                d="M35 100h30c2.8 0 5 2.2 5 5s-2.2 5-5 5H35c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#ea5e5e]"
                d="M5 100h10c2.8 0 5 2.2 5 5s-2.2 5-5 5H5c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#bf85bf]"
                d="M95 40h40c2.8 0 5 2.2 5 5s-2.2 5-5 5H95c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#56b3b4]"
                d="M5 40h70c2.8 0 5 2.2 5 5s-2.2 5-5 5H5c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#f7ba3e]"
                d="M35 140h90c2.8 0 5 2.2 5 5s-2.2 5-5 5H35c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#bf85bf]"
                d="M5 140h10c2.8 0 5 2.2 5 5s-2.2 5-5 5H5c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#ea5e5e]"
                d="M125 60h50c2.8 0 5 2.2 5 5s-2.2 5-5 5h-50c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#f7ba3e]"
                d="M125 80h50c2.8 0 5 2.2 5 5s-2.2 5-5 5h-50c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#56b3b4]"
                d="M5 0h120c2.8 0 5 2.2 5 5s-2.2 5-5 5H5c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
              />
              <path
                className="fill-[#4d616e] opacity-50"
                d="M145 0h60c2.8 0 5 2.2 5 5s-2.2 5-5 5h-60c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
                enableBackground="new"
              />
              <path
                className="fill-[#4d616e] opacity-50"
                d="M145 140h20c2.8 0 5 2.2 5 5s-2.2 5-5 5h-20c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
                enableBackground="new"
              />
              <path
                className="fill-[#4d616e] opacity-50"
                d="M185 140h20c2.8 0 5 2.2 5 5s-2.2 5-5 5h-20c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
                enableBackground="new"
              />
              <path
                className="fill-[#4d616e] opacity-50"
                d="M175 120h30c2.8 0 5 2.2 5 5s-2.2 5-5 5h-30c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
                enableBackground="new"
              />
              <path
                className="fill-[#4d616e] opacity-50"
                d="M175 20h30c2.8 0 5 2.2 5 5s-2.2 5-5 5h-30c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
                enableBackground="new"
              />
              <path
                className="fill-[#4d616e] opacity-50"
                d="M185 100h20c2.8 0 5 2.2 5 5s-2.2 5-5 5h-20c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
                enableBackground="new"
              />
              <path
                className="fill-[#4d616e] opacity-50"
                d="M185 40h20c2.8 0 5 2.2 5 5s-2.2 5-5 5h-20c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
                enableBackground="new"
              />
              <path
                className="fill-[#4d616e] opacity-50"
                d="M195 60h10c2.8 0 5 2.2 5 5s-2.2 5-5 5h-10c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
                enableBackground="new"
              />
              <path
                className="fill-[#4d616e] opacity-50"
                d="M195 80h10c2.8 0 5 2.2 5 5s-2.2 5-5 5h-10c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
                enableBackground="new"
              />
              <path
                className="fill-[#4d616e] opacity-50"
                d="M115 160h90c2.8 0 5 2.2 5 5s-2.2 5-5 5h-90c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
                enableBackground="new"
              />
              <path
                className="fill-[#4d616e] opacity-50"
                d="M75 160h20c2.8 0 5 2.2 5 5s-2.2 5-5 5H75c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
                enableBackground="new"
              />
              <path
                className="fill-[#4d616e] opacity-50"
                d="M155 200h50c2.8 0 5 2.2 5 5s-2.2 5-5 5h-50c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
                enableBackground="new"
              />
              <path
                className="fill-[#4d616e] opacity-50"
                d="M75 200h60c2.8 0 5 2.2 5 5s-2.2 5-5 5H75c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
                enableBackground="new"
              />
              <path
                className="fill-[#4d616e] opacity-50"
                d="M75 60h30c2.8 0 5 2.2 5 5s-2.2 5-5 5H75c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
                enableBackground="new"
              />
              <path
                className="fill-[#4d616e] opacity-50"
                d="M75 80h30c2.8 0 5 2.2 5 5s-2.2 5-5 5H75c-2.8 0-5-2.2-5-5s2.2-5 5-5z"
                enableBackground="new"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default PrettierLogo;
