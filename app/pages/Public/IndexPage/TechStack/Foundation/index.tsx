import type {FC} from 'react';
import {faFontAwesome} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import ConformLogo from '../Logos/ConformLogo';
import I18NextLogo from '../Logos/I18NextLogo';
import ReactRouter from '../Logos/ReactRouterLogo';
import TailwindLogo from '../Logos/TailwindLogo';
import ZodLogo from '../Logos/ZodLogo';

const Foundation: FC = () => (
  <>
    <a
      aria-label="React Router"
      className="plain-link text-white"
      href="https://reactrouter.com/"
      rel="noreferrer"
      target="_blank"
    >
      <ReactRouter height={32} />
    </a>
    <a
      aria-label="TailwindCSS"
      className="plain-link"
      href="https://tailwindcss.com"
      rel="noreferrer"
      target="_blank"
    >
      <TailwindLogo height={28} />
    </a>
    <a
      aria-label="Zod"
      className="plain-link"
      href="https://zod.dev/"
      rel="noreferrer"
      target="_blank"
    >
      <ZodLogo height={34} />
    </a>
    <a
      aria-label="React-i18next"
      className="plain-link"
      href="https://react.i18next.com/"
      rel="noreferrer"
      target="_blank"
    >
      <I18NextLogo height={32} />
    </a>
    <a
      aria-label="Font Awesome"
      className="plain-link text-3xl text-[#538DD7]"
      href="https://fontawesome.com"
      rel="noreferrer"
      target="_blank"
    >
      <FontAwesomeIcon icon={faFontAwesome} />
    </a>

    <a
      aria-label="Conform"
      className="plain-link"
      href="https://conform.guide/"
      rel="noreferrer"
      target="_blank"
    >
      <ConformLogo height={26} />
    </a>
  </>
);

export default Foundation;
