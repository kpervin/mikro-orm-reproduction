import { execSync } from "child_process";

const DOCKER_WAIT_TIMEOUT = 30;

export default async (): Promise<void> => {
  console.log("\n[GlobalSetup] Starting Docker services...");
  try {
    execSync(`docker-compose up -d --wait --timeout ${DOCKER_WAIT_TIMEOUT}`, {
      stdio: "inherit",
    });
    console.log(
      "[GlobalSetup] Docker services are healthy and ready for tests!",
    );
  } catch (err) {
    console.error("[GlobalSetup] Failed to start Docker services:", err);
    process.exit(1);
  }
};
