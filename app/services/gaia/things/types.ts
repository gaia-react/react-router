import type {z} from 'zod';
import type {thingSchema, thingsSchema} from './parsers';

export type Thing = z.infer<typeof thingSchema>;

export type Things = z.infer<typeof thingsSchema>;
