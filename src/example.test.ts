import {
  Collection,
  Entity,
  ManyToOne,
  MikroORM,
  OneToMany,
  PrimaryKey,
  PrimaryKeyProp,
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

  @OneToMany(() => Car, (o) => o.user)
  cars = new Collection<Car>(this);

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

@Entity()
export class Car {
  @PrimaryKey()
  name: string;

  @PrimaryKey()
  year: number;

  @ManyToOne(() => User)
  user: Ref<User>;

  // this is needed for proper type checks in `FilterQuery`
  [PrimaryKeyProp]?: ["name", "year"];

  constructor(name: string, year: number) {
    this.name = name;
    this.year = year;
  }
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

test("should get list of car primary keys", async () => {
  const _user = orm.em.create(User, { name: "Foo", email: "foo" });
  _user.cars.add([new Car("Audi A8", 2010), new Car("Audi A8", 2011)]);
  await orm.em.flush();
  orm.em.clear();

  const user = await orm.em.findOneOrFail(
    User,
    { email: "foo" },
    { populate: ["cars"] },
  );

  /**
   * Should return the same tuples as needed to query [in this example]{@link https://mikro-orm.io/docs/composite-keys#primitive-types-only}:
   * @example const audi2 = await em.findOneOrFail(Car, ['Audi A8', 2010]);
   */
  expect(user.cars.getIdentifiers()).toBe([
    ["Audi A8", 2010],
    ["Audi A8", 2011],
  ]);
});
