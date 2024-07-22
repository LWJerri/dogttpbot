const { VERCEL_URL, SECRET_TOKEN, BOT_TOKEN } = process.env;

if (!VERCEL_URL) throw new Error("VERCEL_URL not defined.");
if (!BOT_TOKEN || !SECRET_TOKEN) throw new Error("BOT_TOKEN or SECRET_TOKEN is not defined.");

const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

const deploymentUrl = `https://${VERCEL_URL}/api/app`;

fetch(`${BASE_URL}/setWebhook?url=${deploymentUrl}&secret_token=${SECRET_TOKEN}`)
  .then(() => console.log(`Development webhook is set to ${deploymentUrl}.`))
  .catch(console.error);
