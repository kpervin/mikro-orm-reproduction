import { OneToMany, Opt, PrimaryKey, Ref } from "@mikro-orm/core";
import { Collection, Entity, ManyToOne, Property } from "@mikro-orm/sqlite";

import { Post } from "./post.entity";

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Property({ unique: true })
  email: string;

  @OneToMany(() => Post, "user")
  posts = new Collection<Post>(this);

  @Property()
  createdAt: Date & Opt = new Date();

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}
