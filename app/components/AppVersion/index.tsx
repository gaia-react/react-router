import type {FC} from 'react';
import {getApplicationVersion} from '~/utils/environment';

type AppVersionProps = {
  className?: string;
};

const AppVersion: FC<AppVersionProps> = ({className}) => (
  <small className={className}>{getApplicationVersion()}</small>
);

export default AppVersion;
