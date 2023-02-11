require('dotenv').config();

const { Client, Events, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');

const bot = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

// Make sure to grant the Message Content Intent Gateway Intents Privilege to your bot

// Execute once when the bot is ready
bot.once(Events.ClientReady, (c) => {
	console.log(`Bot is ready! Logged in as ${c.user.tag}`);
});

bot.on(Events.MessageCreate, async (message) => {
	const score = await checkToxicLevel(message.content)
	console.log(score)
	if (score > 0.70 && message.author.username!='filter-bot') {
		message.delete()
  		.then(msg => console.log(`Deleted message from ${msg.author.username}`))
  		.catch(console.error);
		message.channel.send(`<@${message.author.id}> Please refrain from insulting, harassing, annoying, boasting, snitching, spamming and crying`)
		
		// bot.com({
		// 	data: "Thank You!",
		// })
	}
})

async function checkToxicLevel(messageContent) {
	const URL = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.PERSPECTIVE_API_KEY}`
	
	const body = {
		comment: {
			text: messageContent
		},
		languages: ['en', 'hi-Latn'],
		requestedAttributes: {
			TOXICITY: {}
		}
	}
	const options = {
		method: 'POST',
		body: JSON.stringify(body)
	}

	const response = await fetch(URL, options);
	const result = await response.json();
	console.log(result);
	console.log(result.attributeScores.TOXICITY.spanScores)
	return result.attributeScores.TOXICITY.spanScores[0].score.value
}

console.log(process.env.BOT_TOKEN)
bot.login(`${process.env.BOT_TOKEN}`);
