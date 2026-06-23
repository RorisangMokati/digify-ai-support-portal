import "dotenv/config";
import { defineConfig } from "@prisma/config";

declare const process: {
  env: {
    DATABASE_URL?: string;
    SHADOW_DATABASE_URL?: string;
  };
};

export default {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
      shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
    },
  },
};