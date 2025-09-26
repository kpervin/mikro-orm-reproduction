import { OneToMany, Opt, PrimaryKey, Ref } from "@mikro-orm/core";
import { Collection, Entity, Property } from "@mikro-orm/sqlite";

import { Post } from "./post.entity";

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ unique: true, lazy: true })
  email!: Ref<string>;

  @OneToMany(() => Post, "user")
  posts = new Collection<Post>(this);

  @Property({
    formula: (a) => `
        ( CASE WHEN EXISTS (
            SELECT 1
            FROM post p
            WHERE p.title = 'bar' AND p.user_id = ${a}.id
            ) THEN "true" ELSE NULL END) `,
    lazy: true,
    persist: false,
  })
  hasBarPost!: Opt<Ref<string | null>>;
}
