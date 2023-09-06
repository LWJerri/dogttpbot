import { Composer, InlineQueryResultBuilder } from "grammy";

export const inlineQueryComposer = new Composer();

inlineQueryComposer.on("inline_query", async (ctx) => {
  const { id, query } = ctx.inlineQuery;

  if (!query) return;

  const request = await fetch(`https://http.dog/${query}.jpg`);
  const isCodeFound = request.headers.get("content-type") === "image/jpeg";

  const buildPhotoUrl = `https://http.dog/${isCodeFound ? query : "404"}.jpg`;
  const mdnDocsURL = `[More info about ${query} code.](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${query})`;

  const inlineQueryResponse = InlineQueryResultBuilder.photo(id, buildPhotoUrl, {
    thumbnail_url: buildPhotoUrl,
    caption: isCodeFound ? mdnDocsURL : "Requested HTTP code not found 😭",
    parse_mode: "Markdown",
  });

  await ctx.answerInlineQuery([inlineQueryResponse], { cache_time: 60 * 60 * 24 });
});
