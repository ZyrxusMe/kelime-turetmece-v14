export default async (client,db, interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return interaction.reply({ content: "Bir hata oluştu ve kendini burada buldun.", ephemeral: true });
    command.execute(client,db, interaction);
};
