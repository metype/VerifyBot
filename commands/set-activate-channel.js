const { SlashCommandBuilder } = require('@discordjs/builders');
const {  get } = require('../settings');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-activate-channel')
        .setDescription('Sets the channel that the bot sends activation requests to.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The activation channel')
                .setRequired(true)),
    async execute(interaction) {
        if(!interaction.memberPermissions.has('ADMINISTRATOR')) return await interaction.reply({ content: `You cannot perform this action!`, ephemeral: true });
        get(interaction.guildId).set("activate-channel", interaction.options.getChannel('channel').id);
        return await interaction.reply({ content: `Set server's activate channel to <#${interaction.options.getChannel('channel').id}>!`, ephemeral: true });
	},
};
