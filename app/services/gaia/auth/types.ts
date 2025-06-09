import type {z} from 'zod/v4';
import type {userSchema} from './parsers';

export type User = z.infer<typeof userSchema>;
