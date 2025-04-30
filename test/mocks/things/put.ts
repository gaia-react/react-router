import {delay, http} from 'msw';
import type {ServerThing} from 'test/mocks/things/data';
import {GAIA_URLS} from '~/services/gaia/urls';
import {tryCatch} from '~/utils/function';
import {date, DELAY} from '../../utils';
import database from '../database';

export default http.put(
  `${process.env.API_URL}${GAIA_URLS.thingsId}`,
  async ({params, request}) => {
    const [error, thing] = await tryCatch(async () => {
      const data = await request.formData();

      return Object.fromEntries(data.entries()) as ServerThing;
    });

    if (error) {
      return new Response(JSON.stringify({error}), {status: 400});
    }

    const duplicateName = database.things.findFirst({
      where: {
        id: {
          notEquals: thing.id,
        },
        name: {
          equals: thing.name,
        },
      },
    });

    if (duplicateName) {
      return new Response(null, {status: 409, statusText: 'duplicateThing'});
    }

    const data = database.things.update({
      data: {
        ...thing,
        updated_at: date({minutes: 30}).toISOString(),
      },
      strict: true,
      where: {
        id: {
          equals: String(params.id),
        },
      },
    });

    await delay(DELAY);

    return new Response(JSON.stringify({data}), {status: 200});
  }
);
