import type {z} from 'zod';
import type {userSchema} from './parsers';

export type User = z.infer<typeof userSchema>;
