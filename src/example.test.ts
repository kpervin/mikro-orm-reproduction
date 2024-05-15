import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

import { Loaded, MikroORM } from "@mikro-orm/sqlite";
import { Post } from "./entities/post.entity";
import { User } from "./entities/user.entity";

let orm: MikroORM;

function thing(
  user: Loaded<
    User,
    | "posts"
    | "favoritePost"
    | "favoritePost1"
    | "favoritePost2"
    | "favoritePost3"
  >,
) {
  return null;
}

beforeAll(async () => {
  orm = await MikroORM.init({
    metadataProvider: TsMorphMetadataProvider,
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
  const u = orm.em.create(User, { name: "Foo", email: "foo" });
  orm.em.create(Post, { title: "foo", user: u });
  orm.em.create(Post, { title: "bar", user: u });
  await orm.em.flush();
  orm.em.clear();

  const user = await orm.em.findOneOrFail(
    User,
    { email: "foo" },
    {
      populate: ["favoritePost1", "posts", "favoritePost2", "favoritePost3"],
    },
  );
  const user1 = await orm.em.findOneOrFail(
    User,
    { email: "foo" },
    {
      populate: ["favoritePost1", "favoritePost2", "favoritePost3"],
    },
  );
  thing(user); // This should be giving an error
  thing(user1); // This is erroring fine

  expect(user.name).toBe("Foo");
});
