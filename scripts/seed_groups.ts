import MySQLConnector from "./mysql";
import { Prisma } from "../src/generated/prisma-client/index";
require('dotenv').config();
import seedGroups from "./groups";

async function seedUsersPrisma() {
  const prisma = new Prisma({
    endpoint: "http://" + process.env.PRISMA_ENDPOINT + ":" + process.env.PRISMA_PORT_NUMBER+"/demo",
    secret: process.env.PRISMA_MANAGEMENT_API_SECRET});
  let mysql = new MySQLConnector();
  console.log("Seeding groups");
  await seedGroups(prisma, mysql);
  mysql.close();
}

seedUsersPrisma();