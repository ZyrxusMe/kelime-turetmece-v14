import tdk from "../util/tdk.js";

export default async (client, db, message) => {
    const find = await db.get(`ayarlar.${message.guild.id}`);

    if (!find || !find.channel || message.channel.id !== find.channel || message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.split(' ');
    const kelime = args[0].toLowerCase();

    const del = async (msg) => {
        setTimeout(() => {
            msg.delete().catch(() => {});
            message.delete().catch(() => {});
        }, 3000);
    };

    if (find.lastUser === message.author.id) {
        message.react("❌");
        return message.reply("Üst üste aynı kişi kelime yazamaz.").then(del);
    }

    if (message.content.length < 3) {
        message.react("❌");
        return message.reply("Kelime 2 harften fazla olmalıdır.").then(del);
    }
    
    if (find.words.includes(kelime)) {
        message.react("❌");
        return message.reply("Bu kelime önceden kullanılmış.").then(del);
    }

    if( !kelime.startsWith(find.word[find.word.length - 1].toLowerCase())) {
        message.react("❌");
        return message.reply(`Kelime ${find.word[find.word.length - 1]} ile başlamalıdır.`).then(del);
    }

    const findKelime = await tdk.find("gts",kelime);

    if (!findKelime) {
        message.react("❌");
        return message.reply("Bu kelime Türk Dil Kurumunda bulunmamaktadır.").then(del);
    }

    await db.set(`ayarlar.${message.guild.id}.word`, kelime);
    
    if (kelime.endsWith("ğ")) {
        let randomHarf;
        do {randomHarf = String.fromCharCode(65 + Math.floor(Math.random() * 26));} while (randomHarf == 'X' || randomHarf == 'W' || randomHarf == "Q");
    
        await db.set(`ayarlar.${message.guild.id}.word`, randomHarf);
        message.reply(`Kelime **Ğ** ile bittiği için yeni harf belirlendi. Türetilen kelime **${randomHarf}** ile başlamalı.`);
    }
    
    await db.add(`ayarlar.${message.guild.id}.wordCount`, 1);
    await db.push(`ayarlar.${message.guild.id}.words`, kelime);
    await db.set(`ayarlar.${message.guild.id}.lastUser`, message.author.id);

    message.react("✅");
};
