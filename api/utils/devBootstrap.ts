import express from "express";
import { webhookCallback } from "grammy";
import ngrok from "ngrok";
import { bot } from "../app";

const { NGROK_TOKEN, BOT_TOKEN } = process.env;

export async function devBootstrap(port: number = 3000) {
  const app = express();

  await ngrok.authtoken(NGROK_TOKEN);

  const url = await ngrok.connect({ addr: port });

  app.use(webhookCallback(bot, "https"));

  app.listen(port);

  const { statusText } = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${url}`);

  console.log(`Webhook set with response: ${statusText}`);
}
