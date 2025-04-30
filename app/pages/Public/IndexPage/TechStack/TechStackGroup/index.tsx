import type {FC, ReactNode} from 'react';

type TechStackGroupProps = {
  children: ReactNode;
  name?: string;
};

const TechStackGroup: FC<TechStackGroupProps> = ({children, name}) => (
  <div className="relative flex items-center gap-4 overflow-hidden rounded-sm border border-gray-600/40 bg-gray-900/30 px-3 pt-7 pb-2.5">
    <div className="absolute top-0 left-0 w-full bg-gray-600/40 py-0.5 text-center text-xs text-gray-100/90">
      {name}
    </div>
    {children}
  </div>
);

export default TechStackGroup;
