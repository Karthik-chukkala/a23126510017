# Logging Middleware

Reusable JavaScript logging middleware for Campus Evaluation projects.

This package exposes:

- `Log(stack, level, packageName, message)`

It sends logs to:

- `POST http://4.224.186.213/evaluation-service/logs`

## Supported Values

### Stack

- `frontend`
- `backend`

### Level

- `debug`
- `info`
- `warn`
- `error`
- `fatal`

### Frontend Packages

- `api`
- `component`
- `hook`
- `page`
- `state`
- `style`

### Shared Packages

- `auth`
- `config`
- `middleware`
- `utils`

## Environment Configuration

Do not hardcode tokens in source code.

Set one of the following environment variables for bearer token:

- `LOG_MIDDLEWARE_BEARER_TOKEN`
- `EVALUATION_SERVICE_BEARER_TOKEN`
- `VITE_LOG_MIDDLEWARE_BEARER_TOKEN`
- `VITE_EVALUATION_SERVICE_BEARER_TOKEN`

Optional endpoint override:

- `LOG_MIDDLEWARE_ENDPOINT`
- `VITE_LOG_MIDDLEWARE_ENDPOINT`

If endpoint is not provided, default is:

- `http://4.224.186.213/evaluation-service/logs`

## Usage

```js
import { Log } from "@campus-evaluation/logging-middleware";

await Log("frontend", "info", "api", "Fetching notifications");
```

Local file import usage:

```js
import { Log } from "./index.js";

await Log("frontend", "info", "api", "Fetching notifications");
```

## Example Script

A runnable example is available at:

- `examples/test-log.js`

Run it:

```bash
npm run example
```

The script includes:

```js
await Log("frontend", "info", "api", "Test log");
```

## Error Handling

`Log(...)` throws meaningful errors for:

- Invalid `stack`
- Invalid `level`
- Invalid `packageName`
- Empty or invalid `message`
- Missing bearer token
- Network failures
- Non-2xx API responses

## Integrating Later with notification-app-fe

This package is ESM and can be imported by a frontend app later via package linking or publishing.
