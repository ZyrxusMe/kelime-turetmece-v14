import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong');

const execute = async (client,db, interaction) => {
    interaction.reply(`🏓 Pong! ${Date.now() - interaction.createdTimestamp}ms`);
};

export { data, execute };
