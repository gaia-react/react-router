import {z} from 'zod/v4';

export const thingSchema = z.object({
  createdAt: z.iso.datetime(),
  description: z.string(),
  id: z.string(),
  name: z.string(),
  updatedAt: z.iso.datetime().nullish(),
});

export const thingsSchema = z.array(thingSchema);
