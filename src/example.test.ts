import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

import { MikroORM } from "@mikro-orm/sqlite";
import { Post } from "./entities/post.entity";
import { User } from "./entities/user.entity";

let orm: MikroORM;

describe("Tests", () => {
  beforeAll(async () => {
    orm = await MikroORM.init({
      metadataProvider: TsMorphMetadataProvider,
      dbName: ":memory:",
      entities: [ User, Post ],
      debug: [ "query", "query-params" ],
      allowGlobalContext: true, // only for testing
    });
    await orm.schema.refreshDatabase();
  });

  afterAll(async () => {
    await orm.close(true);
  });

  describe("should populate and load `hasBarPost` when bar post is added", () => {
    const email = "foo";

    beforeAll(async () => {
      const u = orm.em.create(User, { name: "Foo", email });
      orm.em.create(Post, { title: "foo", user: u });
      orm.em.create(Post, { title: "bar", user: u });
      await orm.em.flush();
    });

    beforeEach(() => {
      orm.em.clear();
    });

    test("populated in find", async () => {
      const user = await orm.em.findOneOrFail(
        User,
        { email },
        {
          populate: [ "hasBarPost" ],
        },
      );
      expect(user.hasBarPost.isInitialized()).toEqual(true);
      expect(user.hasBarPost.$).toEqual("true");
    });

    test("using Reference.load()", async () => {
      const user = await orm.em.findOneOrFail(
        User,
        { email },
      );
      await user.hasBarPost.load();
      expect(user.hasBarPost.isInitialized()).toEqual(true);
      expect(await user.hasBarPost.load()).toEqual("true");
    });

    test("using em.populate()", async () => {
      const user = await orm.em.findOneOrFail(
        User,
        { email },
      );
      await orm.em.populate(user, ["hasBarPost"]);
      expect(user.hasBarPost.isInitialized()).toEqual(true);
      expect(await user.hasBarPost.load()).toEqual("true");
    })
  });

  describe("should populate and load `hasBarPost` when no bar post is added", () => {
    const email = "bar";
    beforeAll(async () => {
      const u = orm.em.create(User, { name: "Foo", email });
      orm.em.create(Post, { title: "foo", user: u });
      await orm.em.flush();
    });

    beforeEach(() => {
      orm.em.clear();
    });

    test("scalarRef returns null", async () => {
      const user = await orm.em.findOneOrFail(
        User,
        { email },
        {
          populate: [ "scalarRef" ],
        },
      );
      expect(user.scalarRef?.isInitialized()).toEqual(true);
      expect(user.scalarRef?.$).toEqual(null);
    })

    test("populated in find", async () => {
      const user = await orm.em.findOneOrFail(
        User,
        { email },
        {
          populate: [ "hasBarPost" ],
        },
      );
      expect(user.hasBarPost.isInitialized()).toEqual(true);
      expect(user.hasBarPost.$).toEqual(null);
    });

    test("using Reference.load()", async () => {
      const user = await orm.em.findOneOrFail(
        User,
        { email },
      );
      await user.hasBarPost.load();
      expect(user.hasBarPost.isInitialized()).toEqual(true);
      expect(await user.hasBarPost.load()).toEqual(null);
    });

    test("using em.populate()", async () => {
      const user = await orm.em.findOneOrFail(
        User,
        { email },
      );
      await orm.em.populate(user, [ "hasBarPost" ]);
      expect(user.hasBarPost.isInitialized()).toEqual(true);
      expect(await user.hasBarPost.load()).toEqual(null);
    })
  });
});
