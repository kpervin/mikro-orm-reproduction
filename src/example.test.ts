import {
  Entity,
  MikroORM,
  PrimaryKey,
  Property,
  Enum,
  Collection,
  ManyToOne,
  Opt,
  OneToMany,
  OneToOne, ref,
} from "@mikro-orm/sqlite";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

@Entity()
class User {

  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Property({ unique: true })
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class BasePerson {
  @PrimaryKey()
  id!: number;

  @Enum()
  type!: "customer" | "employee";

  @Property()
  name: string;
}

@Entity({ discriminatorValue: "customer" })
export class Customer extends BasePerson {
  type = "customer";

  @Property()
  amtMoney: number;
}

@Entity({ discriminatorValue: "employee" })
export class Employee extends BasePerson {
  type = "employee";

  @Property()
  hoursWorked: number;

  @OneToMany(() => Break, b => b.employee)
  breaks = new Collection<Break>(this);
}

@Entity()
export class Break {
  @PrimaryKey()
  id!: number;

  @Property()
  time: Date & Opt = new Date();

  @ManyToOne()
  employee: Ref<Employee>;
}

@Entity()
export class Store {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @OneToOne()
  manager: Ref<Employee>;
}


let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    metadataProvider: TsMorphMetadataProvider,
    dbName: ":memory:",
    entities: [BasePerson, Customer, Employee, Break, Store],
    debug: ["query", "query-params"],
    allowGlobalContext: true, // only for testing
  });
  await orm.schema.refreshDatabase();

  orm.em.create(Customer, { name: "Foo", amtMoney: 10 });
  const employee = orm.em.create(Employee, { name: "Bar", hoursWorked: 8 });
  employee.breaks.add(new Break());

  orm.em.create(Store, {
    name: "Some Store",
    manager: ref(employee),
  });

  await orm.em.flush();
  orm.em.clear();
});

afterAll(async () => {
  await orm.close(true);
});

test("returns proper entities", async () => {
  const people = await orm.em.find(BasePerson, {});
  expect(people[0]).toBeInstanceOf(Customer);
  expect(people[1]).toBeInstanceOf(Employee);
});

test("discriminatorValue is not set when using `fields`; returns BasePerson", async () => {
  const people = await orm.em.find(BasePerson, {}, {
    fields: ["name"],
  });
  people.forEach(entity => {
    expect(entity.type).toBeUndefined();
    expect(entity).toBeInstanceOf(BasePerson);
  })
});

test("fetching a store with `fields` set fails", async () => {
  await expect(orm.em.find(Store, {}, {
    fields: ["name", "manager.breaks.time"],
  })).rejects.toThrow();
});
