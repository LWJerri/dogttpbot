import "dotenv/config";
import { Bot, webhookCallback } from "grammy";
import { inlineQueryComposer } from "./utils/composers/inlineQuery";
import { startComposer } from "./utils/composers/start";
import { devBootstrap } from "./utils/devBootstrap";

const { BOT_TOKEN, NGROK_TOKEN, NODE_ENV } = process.env;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is not defined.");

export const bot = new Bot(BOT_TOKEN, { client: { canUseWebhookReply: (method) => method === "sendChatAction" } });

if (NODE_ENV === "development" && !NGROK_TOKEN) {
  console.log("Can't run bot in development mode without NGROK_TOKEN.");
} else {
  await devBootstrap();
}

bot.use(startComposer).use(inlineQueryComposer);

export default webhookCallback(bot, "https");
