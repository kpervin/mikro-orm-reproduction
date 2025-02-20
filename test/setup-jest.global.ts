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
): Promise<void> {
  for (let i = 1; i <= retries; i++) {
    try {
      const orm = await MikroORM.init();
      await orm.close(true);
      console.log("MySQL is up and MikroORM is ready!");
      return;
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

  await waitForMySqlConnection();

  console.log("Refreshing Schema");
  execSync("yarn mikro-orm schema:fresh --run");
};