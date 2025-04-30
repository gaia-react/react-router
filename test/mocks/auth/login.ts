import {http} from 'msw';
import SparkMD5 from 'spark-md5';
import {GAIA_URLS} from '~/services/gaia/urls';
import {tryCatch} from '~/utils/function';
import database from '../database';

export default http.post(
  `${process.env.API_URL}${GAIA_URLS.login}`,
  async ({request}) => {
    const [error, login] = await tryCatch(async () => {
      const data = await request.formData();

      return Object.fromEntries(data.entries());
    });

    if (error) {
      return new Response(JSON.stringify({error}), {status: 400});
    }

    const data = database.user.findFirst({
      where: {
        email: {
          equals: login.email as string,
        },
      },
    });

    if (!data || login.password !== SparkMD5.hash('passw0rd')) {
      return new Response(null, {status: 401});
    }

    return new Response(JSON.stringify({data}), {
      status: 201,
    });
  }
);
