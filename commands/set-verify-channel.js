const { SlashCommandBuilder } = require('@discordjs/builders');
const { set, get } = require('../settings');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-verify-channel')
        .setDescription('Sets the channel that the bot uses for verification of joining users.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The verification channel')
                .setRequired(true)),
    async execute(interaction) {
        if(!interaction.memberPermissions.has('ADMINISTRATOR')) return await interaction.reply({ content: `You cannot perform this action!`, ephemeral: true });
        get(interaction.guildId).set("verify-channel", interaction.options.getChannel('channel').id);
        return await interaction.reply({ content: `Set server's verify channel to <#${interaction.options.getChannel('channel').id}>!`, ephemeral: true });
	},
};
