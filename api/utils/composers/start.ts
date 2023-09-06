import { Composer, InlineKeyboard } from "grammy";

export const startComposer = new Composer();

startComposer.command("start", async (ctx) => {
  const keyboard = new InlineKeyboard().switchInlineCurrent("Search in this chat").row().switchInline("Share HTTP dog");

  const messages = [
    "I can search for HTTP dog inline.",
    "This bot [open-source](github.com/LWJerri/dogttpbot) and uses [grammY](https://grammy.dev) 🌈",
  ];

  await ctx.reply(messages.join("\n\n"), {
    reply_to_message_id: ctx.message.message_id,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    reply_markup: keyboard,
  });
});
