import { defineConfig, ReflectMetadataProvider } from "@mikro-orm/mysql";
import { TestEntity1 } from "./entities/reflect-metadata/test.entity";
import { User } from "./entities/reflect-metadata/user.entity";
import mikroOrmConfig from "./mikro-orm.config";

export default defineConfig({
  ...mikroOrmConfig,
  metadataProvider: ReflectMetadataProvider,
  entities: [User, TestEntity1]
});