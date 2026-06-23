const LOG_ENDPOINT_DEFAULT = "http://4.224.186.213/evaluation-service/logs";

const ALLOWED_STACKS = new Set(["frontend", "backend"]);
const ALLOWED_LEVELS = new Set(["debug", "info", "warn", "error", "fatal"]);
const FRONTEND_PACKAGES = new Set(["api", "component", "hook", "page", "state", "style"]);
const SHARED_PACKAGES = new Set(["auth", "config", "middleware", "utils"]);

function readEnv(key) {
  if (typeof process !== "undefined" && process?.env?.[key]) {
    return process.env[key];
  }

  if (typeof import.meta !== "undefined" && import.meta?.env?.[key]) {
    return import.meta.env[key];
  }

  return undefined;
}

function resolveBearerToken() {
  return (
    readEnv("LOG_MIDDLEWARE_BEARER_TOKEN") ||
    readEnv("EVALUATION_SERVICE_BEARER_TOKEN") ||
    readEnv("VITE_LOG_MIDDLEWARE_BEARER_TOKEN") ||
    readEnv("VITE_EVALUATION_SERVICE_BEARER_TOKEN")
  );
}

function resolveLogEndpoint() {
  return (
    readEnv("LOG_MIDDLEWARE_ENDPOINT") ||
    readEnv("VITE_LOG_MIDDLEWARE_ENDPOINT") ||
    LOG_ENDPOINT_DEFAULT
  );
}

function validateStack(stack) {
  if (!ALLOWED_STACKS.has(stack)) {
    throw new Error(
      `Invalid stack '${stack}'. Allowed values: ${Array.from(ALLOWED_STACKS).join(", ")}.`
    );
  }
}

function validateLevel(level) {
  if (!ALLOWED_LEVELS.has(level)) {
    throw new Error(
      `Invalid level '${level}'. Allowed values: ${Array.from(ALLOWED_LEVELS).join(", ")}.`
    );
  }
}

function validatePackage(stack, packageName) {
  const allowedPackages =
    stack === "frontend"
      ? new Set([...FRONTEND_PACKAGES, ...SHARED_PACKAGES])
      : SHARED_PACKAGES;

  if (!allowedPackages.has(packageName)) {
    throw new Error(
      `Invalid package '${packageName}' for stack '${stack}'. Allowed values: ${Array.from(
        allowedPackages
      ).join(", ")}.`
    );
  }
}

function validateMessage(message) {
  if (typeof message !== "string" || message.trim().length === 0) {
    throw new Error("Invalid message. 'message' must be a non-empty string.");
  }
}

export async function Log(stack, level, packageName, message) {
  validateStack(stack);
  validateLevel(level);
  validatePackage(stack, packageName);
  validateMessage(message);

  if (typeof fetch !== "function") {
    throw new Error("Global fetch API is not available in this runtime.");
  }

  const token = resolveBearerToken();
  if (!token) {
    throw new Error(
      "Missing bearer token. Set LOG_MIDDLEWARE_BEARER_TOKEN (or VITE_LOG_MIDDLEWARE_BEARER_TOKEN)."
    );
  }

  const endpoint = resolveLogEndpoint();
  const payload = {
    stack,
    level,
    package: packageName,
    message,
  };

  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new Error(`Network error while sending log: ${error?.message || String(error)}`);
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const responseBody = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const details = isJson ? JSON.stringify(responseBody) : String(responseBody);
    throw new Error(
      `Logging API request failed with status ${response.status} ${response.statusText}. Response: ${details}`
    );
  }

  return responseBody;
}
