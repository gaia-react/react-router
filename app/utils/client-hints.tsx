import type {FC} from 'react';
import {useEffect} from 'react';
import {useRevalidator} from 'react-router';
import {getHintUtils} from '@epic-web/client-hints';
import {
  clientHint as colorSchemeHint,
  subscribeToSchemeChange,
} from '@epic-web/client-hints/color-scheme';
import {clientHint as timeZoneHint} from '@epic-web/client-hints/time-zone';
import {useOptionalRequestInfo} from '~/utils/request-info';

const hintsUtils = getHintUtils({
  theme: colorSchemeHint,
  timeZone: timeZoneHint,
});

export const {getHints} = hintsUtils;

export const useOptionalHints = (): ReturnType<typeof getHints> | undefined =>
  useOptionalRequestInfo()?.hints;

type ClientHintCheckProps = {nonce?: string};

export const ClientHintCheck: FC<ClientHintCheckProps> = ({nonce}) => {
  const {revalidate} = useRevalidator();

  useEffect(
    () =>
      subscribeToSchemeChange(() => {
        void revalidate();
      }),
    [revalidate]
  );

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: hintsUtils.getClientHintCheckScript(),
      }}
      nonce={nonce}
    />
  );
};
