import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

const data = new SlashCommandBuilder()
    .setName('bitir')
    .setDescription('Sunucu içi Kelime Türetme oyununu bitir.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);
    
const execute = async (client, db, interaction) => {

    let ayran  = await db.get(`ayarlar.${interaction.guild.id}`)
    if(!ayran) return await interaction.reply({content:"Bu sunucuda ayar yapılmamış."})

    db.delete(`ayarlar.${interaction.guild.id}`)
    await interaction.reply({content: "Oyun başarılı bir şekilde bitirildi."})
};

export { data, execute };
