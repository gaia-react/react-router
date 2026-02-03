import type {FC} from 'react';
import ESLintLogo from '../Logos/ESLintLogo';
import PrettierLogo from '../Logos/PrettierLogo';
import StylelintLogo from '../Logos/StylelintLogo';
import TSLogo from '../Logos/TSLogo';

const CodeQuality: FC = () => (
  <>
    <a
      aria-label="TypeScript"
      className="plain-link"
      href="https://www.typescriptlang.org/"
      rel="noreferrer"
      target="_blank"
    >
      <TSLogo height={26} />
    </a>
    <a
      aria-label="Prettier"
      className="plain-link"
      href="https://prettier.io/"
      rel="noreferrer"
      target="_blank"
    >
      <PrettierLogo height={26} />
    </a>
    <a
      aria-label="ESLint"
      className="plain-link"
      href="https://eslint.org/"
      rel="noreferrer"
      target="_blank"
    >
      <ESLintLogo height={26} />
    </a>
    <a
      aria-label="Stylelint"
      className="plain-link text-white"
      href="https://stylelint.io/"
      rel="noreferrer"
      target="_blank"
    >
      <StylelintLogo height={26} />
    </a>
  </>
);

export default CodeQuality;
