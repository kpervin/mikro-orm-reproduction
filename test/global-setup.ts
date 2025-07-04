import { execSync } from "child_process";

export default async (): Promise<void> => {
  console.log("\n[GlobalSetup] Starting Docker services...");
  try {
    execSync(`docker-compose up -d --wait`, {
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
