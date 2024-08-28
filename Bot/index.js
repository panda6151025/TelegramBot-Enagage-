const { Telegraf, Markup } = require("telegraf");
const BOT_TOKEN = "7400574665:AAH7ufiDzEgR5z-2LqmXFIaZqwML7YajpbY";
const bot = new Telegraf(BOT_TOKEN);
const express = require("express");
const axios = require('axios');
const cors = require("cors");
const app = express();
app.use(express.json());
const web_link = "https://telegram-bot-enagage.vercel.app";
const community_link = "https://t.me/kelvincecil";

app.use(cors());

bot.start((ctx) => {
  const startPayload = ctx.startPayload;
  const urlSent = `${web_link}?ref=${startPayload}`;
  const user = ctx.message.from;
  const userName = user.username ? `@${user.username}` : user.first_name;
  ctx.reply(`Hey, ${userName}Welcome to Engage Tap Bot, your gateway to earning $ENG tokens while engaging with top Web3 projects!
🚀 Earn $ENG Tokens: Join the Engage Bot on Telegram, complete social tasks to earn Engage points and receive an airdrop based on your accumulated points. 
⬆️ Receive Unique Airdrops from Top-Tier Projects: The higher your level, the more you receive from airdrops of top-tier projects. 
🎮 Play Games to Earn: Dive into various games within the bot to earn even more Engage Points.
💎 Unlock Advanced Tasks: Use your ENG points to access more challenging tasks and boost your earnings.
⚡ Purchase Boosts: Enhance your bot’s performance with special boosts available through Engage points.
🏆 Access Premium Rewards: Participate in exclusive reward campaigns and tap into premium reward pools using your Engage points.
Engage with the bot now and start earning your rewards!`, {
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

app.listen(3003, () => {
  console.log("server is me and now running");
});
