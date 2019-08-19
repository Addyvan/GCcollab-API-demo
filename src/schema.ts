import { makePrismaSchema } from 'nexus-prisma';
import * as path from 'path';

import { mergeSchemas } from "graphql-tools";

import datamodelInfo from './generated/nexus-prisma';
import { prisma } from './generated/prisma-client';

import {
  User,
  Group,
  Discussion,
  Comment
} from "./types/Schema";

const schema = makePrismaSchema({
  // Provide all the GraphQL types we've implemented
  types: [
    User,
    Group,
    Discussion,
    Comment
  ],

  // Configure the interface to Prisma
  prisma: {
    datamodelInfo: datamodelInfo,
    client: prisma,
  },

  // Specify where Nexus should put the generated files
  outputs: {
    schema: path.join(__dirname, './generated/schema.graphql'),
    typegen: path.join(__dirname, './generated/nexus.ts'),
  },

  // Configure nullability of input arguments: All arguments are non-nullable by default
  nonNullDefaults: {
    input: true,
    output: true,
  },

  // Configure automatic type resolution for the TS representations of the associated types
  typegenAutoConfig: {
    sources: [
      {
        source: path.join(__dirname, './typegenAutoConfig/types.ts'),
        alias: 'types',
      },
    ],
    contextType: 'types.Context',
  },
});


export default schema;