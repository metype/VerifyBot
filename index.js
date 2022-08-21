const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder , TextInputBuilder, TextInputStyle, SelectMenuBuilder } = require('discord.js');
const { token } = require('./config.json');
const { setSaveInterval, get } = require('./settings');
const fetch = require('node-fetch');

setSaveInterval(60000); //Settings are comitted every 1 minute.

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [
        'CHANNEL', // Required to receive DMs
    ]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) {

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	} else if (interaction.isButton()) {
		let buttonID = interaction.component.customId;
		let user = interaction.user;
		if (buttonID == "activate-account") {
			const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('java-account')
					.setLabel('Java')
					.setStyle(ButtonStyle.Primary),
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId('bedrock-account')
					.setLabel('Bedrock')
					.setStyle(ButtonStyle.Primary),
			)
			interaction.deferUpdate();
			
			return user.send({ content: 'What type of account do you plan on playing the server with?', components: [row] });
		}
		if (buttonID == "java-account") {
			const modal = new ModalBuilder()
			.setCustomId('java-account-info')
			.setTitle('Account Info');

		//Add components to modal
			
		const nameInput = new TextInputBuilder()
		.setCustomId('nameInput')
		// The label is the prompt the user sees for this input
		.setLabel("What's your name?")
		// Short means only a single line of text
				.setStyle(TextInputStyle.Short);
			
		const relationInput = new TextInputBuilder()
			.setCustomId('relationInput')
			// The label is the prompt the user sees for this input
			.setLabel("What's your relation to TNTech?")
			// Short means only a single line of text
			.setStyle(TextInputStyle.Short);

		// Create the text input components
		const usernameInput = new TextInputBuilder()
			.setCustomId('usernameInput')
		    // The label is the prompt the user sees for this input
			.setLabel("What's your Java Edition username?")
		    // Short means only a single line of text
			.setStyle(TextInputStyle.Short);

		const discordNickname = new TextInputBuilder()
			.setCustomId('discordNicknameInput')
		    // The label is the prompt the user sees for this input
			.setLabel("Discord nick preference? (Must identify you)")
		    // Short means only a single line of text
				.setStyle(TextInputStyle.Short);
			
		const minecraftNickname = new TextInputBuilder()
				.setCustomId('minecraftNicknameInput')
				// The label is the prompt the user sees for this input
				.setLabel("Minecraft nickname preference?")
				// Short means only a single line of text
				.setStyle(TextInputStyle.Short);

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
		const secondActionRow = new ActionRowBuilder().addComponents(relationInput);
		const thirdActionRow = new ActionRowBuilder().addComponents(usernameInput);
		const fourthActionRow = new ActionRowBuilder().addComponents(discordNickname);
		const fifthActionRow = new ActionRowBuilder().addComponents(minecraftNickname);

		// Add inputs to the modal
			modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);
			
		return await interaction.showModal(modal);
		}
		if (buttonID == "bedrock-account") {
			const modal = new ModalBuilder()
			.setCustomId('bedrock-account-info')
			.setTitle('Account Info');

		//Add components to modal
			
		const nameInput = new TextInputBuilder()
		.setCustomId('nameInput')
		// The label is the prompt the user sees for this input
		.setLabel("What's your name?")
		// Short means only a single line of text
				.setStyle(TextInputStyle.Short);
			
		const relationInput = new TextInputBuilder()
			.setCustomId('relationInput')
			// The label is the prompt the user sees for this input
			.setLabel("What's your relation to TNTech?")
			// Short means only a single line of text
			.setStyle(TextInputStyle.Short);

		// Create the text input components
		const usernameInput = new TextInputBuilder()
			.setCustomId('usernameInput')
		    // The label is the prompt the user sees for this input
			.setLabel("What's your Bedrock Edition username?")
		    // Short means only a single line of text
			.setStyle(TextInputStyle.Short);

		const discordNickname = new TextInputBuilder()
			.setCustomId('discordNicknameInput')
		    // The label is the prompt the user sees for this input
			.setLabel("Discord nick preference? (Must identify you)")
		    // Short means only a single line of text
				.setStyle(TextInputStyle.Short);
			
		const minecraftNickname = new TextInputBuilder()
				.setCustomId('minecraftNicknameInput')
				// The label is the prompt the user sees for this input
				.setLabel("Minecraft nickname preference?")
				// Short means only a single line of text
				.setStyle(TextInputStyle.Short);

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
		const secondActionRow = new ActionRowBuilder().addComponents(relationInput);
		const thirdActionRow = new ActionRowBuilder().addComponents(usernameInput);
		const fourthActionRow = new ActionRowBuilder().addComponents(discordNickname);
		const fifthActionRow = new ActionRowBuilder().addComponents(minecraftNickname);

		// Add inputs to the modal
			modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);
			
		return await interaction.showModal(modal);
		}
		if (buttonID.startsWith('accept-application')) {
			let userID = buttonID.split('accept-application-')[1];
			let user = interaction.client.users.cache.get(userID);
			let member = interaction.guild.members.cache.get(user.id);

			member.roles.add(get(interaction.guildId).get('activated-role').object);

			member.send("Your activation request was accepted! Have fun!");

			interaction.message.edit({content: interaction.message.content + "\n:white_check_mark: - Accepted", components: [] });
			interaction.deferUpdate();
		}
		if (buttonID.startsWith('deny-application')) {
			let userID = buttonID.split('deny-application-')[1];

			const modal = new ModalBuilder()
				.setCustomId(`deny-reason-${userID}`)
			.setTitle('Deny Application');

		//Add components to modal
			
			const reasonInput = new TextInputBuilder()
				.setCustomId('reasonInput')
				// The label is the prompt the user sees for this input
				.setLabel("Reason?")
				// Short means only a single line of text
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(false);
			
		// An action row only holds one text input,
		// so you need one action row per text input.
			const firstActionRow = new ActionRowBuilder().addComponents(reasonInput);

		// Add inputs to the modal
			modal.addComponents(firstActionRow);

			interaction.message.edit({ content: interaction.message.content + "\n:x: - Denied", components: [] });

			

			return await interaction.showModal(modal);
		}
	} else if (interaction.isModalSubmit()) {
		if (interaction.customId == "java-account-info") {
			await interaction.deferReply("Checking info...")
			let accountExists = false;
			let submittedName = interaction.fields.getTextInputValue('nameInput');
			let submittedRelation = interaction.fields.getTextInputValue('relationInput');
			let submittedUsername = interaction.fields.getTextInputValue('usernameInput');
			let submittedDiscordNickname = interaction.fields.getTextInputValue('discordNicknameInput');
			let submittedMinecraftNickname = interaction.fields.getTextInputValue('minecraftNicknameInput');

			let validUsernameRegex = /^[a-zA-Z0-9_]{2,16}$/g;

			if (validUsernameRegex.exec(submittedUsername) == null) {
				return await interaction.editReply({ content: 'Invalid Minecraft username.' });
			}

			const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${submittedUsername}`);
			if (response.status != 200) {
				return await interaction.editReply({ content: 'Minecraft username belongs to a non-existant account or an account with only the demo.' });
			}
			const data = await response.json();

			if (!data.name || !data.id || data.demo) {
				return await interaction.editReply({ content: 'Minecraft username belongs to a non-existant account or an account with only the demo.' });
			}

			let activateChannelID = get('871724942260076614').get('activate-channel').object;
			let activateChannel = interaction.client.channels.cache.get(activateChannelID);

			let formattedApplicationLines = [`**New Activation Appication from ${interaction.user.tag}**:\n`,
				`Name: **${submittedName}**`,
				`TNTech Relation: **${submittedRelation}**`,
				`MC Username: **${submittedUsername}**`,
				`Preferred Discord Nickname: **${submittedDiscordNickname}**`,
				`Preferred Minecraft Nickname: **${submittedMinecraftNickname}**`,
				`Account Type: **Java**`,
			];

			const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(`accept-application-${interaction.user.id}`)
					.setLabel('Accept')
					.setStyle(ButtonStyle.Success),
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(`deny-application-${interaction.user.id}`)
					.setLabel('Deny')
					.setStyle(ButtonStyle.Danger),
			)

			activateChannel.send({ content: formattedApplicationLines.join("\n"), components: [row] });

			return await interaction.editReply({ content: 'Your info will be looked at, and your account should be activated soon!' });
		}
		if (interaction.customId == "bedrock-account-info") {
			await interaction.deferReply("Checking info...")
			let accountExists = false;
			let submittedName = interaction.fields.getTextInputValue('nameInput');
			let submittedRelation = interaction.fields.getTextInputValue('relationInput');
			let submittedUsername = interaction.fields.getTextInputValue('usernameInput');
			let submittedDiscordNickname = interaction.fields.getTextInputValue('discordNicknameInput');
			let submittedMinecraftNickname = interaction.fields.getTextInputValue('minecraftNicknameInput');

			let activateChannelID = get('871724942260076614').get('activate-channel').object;
			let activateChannel = interaction.client.channels.cache.get(activateChannelID);

			let formattedApplicationLines = [`**New Activation Appication from ${interaction.user.tag}**:\n`,
				`Name: **${submittedName}**`,
				`TNTech Relation: **${submittedRelation}**`,
				`MC Username: **${submittedUsername}**`,
				`Preferred Discord Nickname: **${submittedDiscordNickname}**`,
				`Preferred Minecraft Nickname: **${submittedMinecraftNickname}**`,
				`Account Type: **Bedrock**`,
			];

			const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(`accept-application-${interaction.user.id}`)
					.setLabel('Accept')
					.setStyle(ButtonStyle.Success),
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(`deny-application-${interaction.user.id}`)
					.setLabel('Deny')
					.setStyle(ButtonStyle.Danger),
			)

			activateChannel.send({ content: formattedApplicationLines.join("\n"), components: [row] });

			return await interaction.editReply({ content: 'Your info will be looked at, and your account should be activated soon!' });
		}
		if (interaction.customId.startsWith("deny-reason-")) {
			let userID = interaction.customId.split('deny-reason-')[1];
			let user = interaction.client.users.cache.get(userID);

			let reason = interaction.fields.getTextInputValue('reasonInput');

			interaction.deferUpdate();

			if (reason.length > 0) {
				return await user.send(`Your application request was denied.\nReason: **${reason}**`)
			}

			return await user.send(`Your application request was denied.`)
		}
	}
});

client.on('guildMemberAdd', member => {
    
});

// Login to Discord with your client's token
client.login(token);