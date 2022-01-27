const axios = require("axios");
const request = require("request");
const { Client, Intents } = require("discord.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const token = process.env["token"];
const keepAlive = require("./server");
var counter = 0;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const activities = [
    "discord.js",
    `on ${client.guilds.cache.size} servers`,
    "for / command",
    "Anime",
  ];
  function activityCycle() {
    if (counter == 0) {
      client.user.setActivity(activities[counter], {
        type: "PLAYING",
      });
    } else if (counter == 3) {
      client.user.setActivity(activities[counter], {
        type: "WATCHING",
      });
      counter = 0;
    } else if (counter == 2) {
      client.user.setActivity(activities[counter], {
        type: "LISTENING",
      });
    } else if (counter == 1) {
      client.user.setActivity(activities[counter], {
        type: "STREAMING",
      });
    }
    counter = counter + 1;
    setTimeout(activityCycle, 30000);
  }
  setTimeout(activityCycle, 0);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply(`Pong! ${Math.round(client.ws.ping)} ms`);
  } else if (interaction.commandName === "sun") {
    await axios
      .get(
        "https://www.spaceweatherlive.com/includes/live-data.php?object=solar_flare&lang=EN",
        {
          headers: {
            Referer:
              "https://www.spaceweatherlive.com/includes/live-data.php?object=solar_flare&lang=EN",
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      )
      .then(async function (response) {
        data = await response.data;
      });
    //console.log(data["0"]["data"])
    await interaction.reply({
      embeds: [
        {
          title: "Current Solar Activity",
          description:
            "Current value: **" +
            data["val"].replace(">", "<").split("<")[2] +
            "**\n" +
            "2h max: **" +
            data["val2"].replace(">", "<").split("<")[2] +
            "**\n" +
            "24h max: **" +
            data["val24"].replace(">", "<").split("<")[2] +
            "**\n\n**Notice**\nA & B = Quiet\nC = Small flare\nM = Strong flare\nX = Major flare",
          thumbnail: { url: "https://i.ibb.co/D9ZrDT8/sun-1.png" },
          color: "ORANGE",
        },
      ],
    });
  }
});

keepAlive();
client.login(token);
