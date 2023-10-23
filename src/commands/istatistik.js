import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
    .setName('istatistik')
    .setDescription('Bot istatistiği ve Sunucu istatistiği');

const execute = async (client, db, interaction) => {
    let ayran = await db.get(`ayarlar.${interaction.guild.id}`)
    const embed = new EmbedBuilder()
    .setAuthor({name: client.user.username, iconURL: client.user.avatarURL()})
    .setColor("Blue")
    .setFooter({text: interaction.user.username, iconURL: interaction.user.avatarURL()})
    .addFields({name: "Bot İstatistiği", value: `Sunucu Sayısı: ${client.guilds.cache.size}
Kullanıcı Sayısı: ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}
    `})
    if(ayran) {
        embed.addFields({name: "Sunucu İstatistiği", value: `Kanalı Ayarlayan: <@${ayran.setBy}>
Kanal: <#${ayran.channel}>
Türetilen Kelime Sayısı: ${ayran.wordCount}
        `})    
    }
    await interaction.reply({embeds:[embed]})
};

export { data, execute };
// ayran