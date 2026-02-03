import type {FC} from 'react';
import ChromaticLogo from '../Logos/ChromaticLogo';
import MSWLogo from '../Logos/MSWLogo';
import PlaywrightLogo from '../Logos/PlaywrightLogo';
import RTLLogo from '../Logos/RTLLogo';
import StorybookLogo from '../Logos/StorybookLogo';
import VitestLogo from '../Logos/VitestLogo';

const TestSuite: FC = () => (
  <>
    <a
      aria-label="Storybook"
      className="plain-link"
      href="https://storybook.com"
      rel="noreferrer"
      target="_blank"
    >
      <StorybookLogo height={32} />
    </a>
    <a
      aria-label="Chromatic"
      className="plain-link"
      href="https://chromatic.com"
      rel="noreferrer"
      target="_blank"
    >
      <ChromaticLogo height={32} />
    </a>
    <a
      aria-label="Vitest"
      className="plain-link"
      href="https://vitest.dev/"
      rel="noreferrer"
      target="_blank"
    >
      <VitestLogo height={32} />
    </a>
    <a
      aria-label="React Testing Library"
      className="plain-link"
      href="https://testing-library.com/docs/react-testing-library/intro/"
      rel="noreferrer"
      target="_blank"
    >
      <RTLLogo height={32} />
    </a>
    <a
      aria-label="MSW"
      className="plain-link"
      href="https://mswjs.io/"
      rel="noreferrer"
      target="_blank"
    >
      <MSWLogo height={32} />
    </a>
    <a
      aria-label="Playwright"
      className="plain-link"
      href="https://playwright.dev/"
      rel="noreferrer"
      target="_blank"
    >
      <PlaywrightLogo height={32} />
    </a>
  </>
);

export default TestSuite;
