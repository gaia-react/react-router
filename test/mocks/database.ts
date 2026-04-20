import {factory} from '@mswjs/data';
import user from './user';

const database = factory({
  user: user.schema,
});

export const resetTestData = () => {
  database.user.delete({
    where: {
      id: {
        equals: '1',
      },
    },
  });

  database.user.create(user.data);
};

resetTestData();

export default database;
