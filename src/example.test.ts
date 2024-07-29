import { defineConfig, MikroORM } from "@mikro-orm/mysql";
import { Post } from "./entities/post.entity";
import { User } from "./entities/user.entity";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init(defineConfig({
    // dbName: ":memory:",
    entities: [ User, Post ],
    metadataProvider: TsMorphMetadataProvider,
    debug: [ "query", "query-params" ],
    allowGlobalContext: true, // only for testing
    metadataCache: {
      pretty: true,
    },
  }));
  await orm.schema.ensureDatabase();
  await orm.schema.refreshDatabase();
});

afterAll(async () => {
  await orm.close(true);
});

test("basic CRUD example", async () => {
  orm.em.create(User, { name: "Foo", email: "foo" });
  await orm.em.flush();
  orm.em.clear();

  const user = await orm.em.fork().findOneOrFail(User, { email: "foo" });
  expect(user.createdAt).toBeInstanceOf(Date);
  orm.em.remove(user);
  await orm.em.flush();
});
