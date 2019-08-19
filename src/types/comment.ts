import { prismaObjectType } from "nexus-prisma";

const Comment = prismaObjectType({
  name: 'Comment',
  definition(t : any) {
    t.prismaFields([
      'id',
      'author',
      'parentComment',
      'content'
    ])
  },
});

export default Comment;