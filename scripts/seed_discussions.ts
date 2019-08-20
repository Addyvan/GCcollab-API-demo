import MySQLConnector from "./mysql";
import { Prisma } from "../src/generated/prisma-client/index";
require('dotenv').config();
import seedDiscussions from "./discussions";

async function seedDiscussionsPrisma() {
  const prisma = new Prisma({
    endpoint: "http://" + process.env.PRISMA_ENDPOINT + ":" + process.env.PRISMA_PORT_NUMBER+"/demo",
    secret: process.env.PRISMA_MANAGEMENT_API_SECRET});
  let mysql = new MySQLConnector();
  console.log("Seeding discussions");
  await seedDiscussions(prisma, mysql);
  mysql.close();
}

seedDiscussionsPrisma();