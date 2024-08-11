const { Telegraf, Markup } = require("telegraf");
const BOT_TOKEN = "7265097765:AAHgJP4-0AhN411AtmMO9A7vfwzfWIchOUs";
const bot = new Telegraf(BOT_TOKEN);
const express = require("express");
const axios = require('axios');
const cors = require('cors');
const app = express()
app.use(express.json())
const web_link = "https://telegram-bot-enagage.vercel.app";
const community_link = "https://t.me/kelvincecil";

app.use(cors());

bot.start((ctx) => {
  const startPayload = ctx.startPayload;
  const urlSent = `${web_link}?ref=${startPayload}`;
  const user = ctx.message.from;
  const userName = user.username ? `@${user.username}` : user.first_name;
  ctx.replyWithMarkdown(`*Hey, ${userName}! Welcome to My Bot! Contact the Developer of this bot web app @Kelvincecil*
Tap on the coin and see token rise.
      
*THIS BOT Bot* is a Decentralized Exchange on the TON Blockchain. The biggest part of bot TOKEN distribution will occur among the players here.
      
Got friends, relatives, co-workers?
Bring them all into the game.
More buddies, more coins.`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "👋 Start now!", web_app: { url: urlSent } }],
        [{ text: "Join our Community", url: community_link }]

      ],
      in: true
    },
  });
});




bot.launch();

app.listen(3002, () => {
  console.log("server is me and now running")
})