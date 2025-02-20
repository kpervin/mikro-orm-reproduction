import assert from "node:assert";
import { execSync } from "child_process";
import { MikroORM } from "@mikro-orm/mysql";
/**
 * [Needed for ts-jest path resolution](https://kulshekhar.github.io/ts-jest/docs/getting-started/paths-mapping/#if-using-globalsetup-or-globalteardown)
 */
import "tsconfig-paths/register";

async function waitForMySqlConnection(
  retries = 30,
  delayMs = 3000,
): Promise<MikroORM> {
  for (let i = 1; i <= retries; i++) {
    try {
      const orm = await MikroORM.init();
      console.log("MySQL is up and MikroORM is ready!");
      return orm;
    } catch (error) {
      assert(error instanceof Error);
      console.log(`Attempt ${i} failed: ${error.message}`);
      console.log(
        `Waiting for MySQL to start. Retrying in ${delayMs / 1000} seconds...`,
      );
      // Wait before trying again
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error(
    `Unable to connect to MySQL via MikroORM after ${retries} attempts.`,
  );
}

module.exports = async () => {
  console.log("Starting docker compose");
  execSync(`yarn pretest`);

  const orm = await waitForMySqlConnection();

  console.log("Refreshing Schema");
  await orm.schema.refreshDatabase();
  await orm.close(true);
};