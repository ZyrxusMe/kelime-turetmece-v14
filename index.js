import { Client, Collection, GatewayIntentBits, REST, Routes, ActivityType } from 'discord.js';
import config from './config.js';
import fs from 'fs';
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers
    ]
});
import { checkTokenSafety } from 'ayran';
client.commands = new Collection();
import db from 'croxydb'
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const { data, execute } = await import(`./src/commands/${file}`);

    if (!data) continue;
    data.execute = execute
    client.commands.set(data.name, data);
    console.log(`Komut yüklendi: ${data.name}`);
}

client.on("ready", async () => {
    client.user.setActivity({ state: config.activity || "Abone ol", name: "Custom Status", type: ActivityType.Custom });

    const rest = new REST({ version: '10' }).setToken(config.token);

    try {        
        const commands = client.commands
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log('Slash Komutlar yüklendi.');
    } catch (e) {
        console.error(e);
    }
    console.log(`${client.user.tag} olarak bağlanıldı.`);    
});


const files = await fs.promises.readdir('./src/events');
//checkTokenSafety(config)
for (const file of files) {
    if (file.endsWith('.js')) {
        const event = await import(`./src/events/${file}`);
        const eventName = file.slice(0, -3);

        client.on(eventName, (...args) => event.default(client, db, ...args));
    }
}
client.login(config.token || process.env.token).catch(err => {
    console.log("Bota bağlanılamadı. Gereken intentleri açmamış olabilir veya tokeni yanlış girmiş olabilirsiniz:");
    console.log(err);
});