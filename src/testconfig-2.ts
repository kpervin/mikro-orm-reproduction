import { defineConfig } from "@mikro-orm/mysql";
import { TestEntity2 } from "./entities/test2.entity";
import { User } from "./entities/user.entity";
import mikroOrmConfig from "./mikro-orm.config";

export default defineConfig({
  ...mikroOrmConfig,
  entities: [ User, TestEntity2 ]
});