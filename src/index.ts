import { GraphQLServer } from 'graphql-yoga';
import { prisma } from './generated/prisma-client';
//import { Prisma } from "./generated/prisma-client/index";
import schema from "./schema";
import { rule, shield } from 'graphql-shield';
require('dotenv').config();
//import seedAPI from "../scripts/seed_api";


async function start() {

  /*
  if ((await new Prisma().users()).length < 1) {
    console.log("No data in the API, seeding first");
    await seedAPI();
  }
  */

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
      email: rules.isAuthenticatedUser
    },
    Group: {
      name: rules.isAuthenticatedUser
    },
    Discussion: {
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
        prisma: prisma,
        //prisma: new Prisma({endpoint: "http://" + process.env.PRISMA_ENDPOINT + ":" + process.env.PRISMA_PORT_NUMBER+"/demo",secret: process.env.PRISMA_MANAGEMENT_API_SECRET})
      }
    },
  })
  
  server.start(() => console.log(`🚀 Server ready at http://localhost:4000`));
}

start();