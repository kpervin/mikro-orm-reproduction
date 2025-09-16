import {
  BaseEntity,
  PrimaryKey,
  PrimaryKeyProp,
  Property,
} from "@mikro-orm/mysql";
import { v4 } from "uuid";
import type { Opt } from "@mikro-orm/mysql";

export abstract class DefaultEntity extends BaseEntity {
  @Property({
    defaultRaw: "NOW()",
  })
  readonly createdAt: Opt<Date> = new Date();

  @Property({
    defaultRaw: "NOW() ON UPDATE NOW()",
    onUpdate: () => new Date(),
  })
  readonly updatedAt: Opt<Date> = new Date();
}

export abstract class AutoIncrementEntity extends DefaultEntity {
  @PrimaryKey()
  id!: number;
}

export abstract class UuidEntity extends DefaultEntity {
  [PrimaryKeyProp]?: "id";

  @PrimaryKey()
  id: string = v4();
}
