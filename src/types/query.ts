import { stringArg, idArg, queryType } from 'nexus';

const Query = queryType({
  definition(t) {
    t.field('users', {
      type: 'User',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.users()
      },
    })
  },
});

export default Query;