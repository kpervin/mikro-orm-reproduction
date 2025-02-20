import { defineConfig, MySqlDriver } from "@mikro-orm/mysql";
import { User } from "./entities/user.entity";

export default defineConfig({
  driver: MySqlDriver,
  dbName: "mikro-orm-reproduction",
  user: "root",
  password: "root",
  host: "localhost",
  port: 3306,
  pool: {
    min: 0,
  },
  entities: [User],
  debug: ["query", "query-params"],
  allowGlobalContext: true, // only for testing
});