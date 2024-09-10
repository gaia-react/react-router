import {http} from 'msw';
import SparkMD5 from 'spark-md5';
import database from 'test/mocks/database';
import {getLanguage} from 'test/utils';
import {LOGIN_URL} from '~/services/api/urls';
import {tryCatch} from '~/utils/function';

export default http.post(
  `${process.env.API_URL}${LOGIN_URL}`,
  async ({request}) => {
    const [error, login] = await tryCatch(async () => {
      const data = await request.formData();

      return Object.fromEntries(data.entries());
    });

    if (error) {
      return new Response(JSON.stringify({error}), {status: 400});
    }

    const data = database[getLanguage(request)].user.findFirst({
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
