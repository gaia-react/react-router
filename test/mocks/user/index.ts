import {primaryKey} from '@mswjs/data';
import {z} from 'zod';

export const serverUserSchema = z.object({
  email: z.email(),
  family_name: z.string(),
  given_name: z.string(),
  id: z.string(),
  token: z.string(),
});

export type ServerUser = z.infer<typeof serverUserSchema>;

const schema = {
  email: String,
  family_name: String,
  given_name: String,
  id: primaryKey(String),
  token: String,
};

const data: ServerUser = {
  email: 'user@domain.com',
  family_name: 'Smith',
  given_name: 'John',
  id: '1',
  token: 'token',
};

export default {data, schema};
