import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

import { MikroORM } from "@mikro-orm/mysql";
import { Post } from "./entities/post.entity";
import { User } from "./entities/user.entity";

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    metadataProvider: TsMorphMetadataProvider,
    dbName: "test",
    user: "root",
    password: "root",
    host: "localhost",
    port: 3306,
    entities: [User, Post],
    debug: ["query", "query-params"],
    allowGlobalContext: true, // only for testing
  });
  await orm.schema.refreshDatabase();
});

afterAll(async () => {
  await orm.close(true);
});

test("basic CRUD example", async () => {
  const u = orm.em.create(User, { name: "Foo", email: "foo" });
  orm.em.create(Post, { title: "foo", user: u });
  orm.em.create(Post, { title: "bar", user: u });
  await orm.em.flush();
  orm.em.clear();

  const user = await orm.em.findOneOrFail(
    User,
    { email: "foo" },
    {
      populate: ["hasBarPost"],
    },
  );
  expect(user.name).toBe("Foo");
  expect(user.hasBarPost.$).toBeDefined(); // This throws, as it is instead returning as a boolean only
  expect(user.hasBarPost.$).toEqual(true); // This throws, as it is instead returning as a boolean only
});
