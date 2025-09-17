import type { Opt } from "@mikro-orm/mysql";
import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/mysql";
import { TestConst, TestEnum } from "./enums";

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Property({ unique: true })
  email: string;

  @Enum(() => TestEnum)
  enum: Opt<TestEnum> = TestEnum.HELLO;

  @Enum(() => TestConst)
  const: Opt<TestConst> = TestConst.FOO;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}
