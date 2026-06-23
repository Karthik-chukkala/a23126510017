import { Log } from "../../../logging-middleware/index.js";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://4.224.186.213/evaluation-service";

const ACCESS_TOKEN = import.meta.env.VITE_LOG_MIDDLEWARE_BEARER_TOKEN || "";

function log(level, message) {
  Log("frontend", level, "api", message).catch(() => {});
}

export async function fetchNotifications(filter = "All", page = 1) {
  log("info", `Fetching notifications — filter: ${filter}, page: ${page}`);

  let url = `${BASE_URL}/notifications?page=${page}`;
  if (filter && filter !== "All") {
    url += `&type=${filter.toLowerCase()}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const errorMsg =
      response.status === 401
        ? "Server error 401: unauthorized. Check your bearer token in .env."
        : `Server error ${response.status}`;
    log("error", errorMsg);
    throw new Error(errorMsg);
  }

  const data = await response.json();
  log("info", `Loaded ${data.notifications?.length ?? 0} notifications`);
  return data;
}
