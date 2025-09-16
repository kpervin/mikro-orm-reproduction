import { defineConfig } from "@mikro-orm/mysql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { TestEntity1 } from "./entities/tsmorph/test.entity";
import { User } from "./entities/tsmorph/user.entity";
import mikroOrmConfig from "./mikro-orm.config";

export default defineConfig({
  ...mikroOrmConfig,
  metadataProvider: TsMorphMetadataProvider,
  entities: [User, TestEntity1]
});