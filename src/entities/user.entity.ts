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
    formula: (a) => /*language=mysql*/ `
        ( EXISTS (
            SELECT 1
            FROM post p
            WHERE p.title = 'bar' AND p.user_id = ${a}.id
            ))`,
    lazy: true,
    persist: false,
  })
  hasBarPost!: Ref<boolean> & Opt;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}
