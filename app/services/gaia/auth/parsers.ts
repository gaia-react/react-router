import {z} from 'zod/v4';

export const userSchema = z.object({
  email: z.email(),
  familyName: z.string(),
  givenName: z.string(),
  id: z.string(),
  token: z.string(),
});
