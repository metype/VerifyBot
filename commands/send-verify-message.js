const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { get } = require('../settings');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('send-verify-message')
        .setDescription('Sets the channel that the bot uses for verification of joining users.'),
        // .addChannelOption(option =>
        //     option.setName('channel')
        //         .setDescription('The verification channel')
        //         .setRequired(true)),
    async execute(interaction) {
        if(!interaction.memberPermissions.has('ADMINISTRATOR')) return await interaction.reply({ content: `You cannot perform this action!`, ephemeral: true });
        let channelID = get(interaction.guildId).get("verify-channel").object;
        let channel = interaction.client.channels.cache.get(channelID);
        const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('activate-account')
					.setLabel('Activate Account')
					.setStyle(ButtonStyle.Primary),
        )
        interaction.reply({ content: `Message sent.`, ephemeral: true })
        return await channel.send({ content: 'Click the button to get your account activated and whitelisted on the server!', components: [row] });
	},
};
