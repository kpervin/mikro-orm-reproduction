import {
  OneToMany,
  Opt,
  PrimaryKey,
  Ref,
  ScalarReference,
} from "@mikro-orm/core";
import {
  Collection,
  Entity,
  ManyToOne,
  MikroORM,
  Property,
} from "@mikro-orm/sqlite";

@Entity()
class User {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Property({ unique: true })
  email: string;

  @OneToMany(() => Post, "user")
  posts = new Collection<Post>(this);

  @Property({
    formula: (a) => /*language=sql*/ `
        ( EXISTS (
            SELECT 1
            FROM post p
            WHERE p.title = 'bar'
            ))`,
    type: "boolean",
    lazy: true,
    persist: false,
  })
  hasBarPost!: Opt & Ref<boolean>;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

@Entity()
class Post {
  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @ManyToOne()
  user!: User;
}

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    dbName: ":memory:",
    entities: [User],
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
  expect(user.hasBarPost).toBe(true);
  expect(user.hasBarPost.$).toBeDefined(); // This throws, as it is instead returning as a boolean only
});
