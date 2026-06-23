import { Log } from "../index.js";

async function run() {
  try {
    const result = await Log("frontend", "info", "api", "Test log");
    console.log("Log sent successfully:", result);
  } catch (error) {
    console.error("Failed to send log:", error.message);
    process.exitCode = 1;
  }
}

run();
