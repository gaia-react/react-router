import {delay, http} from 'msw';
import {nanoid} from 'nanoid';
import {GAIA_URLS} from '~/services/gaia/urls';
import {tryCatch} from '~/utils/function';
import {date, DELAY} from '../../utils';
import database from '../database';
import type {ServerThing} from './data';

export default http.post(
  `${process.env.API_URL}${GAIA_URLS.things}`,
  async ({request}) => {
    const [error, thing] = await tryCatch(async () => {
      const data = await request.formData();

      return Object.fromEntries(data.entries()) as ServerThing;
    });

    if (error) {
      return Response.json({error}, {status: 400});
    }

    const duplicateName = database.things.findFirst({
      where: {
        name: {
          equals: thing.name,
        },
      },
    });

    if (duplicateName) {
      return new Response(null, {status: 409, statusText: 'duplicateName'});
    }

    const data = database.things.create({
      ...thing,
      created_at: date({minutes: 15}).toISOString(),
      id: nanoid(),
      updated_at: null,
    });

    await delay(DELAY);

    return Response.json({data}, {status: 201});
  }
);
