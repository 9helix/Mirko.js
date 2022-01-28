const axios = require("axios");
const request = require("request");

const { Client, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const token = process.env["token"];
const admin_id = process.env["admin_id"];
const keepAlive = require("./server");
let counter = 0;

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const activities = [
        "discord.js",
        `on ${client.guilds.cache.size} servers`,
        "/ command",
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
    } else if (interaction.commandName === "moon") {
        request(
            "https://www.timeanddate.com/moon/phases/",
            (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    const cheerio = require("cheerio");
                    const $ = cheerio.load(html);

                    const moon = $("#qlook").text();
                    //console.log(moon)
                    const perc = moon.substring(6, moon.indexOf("%") + 1);
                    const phase = moon.substring(moon.indexOf("%") + 1);
                    let status = "";
                    //console.log(perc, phase)
                    if (phase.indexOf("Waxing") != -1) {
                        status = "Mjesec raste.";
                    } else if (phase.indexOf("Waning") != -1) {
                        status = "Mjesec pada.";
                    } else if (phase.indexOf("Full") != -1) {
                        status = "Pun mjesec.";
                    } else if (phase.indexOf("New") != -1) {
                        status = "Mlađak.";
                    } else if (phase.indexOf("First") != -1) {
                        status = "Prva četvrt.";
                    } else if (phase.indexOf("Third") != -1) {
                        status = "Treća četvrt.";
                    }
                    interaction.reply({
                        embeds: [
                            {
                                title: "Moon Status",
                                description:
                                    "Svjetlina Mjeseca: **" +
                                    perc +
                                    "**\n" +
                                    status,
                                thumbnail: {
                                    url: "https://i.ibb.co/wNFx6PN/full-moon.png",
                                },
                                color: "BLUE",
                            },
                        ],
                    });
                } else {
                    interaction.replay("Pokušaj ponovno kasnije...");
                }
            }
        );
    }
});

keepAlive();
client.login(token);
