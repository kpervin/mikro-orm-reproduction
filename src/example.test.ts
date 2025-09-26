import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

import { MikroORM } from "@mikro-orm/sqlite";
import { Post } from "./entities/post.entity";
import { User } from "./entities/user.entity";

let orm: MikroORM;

describe("Tests", () => {
  beforeAll(async () => {
    orm = await MikroORM.init({
      metadataProvider: TsMorphMetadataProvider,
      dbName: ':memory:',
      entities: [ User, Post ],
      debug: [ "query", "query-params" ],
      allowGlobalContext: true, // only for testing
    });
    await orm.schema.refreshDatabase();
  });

  afterAll(async () => {
    await orm.close(true);
  });

  test("should populate and load `hasBarPost`", async () => {
    const u = orm.em.create(User, { name: "Foo", email: "foo" });
    orm.em.create(Post, { title: "foo", user: u });
    await orm.em.flush();
    orm.em.clear();

    const user = await orm.em.findOneOrFail(
      User,
      { email: "foo" },
      {
        populate: [ "hasBarPost" ]
      }
    );
    expect(user.hasBarPost.isInitialized()).toEqual(true);
  });

  test("should initialize and load `hasBarPost`", async () => {
    const u = orm.em.create(User, { name: "Foo", email: "foo" });
    orm.em.create(Post, { title: "foo", user: u });
    await orm.em.flush();
    orm.em.clear();

    const user = await orm.em.findOneOrFail(
      User,
      { email: "foo" },
    );
    await user.email.load();
    expect(user.email.isInitialized()).toEqual(true);

    await user.hasBarPost.load(); // this does not work
    await orm.em.populate(user, [ "hasBarPost" ]); // neither does this
    expect(user.hasBarPost.isInitialized()).toEqual(true);
  });
})
