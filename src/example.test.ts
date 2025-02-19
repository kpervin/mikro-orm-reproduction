import {
  Collection,
  Entity,
  ManyToOne,
  MikroORM,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Ref,
} from "@mikro-orm/sqlite";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

@Entity()
class Post {
  @PrimaryKey()
  id!: number;

  @Property()
  body: string;

  @ManyToOne(() => User)
  user!: Ref<User>;
}

@Entity()
class User {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Property({ unique: true })
  email: string;

  @OneToMany(() => Post, (post) => post.user)
  posts = new Collection<Post>(this);

  @OneToOne()
  test: Ref<Test>;
}

@Entity()
class Test {
  @PrimaryKey()
  id!: number;

  @OneToOne(() => User, (user) => user.test)
  user: Ref<User>;
}

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    metadataProvider: TsMorphMetadataProvider,
    dbName: ":memory:",
    entities: [User, Post, Test],
    debug: ["query", "query-params"],
    allowGlobalContext: true, // only for testing
  });
  await orm.schema.refreshDatabase();
});

afterAll(async () => {
  await orm.close(true);
});

test("fields with nested relations", async () => {
  const test = orm.em.create(Test, {
    user: {
      name: "Foo",
      email: "foo@bar.com",
    },
  });

  orm.em.create(Post, {
    body: "Lorem ipsum",
    user: test.user,
  });

  await orm.em.flush();

  orm.em.clear();

  await expect(
    orm.em.findOneOrFail(Test, test, {
      fields: ["user.name", "user.posts.body"],
    }),
  ).rejects.toThrow();
});
