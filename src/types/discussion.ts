import { prismaObjectType } from "nexus-prisma";

const Discussion = prismaObjectType({
  name: 'Discussion',
  definition(t : any) {
    t.prismaFields([
      'id',
      'author',
      'group',
      {
        name: 'comments',
        args: ['*'],
      },
      'title',
      'content'
    ])
  },
});

export default Discussion;