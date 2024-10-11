import {http} from 'msw';
import database from 'test/mocks/database';
import {GAIA_ENDPOINTS} from '~/services/gaia/endpoints';

const one = http.get(
  `${process.env.API_URL}${GAIA_ENDPOINTS.thingsId}`,
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
  `${process.env.API_URL}${GAIA_ENDPOINTS.things}`,
  () =>
    new Response(
      JSON.stringify({
        data: database.things.getAll(),
      })
    )
);

export default [one, all];
