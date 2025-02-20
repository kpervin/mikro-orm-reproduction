import { execSync } from "child_process";

module.exports = async (): Promise<void> => {
  console.log("Starting docker compose");
  execSync(`yarn posttest`);
};
