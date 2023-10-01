import "dotenv/config";
import express from "express";
import { Bot, InlineKeyboard, InlineQueryResultBuilder, webhookCallback } from "grammy";
import ngrok from "ngrok";

const { BOT_TOKEN, NGROK_TOKEN, NODE_ENV } = process.env;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is not defined.");

const bot = new Bot(BOT_TOKEN, { client: { canUseWebhookReply: (method) => method === "sendChatAction" } });

if (NODE_ENV === "development") {
  if (!NGROK_TOKEN) throw new Error("NGROK_TOKEN is not defined.");

  const app = express();

  await ngrok.authtoken({ authtoken: NGROK_TOKEN });

  const url = await ngrok.connect({ addr: 3000 });

  app.use(webhookCallback(bot, "https"));

  app.listen(3000);

  const { statusText } = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${url}`);

  console.log(`Webhook set with response: ${statusText}`);
}

bot.command("start", async (ctx) => {
  const keyboard = new InlineKeyboard().switchInlineCurrent("Search in this chat").row().switchInline("Share HTTP dog");

  const messages = [
    "I can search for HTTP dog inline.",
    "This bot [open-source](github.com/LWJerri/dogttpbot) and uses [grammY](https://grammy.dev) 🌈",
  ];

  await ctx.reply(messages.join("\n\n"), { parse_mode: "Markdown", reply_markup: keyboard });
});

bot.on("inline_query", async (ctx) => {
  const { id, query } = ctx.inlineQuery;

  if (!query) return;

  const request = await fetch(`https://http.dog/${query}.jpg`);
  const isContentTypeFound = request.headers.get("content-type") === "image/jpeg";

  const buildPhotoUrl = `https://http.dog/${isContentTypeFound ? query : "404"}.jpg`;
  const mdnDocsURL = `[More info about ${query} code.](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${query})`;

  const inlineQueryResponse = InlineQueryResultBuilder.photo(id, buildPhotoUrl, {
    thumbnail_url: buildPhotoUrl,
    caption: isContentTypeFound ? mdnDocsURL : "Requested HTTP code not found 😭",
    parse_mode: "Markdown",
  });

  await ctx.answerInlineQuery([inlineQueryResponse], { cache_time: 60 * 60 * 24 });
});

export default webhookCallback(bot, "https");
