import type {FC} from 'react';
import {useTranslation} from 'react-i18next';
import gaiaLogo from '~/assets/images/gaia-logo.svg';
import LinkButton from '~/components/LinkButton';

const IndexPage: FC = () => {
  const {t} = useTranslation('pages', {keyPrefix: 'index'});

  return (
    <main className="bg-body relative flex min-h-dvh flex-col overflow-hidden">
      {/* Structural grid texture */}
      <div
        aria-hidden={true}
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Top accent bar */}
      <div className="h-0.5 w-full bg-blue-500" />

      {/* Header wordmark */}
      <header className="px-8 pt-8 sm:px-16 sm:pt-12">
        <img
          alt="GAIA"
          className="h-5 opacity-30 sm:h-6 dark:opacity-20"
          src={gaiaLogo}
        />
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col justify-center px-8 py-16 sm:px-16 sm:py-24">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <p className="mb-4 font-mono text-xs tracking-widest text-blue-500 uppercase sm:text-sm">
            {t('eyebrow')}
          </p>

          {/* Title */}
          <h1 className="text-body mb-6 text-4xl/tight font-light tracking-tight sm:text-6xl sm:leading-none">
            {t('heroTitle')}
          </h1>

          {/* Divider */}
          <div className="mb-8 h-px w-16 bg-blue-500" />

          {/* Tagline */}
          <p className="text-secondary mb-12 max-w-lg text-base/relaxed sm:text-lg">
            {t('heroTagline')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <LinkButton
              size="lg"
              to="https://reactrouter.com"
              variant="primary"
            >
              {t('ctaPrimary')}
            </LinkButton>
            <LinkButton
              size="lg"
              to="https://github.com/remix-run/react-router"
              variant="secondary"
            >
              {t('ctaSecondary')}
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Foundation strip */}
      <footer className="border-light border-t px-8 py-6 sm:px-16">
        <dl className="flex flex-col gap-4 sm:flex-row sm:gap-12">
          {(
            [
              ['stack', 'stackValue'],
              ['runtime', 'runtimeValue'],
              ['design', 'designValue'],
            ] as const
          ).map(([labelKey, valueKey]) => (
            <div key={labelKey} className="flex flex-col gap-0.5">
              <dt className="text-secondary font-mono text-xs tracking-widest uppercase">
                {t(labelKey)}
              </dt>
              <dd className="text-body text-sm font-medium">{t(valueKey)}</dd>
            </div>
          ))}
        </dl>
      </footer>
    </main>
  );
};

export default IndexPage;
