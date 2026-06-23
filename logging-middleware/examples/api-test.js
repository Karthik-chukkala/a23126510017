const TOKEN = process.env.TOKEN;
const ENDPOINT = "http://4.224.186.213/evaluation-service/logs";

async function test() {
  const resp = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      stack: "frontend",
      level: "info",
      package: "api",
      message: "Test log",
    }),
  });

  const text = await resp.text();
  console.log("Status:", resp.status);
  console.log("Body:", text);
}

test().catch(console.error);
