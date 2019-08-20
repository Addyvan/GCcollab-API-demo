import { GraphQLServer } from 'graphql-yoga';
import { prisma } from "./generated/prisma-client";
import schema from "./schema";
import { rule, shield } from 'graphql-shield';
require('dotenv').config();


async function start() {

  const rules = {
    isAuthenticatedUser: rule()((parent, args, context) => {
      if (process.env.USER_TOKEN == context.request.get('token')) {
        return true;
      } else {
        return false;
      }
    })
  }
  
  let auth = shield({
    User: {
      guid: rules.isAuthenticatedUser,
      email: rules.isAuthenticatedUser
    },
    Group: {
      guid: rules.isAuthenticatedUser,
      name: rules.isAuthenticatedUser
    },
    Discussion: {
      guid: rules.isAuthenticatedUser,
      title: rules.isAuthenticatedUser,
      content: rules.isAuthenticatedUser
    },
    Comment: {
      content: rules.isAuthenticatedUser
    }
  });
  
  const server = new GraphQLServer({
    schema,
    middlewares: [auth],
    context: request => {
      return {
        ...request,
        prisma: prisma
      }
    },
  })
  
  server.start(() => console.log(`🚀 Server ready at http://localhost:4000`));
}

start();