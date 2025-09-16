import { MikroORM, ReflectMetadataProvider } from "@mikro-orm/mysql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import mikroOrmConfig from "./mikro-orm.config";


const MetadataProviders = {
  "reflect-metadata": ReflectMetadataProvider,
  "tsmorph": TsMorphMetadataProvider,
} as const;

describe.each([
  "reflect-metadata",
  "tsmorph",
] as const)("Migrations Test %s", (metadataProvider) => {
  const { User } = require(`./entities/${metadataProvider}/user.entity`);
  const { TestEntity1 } = require(`./entities/${metadataProvider}/test.entity`);
  const { TestEntity2 } = require(`./entities/${metadataProvider}/test2.entity`);

  const _metadata = MetadataProviders[metadataProvider];

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
        metadataProvider: _metadata,
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
        configPath: `./src/testconfig-1.${metadataProvider}.ts`,
        title: "without default ref",
      },
      {
        configPath: `./src/testconfig-2.${metadataProvider}.ts`,
        title: "with default ref",
      },
    ])("$title", async ({configPath, title}) => {
      const migrationName = `test_migration_${title.replace(/\s/g,"_")}`;
      execSync(`yarn mikro-orm migration:create -i --config ${configPath} -n '${migrationName}'`);
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
