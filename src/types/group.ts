import { prismaObjectType } from "nexus-prisma";

const Group = prismaObjectType({
  name: 'Group',
  definition(t : any) {
    t.prismaFields([
      'id',
      'guid',
      {
        name: 'members',
        args: ['*'],
      },
      {
        name: 'discussions',
        args: ['*'],
      },
      'name',
      'isPublic'
    ])
  },
});

export default Group;