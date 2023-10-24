import { SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
    .setName('oyna')
    .setDescription('Sunucu içi Kelime Türetme oyununu kur.')
    .addChannelOption(o=>
        o.setName("kanal")
            .setDescription("Oyun hangi kanalda başlatılmalı?")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);
    
const execute = async (client, db, interaction) => {
    const channel = interaction.options.getChannel('kanal');
    await channel.send("Test Mesajı (Yetki Kontrol)").then(async(m)=>{
        await m.delete()
    }).catch(()=>{
        return interaction.reply({content: "Kanala mesaj atılırken bir hata oluştu. Gereken yetkileri verdiğinizden emin olmalısınız."})
    })
    let word;
    do {word = String.fromCharCode(65 + Math.floor(Math.random() * 26));} while (word == 'X' || word == 'W' || word == "Q");
        db.set(`ayarlar.${interaction.guild.id}`, {
        channel: channel.id,
        word,
        setBy: interaction.user.id,
        wordCount: 0,
        words: [],
        lastUser: client.user.id
    })

    const embed = new EmbedBuilder()
    .setColor("Aqua")
    .setThumbnail(client.user.avatarURL())
    .setTitle(`Kelime Türetmece | ${client.user.username}`)
    .setDescription(`- Nasıl Oynanır?
> En son türetilen kelimenin son harfi ile biten bir kelime türetmelisiniz.
> Kelimeler Türkçe olmalıdır.

Türetmen gereken kelime **${word}** ile başlamalıdır.

- Sohbet
> Eğer kanalda sohbet etmek istiyorsan yazının başına **!** koyman yeterli.
    `)
    await channel.send({embeds:[embed]})
    interaction.reply({content: `${channel} kanalına kelime türetmece kuruldu.`, ephemeral: true})
};

export { data, execute };
