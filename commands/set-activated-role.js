const { SlashCommandBuilder } = require('@discordjs/builders');
const {  get } = require('../settings');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-activated-role')
        .setDescription('Sets the role that the bot gives users upon being activated.')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The activation role')
                .setRequired(true)),
    async execute(interaction) {
        if(!interaction.memberPermissions.has('ADMINISTRATOR')) return await interaction.reply({ content: `You cannot perform this action!`, ephemeral: true });
        get(interaction.guildId).set("activated-role", interaction.options.getRole('role').id);
        return await interaction.reply({ content: `Set server's activated role to ${interaction.options.getRole('role')}!`, ephemeral: true });
	},
};
