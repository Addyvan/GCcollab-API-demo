import { prismaObjectType } from "nexus-prisma";

const User = prismaObjectType({
  name: 'User',
  definition(t : any) {
    t.prismaFields([
      'id',
      'guid',
      'email',
      {
        name: 'groupsJoined',
        args: ['*'],
      },
      {
        name: 'authorOf',
        args: ['*'],
      }
    ])
  },
});

export default User;