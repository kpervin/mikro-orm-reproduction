import { MikroORM } from "@mikro-orm/mysql";
import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { TestEntity1 } from "./entities/test.entity";
import { TestEntity2 } from "./entities/test2.entity";
import { User } from "./entities/user.entity";
import mikroOrmConfig from "./mikro-orm.config";

describe("Migrations Test", () => {
  afterEach(async () => {
    execSync(`rm -rf ./src/migrations`);
    execSync(`rm -rf ./temp`);
  });

  describe("code-first", () => {
    let orm: MikroORM;

    afterEach(async () => {
      await orm.close(true);
    });

    test.each([
      { entity: TestEntity1, title: "without default ref" },
      { entity: TestEntity2, title: "with default ref" },
    ])("$title", async ({ entity }) => {
      orm = await MikroORM.init({
        ...mikroOrmConfig,
        entities: [ User, entity ],
        connect: false,
      });
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
    const expectedValue = "\\`status\\` enum('New') not null default 'New'";

    test.each([
      {
        configPath: `./src/testconfig-1.ts`,
        title: "without default ref",
      },
      {
        configPath: `./src/testconfig-2.ts`,
        title: "with default ref",
      },
    ])("$title", async ({ configPath, title }) => {
      const migrationName = `test_migration_${title.replace(/\s/g, "_")}`;
      execSync(`yarn mikro-orm migration:create --config ${configPath} -n '${migrationName}'`);
      const files = fs.readdirSync(migrationsDir);
      const migrationFile = files.find((f) => f.includes(migrationName));

      expect(migrationFile).toBeDefined();

      const migrationContent = fs.readFileSync(
        path.join(migrationsDir, migrationFile!),
        "utf-8",
      );

      expect(migrationContent).toContain(
        expectedValue,
      );
    });
  });
});
