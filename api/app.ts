import "dotenv/config";
import express from "express";
import { Bot, InlineKeyboard, InlineQueryResultBuilder, webhookCallback } from "grammy";
import localtunnel from "localtunnel";

const { BOT_TOKEN, VERCEL_ENV, PORT, SECRET_TOKEN } = process.env;

if (!BOT_TOKEN || !SECRET_TOKEN) throw new Error("BOT_TOKEN or SECRET_TOKEN is not defined.");

const bot = new Bot(BOT_TOKEN, { client: { canUseWebhookReply: (method) => method === "sendChatAction" } });

// This code will be executed only in development environment.
if (!VERCEL_ENV && PORT) {
  const app = express();

  app.use(express.json());
  app.use(webhookCallback(bot, "express", { secretToken: SECRET_TOKEN }));

  app.listen(PORT);

  const { url } = await localtunnel({ port: Number(PORT) });

  await bot.api.setWebhook(url, { secret_token: SECRET_TOKEN });

  console.log(`Development webhook is set to ${url}.`);
}

bot.command("start", async (ctx) => {
  const keyboard = new InlineKeyboard().switchInlineCurrent("Search in this chat").row().switchInline("Share HTTP dog");

  const messages = [
    "I can search for HTTP dog inline.",
    "This bot is [open-source](github.com/LWJerri/dogttpbot) and uses [grammY](https://grammy.dev) 🌈",
  ];

  await ctx.reply(messages.join("\n\n"), { parse_mode: "Markdown", reply_markup: keyboard });
});

bot.on("inline_query", async (ctx) => {
  const { id, query } = ctx.inlineQuery;

  if (!query) return;

  const request = await fetch(`https://httpstatusdogs.com/img/${query}.jpg`);
  const isImageContentType = request.headers.get("content-type") === "image/jpeg";

  if (!isImageContentType) return;

  const photoUrl = `https://http.dog/${query}.jpg`;
  const mdnWebDocsUrl = `[More info about ${query} code.](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${query})`;

  const inlineQueryResponse = InlineQueryResultBuilder.photo(id, photoUrl, {
    thumbnail_url: photoUrl,
    caption: mdnWebDocsUrl,
    parse_mode: "Markdown",
  });

  await ctx.answerInlineQuery([inlineQueryResponse], { cache_time: 60 * 60 * 24 * 7 });
});

export default webhookCallback(bot, "https", { secretToken: SECRET_TOKEN });
