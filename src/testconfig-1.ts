import { defineConfig } from "@mikro-orm/mysql";
import { TestEntity1 } from "./entities/test.entity";
import { User } from "./entities/user.entity";
import mikroOrmConfig from "./mikro-orm.config";

export default defineConfig({
  ...mikroOrmConfig,
  entities: [User, TestEntity1]
});