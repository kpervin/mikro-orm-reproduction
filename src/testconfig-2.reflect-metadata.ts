import { defineConfig, ReflectMetadataProvider } from "@mikro-orm/mysql";
import { TestEntity2 } from "./entities/reflect-metadata/test2.entity";
import { User } from "./entities/reflect-metadata/user.entity";
import mikroOrmConfig from "./mikro-orm.config";

export default defineConfig({
  ...mikroOrmConfig,
  metadataProvider: ReflectMetadataProvider,
  entities: [ User, TestEntity2 ]
});