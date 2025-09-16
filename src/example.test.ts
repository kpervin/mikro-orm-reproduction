import { MikroORM } from "@mikro-orm/mysql";
import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { TestEntity1 } from "./entities/test.entity";
import { TestEntity2 } from "./entities/test2.entity";
import { User } from "./entities/user.entity";
import mikroOrmConfig from "./mikro-orm.config";


describe("test", () => {
  afterEach(async () => {
    execSync(`rm -rf ./src/migrations`);
    execSync(`rm -rf ./temp`);
  });

  describe("code-first", () => {
    let orm: MikroORM;
    beforeEach(async () => {
      orm = await MikroORM.init({
        ...mikroOrmConfig,
        entities: [ User ],
        connect: false,
      });
    });

    afterEach(async () => {
      await orm.close(true);
    });

    test("without default ref", async () => {
      orm.discoverEntity(TestEntity1);
      const migrator = orm.getMigrator();
      const res = await migrator.createMigration();
      console.log(res.diff.up);

      expect(res.diff.up).toEqual(
        expect.arrayContaining([
          expect.stringContaining("`status` enum('New') not null default 'New'"),
        ]),
      );
    });

    test("with default ref", async () => {
      orm.discoverEntity(TestEntity2);
      const migrator = orm.getMigrator();
      const res = await migrator.createMigration();
      console.log(res.diff.up);
      expect(res.diff.up).toEqual(
        expect.arrayContaining([
          expect.stringContaining("`status` enum('New') not null default 'New'"),
        ]),
      );
    });
  });

  describe("with CLI", () => {
    const migrationsDir = "src/migrations";
    const expectedValue = "\\`status\\` enum('New') not null default 'New'"

    test("without default ref", async () => {
      const migrationName = "test_migration_without_default_ref";
      execSync(`yarn mikro-orm migration:create -i --config ./src/testconfig-1.ts -n '${migrationName}'`);
      const files = fs.readdirSync(migrationsDir);
      const migrationFile = files.find((f) => f.includes(migrationName));

      expect(migrationFile).toBeDefined();

      const migrationContent = fs.readFileSync(
        path.join(migrationsDir, migrationFile!),
        "utf-8"
      );

      expect(migrationContent).toContain(
        expectedValue
      );
    });
    test("with default ref", async () => {
      const migrationName = "test_migration_with_default_ref";
      execSync(`yarn mikro-orm migration:create -i --config ./src/testconfig-2.ts -n '${migrationName}'`);

      const files = fs.readdirSync(migrationsDir);
      const migrationFile = files.find((f) => f.includes(migrationName));

      expect(migrationFile).toBeDefined();

      const migrationContent = fs.readFileSync(
        path.join(migrationsDir, migrationFile!),
        "utf-8"
      );

      expect(migrationContent).toContain(
        expectedValue
      );
    });
  });
});
