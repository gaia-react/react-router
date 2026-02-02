import {useEffect} from 'react';
import {useRevalidator} from 'react-router';
import {subscribeToSchemeChange} from '@epic-web/client-hints/color-scheme';
import {hintsUtils} from '~/utils/client-hints';

/**
 * @returns inline script element that checks for client hints and sets cookies
 * if they are not set then reloads the page if any cookie was set to an
 * inaccurate value.
 */
const ClientHintCheck = () => {
  const {revalidate} = useRevalidator();

  useEffect(
    () => subscribeToSchemeChange(async () => revalidate()),
    [revalidate]
  );

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: hintsUtils.getClientHintCheckScript(),
      }}
    />
  );
};

export default ClientHintCheck;
