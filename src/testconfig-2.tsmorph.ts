import { defineConfig } from "@mikro-orm/mysql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { TestEntity2 } from "./entities/tsmorph/test2.entity";
import { User } from "./entities/tsmorph/user.entity";
import mikroOrmConfig from "./mikro-orm.config";

export default defineConfig({
  ...mikroOrmConfig,
  metadataProvider: TsMorphMetadataProvider,
  entities: [ User, TestEntity2 ]
});