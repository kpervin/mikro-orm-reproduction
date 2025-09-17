import { defineConfig } from "@mikro-orm/mysql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { TestEntity1 } from "./entities/test.entity";
import { User } from "./entities/user.entity";
import mikroOrmConfig from "./mikro-orm.config";

export default defineConfig({
  ...mikroOrmConfig,
  metadataProvider: TsMorphMetadataProvider,
  entities: [User, TestEntity1]
});