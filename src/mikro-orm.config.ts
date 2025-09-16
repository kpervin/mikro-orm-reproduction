import { Migrator } from "@mikro-orm/migrations";
import { defineConfig, MySqlDriver } from "@mikro-orm/mysql";

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
  debug: ["query", "query-params"],
  allowGlobalContext: true, // only for testing
  extensions: [Migrator],
  metadataCache: {
    enabled: false
  }
});
