import { Opt, PrimaryKey } from "@mikro-orm/core";
import { Entity, ManyToOne, Property } from "@mikro-orm/sqlite";
import { User } from "./user.entity";

@Entity()
export class Post {
  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @ManyToOne()
  user!: User;

  @Property()
  createdAt: Date & Opt = new Date();
}
