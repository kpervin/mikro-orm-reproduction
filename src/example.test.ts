import config from "./mikro-orm.config";

import { MikroORM } from "@mikro-orm/mysql";
import { Post } from "./entities/post.entity";
import { User } from "./entities/user.entity";

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init(config);
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
  expect(user.hasBarPost.$).toBeDefined();
  expect(typeof user.hasBarPost.$).toEqual("boolean");
  expect(user.hasBarPost.$).toEqual(true);
});
