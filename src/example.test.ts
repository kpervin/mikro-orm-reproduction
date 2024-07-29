import { Entity, MikroORM, PrimaryKey, Property } from "@mikro-orm/sqlite";
import { Post } from "./entities/post.entity";
import { User } from "./entities/user.entity";

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    dbName: ":memory:",
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
  orm.em.create(User, { name: "Foo", email: "foo" });
  await orm.em.flush();
  orm.em.clear();

  const user = await orm.em.findOneOrFail(User, { email: "foo" });
  expect(user.name).toBe("Foo");
  user.name = "Bar";
  orm.em.remove(user);
  await orm.em.flush();

  const count = await orm.em.count(User, { email: "foo" });
  expect(count).toBe(0);
});
