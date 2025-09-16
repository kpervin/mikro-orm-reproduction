import type { Opt, Ref } from "@mikro-orm/mysql";
import { Entity, Enum, ManyToOne } from "@mikro-orm/mysql";
import { AutoIncrementEntity } from "./default.entity";
import { Status, SYSTEM_USER_ID } from "../enums";
import { User } from "./user.entity";

@Entity()
export class TestEntity1 extends AutoIncrementEntity {
  @Enum(() => Status)
  status: Opt<Status> = Status.NEW;

  @ManyToOne({
    deleteRule: "set null",
    default: SYSTEM_USER_ID,
  })
  createdBy?: Ref<User>;
}
