export default async (): Promise<void> => {
  console.log("\n[GlobalTeardown] Stopping Docker services...");
  try {
    execSync("docker-compose down -v", { stdio: "inherit" });
    console.log("[GlobalTeardown] Docker services stopped.");
  } catch (err) {
    console.error("[GlobalTeardown] Failed to stop Docker services:", err);
  }
};
