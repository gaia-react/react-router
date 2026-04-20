import {http} from 'msw';
import {GAIA_URLS} from '~/services/gaia/urls';
import database from '../database';
import {url} from '../url';

const one = http.get(url(GAIA_URLS.thingsId), ({params}) => {
  if (!params.id) {
    return Response.json(
      {
        error: 'Thing ID is required',
      },
      {status: 400}
    );
  }

  const id = params.id as string;

  const data = database.things.findFirst({
    where: {
      id: {
        equals: String(id),
      },
    },
  });

  if (!data) {
    return Response.json(
      {
        error: `Thing with id "${id}" not found`,
      },
      {status: 404}
    );
  }

  return Response.json({data});
});

const all = http.get(url(GAIA_URLS.things), () =>
  Response.json({
    data: database.things.getAll(),
  })
);

export default [one, all];
