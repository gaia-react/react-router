import auth from './auth';
import things from './things';

const handlers = [...auth, ...things];

export default handlers;
