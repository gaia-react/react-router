import {http} from 'msw';
import {GAIA_URLS} from '~/services/gaia/urls';
import database from '../database';

const one = http.get(
  `${process.env.API_URL}${GAIA_URLS.thingsId}`,
  ({params}) => {
    if (!params.id) {
      return new Response(
        JSON.stringify({
          error: 'Thing ID is required',
        }),
        {status: 400}
      );
    }

    const data = database.things.findFirst({
      where: {
        id: {
          equals: String(params.id),
        },
      },
    });

    if (!data) {
      return new Response(
        JSON.stringify({
          error: `Thing with id "${params.id}" not found`,
        }),
        {status: 404}
      );
    }

    return new Response(JSON.stringify({data}));
  }
);

const all = http.get(
  `${process.env.API_URL}${GAIA_URLS.things}`,
  () =>
    new Response(
      JSON.stringify({
        data: database.things.getAll(),
      })
    )
);

export default [one, all];
