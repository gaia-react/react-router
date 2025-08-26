import type {FC} from 'react';
import {faFontAwesome} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import I18NextLogo from '~/components/Logos/I18NextLogo';
import RemixR from '~/components/Logos/RemixR';
import RVFLogo from '~/components/Logos/RVFLogo';
import TailwindLogo from '~/components/Logos/TailwindLogo';
import ZodLogo from '~/components/Logos/ZodLogo';

const Foundation: FC = () => (
  <>
    <a
      href="https://remix.run"
      aria-label="Remix Run"
      className="plain-link text-white"
      rel="noreferrer"
      target="_blank"
    >
      <RemixR height={32} />
    </a>
    <a
      href="https://tailwindcss.com"
      aria-label="TailwindCSS"
      className="plain-link"
      rel="noreferrer"
      target="_blank"
    >
      <TailwindLogo height={28} />
    </a>
    <a
      href="https://zod.dev/"
      aria-label="Zod"
      className="plain-link"
      rel="noreferrer"
      target="_blank"
    >
      <ZodLogo height={38} />
    </a>
    <a
      href="https://www.rvf-js.io/"
      aria-label="RVF"
      className="plain-link"
      rel="noreferrer"
      target="_blank"
    >
      <RVFLogo height={26} />
    </a>
    <a
      href="https://react.i18next.com/"
      aria-label="React-i18next"
      className="plain-link"
      rel="noreferrer"
      target="_blank"
    >
      <I18NextLogo height={32} />
    </a>
    <a
      href="https://fontawesome.com"
      aria-label="Font Awesome"
      className="plain-link text-3xl text-[#538DD7]"
      rel="noreferrer"
      target="_blank"
    >
      <FontAwesomeIcon icon={faFontAwesome} />
    </a>
  </>
);

export default Foundation;
