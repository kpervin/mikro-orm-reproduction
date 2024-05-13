import { OneToMany, Opt, PrimaryKey, Ref } from "@mikro-orm/core";
import { Collection, Entity, Property } from "@mikro-orm/sqlite";

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

  @Property({
    formula: (a) => /*language=sql*/ `
        ( EXISTS (
            SELECT 1
            FROM post p
            WHERE p.title = 'bar'
            ))`,
    // ref: true,
    lazy: true,
    persist: false,
  })
  hasBarPost!: Opt & Ref<boolean>;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}
