import MySQLConnector from "./mysql";
import { Prisma } from "../src/generated/prisma-client/index";
require('dotenv').config();
import seedUsers from "./seed_users";
import seedGroups from "./seed_groups";
import seedDiscussions from "./seed_discussions";
import seedComments from "./seed_comments";

async function seedAPI() {
  const prisma = new Prisma({
    endpoint: "http://" + process.env.PRISMA_ENDPOINT + ":" + process.env.PRISMA_PORT_NUMBER+"/demo",
    secret: process.env.PRISMA_MANAGEMENT_API_SECRET});
  const mysql = new MySQLConnector();
  await seedUsers(prisma, mysql);
  await seedGroups(prisma, mysql);
  await seedDiscussions(prisma, mysql);
  await seedComments(prisma, mysql);
}

seedAPI();

//export default seedAPI;