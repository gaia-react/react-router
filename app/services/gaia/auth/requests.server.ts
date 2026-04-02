import {api} from '../api';
import {GAIA_URLS} from '../urls';
import {userSchema} from './parsers';
import type {User} from './types';

export const login = async (body: FormData): Promise<User> => {
  const result = await api(GAIA_URLS.login, {
    body,
    method: 'POST',
  });

  return userSchema.parse(result.data);
};
