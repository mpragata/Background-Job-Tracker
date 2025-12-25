/**
 * config.ts
 *
 * Loads environment variables depending on NODE_ENV.
 * Uses local .env for development, system envs for production.
 */

import * as dotenv from "dotenv";
import * as path from "path";

// Determine env file path
const envFile =
  process.env.NODE_ENV === "production"
    ? path.resolve(process.cwd(), "src", "config", ".env.production")
    : path.resolve(process.cwd(), "src", "config", ".env");

// Load environment variables
const result = dotenv.config({ path: envFile });

if (result.error) {
  if (result.error.message.includes("ENOENT")) {
    console.warn(
      `[Config] WARNING: Could not find ${envFile}. Using system environment variables.`
    );
  } else {
    console.error(
      "[Config] Error loading environment variables:",
      result.error
    );
  }
} else {
  console.log(`[Config] Loaded environment variables from ${envFile}`);
}

// Optional: Validate required env variables
const requiredEnv = ["MONGO_URI", "DB_NAME"];
const optEnv = ["BACKEND_PORT", "URL", "FRONTEND_URL"];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`[Config] WARNING: ${key} is not defined.`);
  }
});
