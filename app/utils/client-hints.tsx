import {getHintUtils} from '@epic-web/client-hints';
import {clientHint as colourSchemeHint} from '@epic-web/client-hints/color-scheme';
import {useRequestInfo} from '~/hooks/useRequestInfo';

/**
 * This file contains utilities for using client hints for user preference which
 * are needed by the server, but are only known by the browser.
 */

export const hintsUtils = getHintUtils({theme: colourSchemeHint});

export const {getHints} = hintsUtils;

/**
 * @returns an object with the client hints and their values
 */
export const useHints = () => {
  const requestInfo = useRequestInfo();

  return requestInfo.hints;
};
