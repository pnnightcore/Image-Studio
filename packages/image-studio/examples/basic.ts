import { ImageStudio, isImageStudioError } from "../src/index.js";

const studio = new ImageStudio({ baseUrl: process.env.IMAGE_STUDIO_URL ?? "http://localhost:3000" });

try {
  const card = await studio.quote({
    quote: "Ship it.",
    author: "Image Studio",
    handle: "@imagestudio",
    tag: "#sdk",
    avatar: "https://example.com/avatar.png", // URL, data URI, Buffer/Uint8Array or Blob
    layout: "modern-card",
  });
  console.log(`${card.width}x${card.height} ${card.mime} in ${card.renderMs} ms on ${card.runtime}`);
  await card.save("quote.png");

  const welcome = await studio.presetAnimation("welcome", { variables: { userName: "Alex", guildName: "Legends" } });
  await welcome.save("welcome.gif");
} catch (error) {
  if (isImageStudioError(error)) console.error(error.code, error.status, error.message, error.attempts);
  else throw error;
}
