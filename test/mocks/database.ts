import {factory} from '@mswjs/data';
import things from './things/data';
import user from './user';

const database = factory({
  things: things.schema,
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

  database.things.deleteMany({
    where: {
      id: {
        notIn: ['0'],
      },
    },
  });

  database.user.create(user.data);
  things.data.forEach(database.things.create);
};

resetTestData();

export default database;
