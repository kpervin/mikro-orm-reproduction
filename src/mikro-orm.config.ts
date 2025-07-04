import { defineConfig } from "@mikro-orm/mysql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { User } from "./entities/user.entity";
import { Post } from "./entities/post.entity";

export default defineConfig({
  metadataProvider: TsMorphMetadataProvider,
  dbName: "test",
  user: "root",
  password: "root",
  host: "localhost",
  port: 3306,
  entities: [User, Post],
  debug: ["query", "query-params"],
  allowGlobalContext: true, // only for testing
});
