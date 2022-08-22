const { SlashCommandBuilder } = require('@discordjs/builders');
const {  get } = require('../settings');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-verified-channel')
        .setDescription('Sets the channel that the bot uses to announce that a user has been verified.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The verified channel')
                .setRequired(true)),
    async execute(interaction) {
        if(!interaction.memberPermissions.has('ADMINISTRATOR')) return await interaction.reply({ content: `You cannot perform this action!`, ephemeral: true });
        get(interaction.guildId).set("verified-channel", interaction.options.getChannel('channel').id);
        return await interaction.reply({ content: `Set server's verified channel to <#${interaction.options.getChannel('channel').id}>!`, ephemeral: true });
	},
};
