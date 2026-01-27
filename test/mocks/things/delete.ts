import {delay, http} from 'msw';
import {GAIA_URLS} from '~/services/gaia/urls';
import {DELAY} from '../../utils';
import database from '../database';

export default http.delete(
  `${process.env.API_URL}${GAIA_URLS.thingsId}`,
  async ({params}) => {
    if (!params.id) {
      return Response.json(
        {
          error: 'Thing ID is required',
        },
        {status: 400}
      );
    }

    const id = params.id as string;

    const deletedThing = database.things.delete({
      where: {
        id: {
          equals: String(id),
        },
      },
    });

    if (!deletedThing) {
      return Response.json(
        {
          error: `Thing with id "${id}" not found`,
        },
        {status: 404}
      );
    }

    await delay(DELAY);

    return new Response(null, {status: 204});
  }
);
