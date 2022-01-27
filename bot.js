const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const token = process.env['token'];
const keepAlive = require('./server');
var server_num=0
const activities = ["discord.js", `on ${server_num} servers`, "/ command", "Anime"];
var counter = 0;

function activityCycle() {
    if (counter < 3) {
        client.user.setActivity(activities[counter], {
            type: "PLAYING",
        });
    } else{
        client.user.setActivity(activities[counter], {
            type: "WATCHING",
        });
        counter=0
    }
    counter =counter+ 1;
    setTimeout(activityCycle, 30000);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    server_num=client.guilds.cache.size;
    setTimeout(activityCycle, 0);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply(`Pong! ${Math.round(client.ws.ping)} ms`);
    } else if (interaction.commandName === 'video') {
        await interaction.reply('https://www.youtube.com/playlist?list=UUIuFRHmDktSjlHex7Hahcug&playnext=1&index=1');
    }
});

keepAlive()
client.login(token);